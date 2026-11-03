export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="state-box">
      {Icon && (
        <div className="state-icon">
          <Icon size={28} aria-hidden="true" />
        </div>
      )}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
