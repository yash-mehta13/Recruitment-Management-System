# Deploying to Amazon S3

> This repository does not deploy anything. Nothing here was run against AWS. Do not commit AWS credentials.

## Historical deployment (October 2025 report)
| Item | Reported value |
| --- | --- |
| Bucket | `recruitmentmanagementsystem` |
| Region | `eu-north-1` (Europe, Stockholm) |
| Hosting | S3 static website hosting; index `index.html`, error `404.html` |
| Access | Bucket policy allowing `s3:GetObject` for `Principal: "*"` |
| Versioning / class | Enabled / S3 Standard |
| URL | `http://recruitmentmanagementsystem.s3-website.eu-north-1.amazonaws.com` |

Observed **2026-10-20**: requesting that URL returned HTTP 404 with `Code: NoSuchBucket`. The bucket no longer exists, so the historical site is offline and the URL must not be presented as a live demo. These are facts from the report plus that one check; current AWS state is not otherwise known.

The report's `index.html` was about 397 bytes. For comparison, the *original* repository's build (before the fixes in this branch) produced a 0.38 kB `index.html` and no JavaScript bundle, because of a misnamed Vite config and a missing `type="module"`. That is consistent with an unbundled entry file but does not prove what was uploaded. The current build's `index.html` is about 0.66 kB and is not comparable.

## Prerequisites
Node.js 22.12+, an AWS account you control, and either the S3 console or the AWS CLI configured through your own credential mechanism (SSO or an IAM role preferred). Never put keys in this repo.

## Build
```bash
npm ci
npm run build
```
Vite writes **`dist/`** (not CRA's `build/`):
```
dist/index.html
dist/assets/index-<hash>.js
dist/assets/index-<hash>.css
dist/favicon.svg
dist/robots.txt
```
Asset paths are relative (`base: './'`), so it works at a bucket root or under a prefix. Test locally with `npm run preview`.

## S3 concepts
- **Static website endpoint** (`<bucket>.s3-website.<region>.amazonaws.com`) serves an index and error document but supports **HTTP only**, not HTTPS.
- It requires objects to be publicly readable (bucket policy + Block Public Access relaxed). Everything in the bucket is then readable by anyone on the internet.
- The app is a single page with no client-side routes, so the error document is only for missing files; `404.html` is optional and is not part of this repo's build.

## Option A: quick public demo (matches the report; demo data only)
1. Create a bucket, then enable static website hosting with index `index.html`.
2. Turn off Block Public Access for this bucket only and attach a read policy limited to the bucket's objects (see AWS docs for the policy form).
3. Upload the **contents** of `dist/` (keep the `assets/` folder), e.g. `aws s3 sync dist/ s3://YOUR_BUCKET --delete`. Review `--delete` before using it; with versioning on, old versions are retained.
4. Open the website endpoint (HTTP).

## Option B: recommended for anything shared widely
Keep the bucket **private** with Block Public Access on, and serve it through **CloudFront with Origin Access Control (OAC)**. This gives HTTPS and avoids a public bucket. Set `index.html` as the default root object.

## Verify
- [ ] `npm run build` succeeds; `npm run preview` works.
- [ ] `dist/index.html` references files that exist in `dist/assets/`.
- [ ] Uploaded files kept their folder layout.
- [ ] Endpoint loads, no console errors, company tabs and CSV export work.
- [ ] The page contains only the synthetic demo data and no secrets.
- [ ] If public: you accept that every file is world-readable.

## Troubleshooting
| Symptom | Likely cause |
| --- | --- |
| `NoSuchBucket` | Wrong name/region or bucket deleted (what the historical URL returns now) |
| 403 Forbidden | Missing public-read policy, Block Public Access still on, or (OAC) wrong bucket policy |
| Blank page, 404 on `assets/...` | Uploaded `dist/` folder itself or lost `assets/`; upload its contents |
| Stale content | Browser/CloudFront cache; invalidate CloudFront or hard-reload |
| HTTPS fails | S3 website endpoints are HTTP only; use CloudFront |

## Important limitation
Hosting on S3 does not add a database. A deployed copy still stores candidate edits only in each visitor's browser.

## AWS references (documentation links; not fetched in the authoring session, please confirm they are current)
- Hosting a static website on S3: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html
- Setting up a static website (cited by the report): https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html
- Website endpoints: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
- Block Public Access: https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html
- CloudFront with an S3 origin and OAC: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
