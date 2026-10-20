function Notices({ feedback, storageNotice, onDismissFeedback, onDismissStorage }) {
  return (
    <div className="container notices">
      <div role="status" aria-live="polite">
        {feedback && (
          <p className={`notice notice-${feedback.type}`}>
            <span>{feedback.text}</span>
            <button type="button" className="btn-link" onClick={onDismissFeedback}>Dismiss</button>
          </p>
        )}
      </div>
      {storageNotice && (
        <p className="notice notice-warning" role="alert">
          <span>{storageNotice}</span>
          <button type="button" className="btn-link" onClick={onDismissStorage}>Dismiss</button>
        </p>
      )}
    </div>
  );
}

export default Notices;
