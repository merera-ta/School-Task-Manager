export default function LoadingState({ label = "Loading tasks..." }) {
  return (
    <div className="state-box" role="status">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
