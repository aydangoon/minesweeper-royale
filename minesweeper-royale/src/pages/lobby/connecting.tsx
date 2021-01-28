export function Connecting() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <h1>Connecting To Lobby</h1>
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
