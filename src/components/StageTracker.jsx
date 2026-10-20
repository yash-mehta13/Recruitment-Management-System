import { STAGES, STAGE_DESCRIPTIONS } from '../constants';

function StageTracker({ current }) {
  const index = STAGES.indexOf(current);
  return (
    <ol className="stage-tracker" aria-label="Recruitment stages">
      {STAGES.map((stage, i) => {
        const state = i < index ? 'done' : i === index ? 'current' : 'todo';
        return (
          <li key={stage} className={`stage ${state}`} aria-current={state === 'current' ? 'step' : undefined} title={STAGE_DESCRIPTIONS[stage]}>
            <span className="stage-dot" aria-hidden="true">{i + 1}</span>
            <span className="stage-name">
              {stage}
              <span className="sr-only">{state === 'done' ? ' (completed)' : state === 'current' ? ' (current)' : ' (upcoming)'}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default StageTracker;
