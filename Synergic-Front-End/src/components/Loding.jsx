import "../style/components-style/loading.css";
function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}

export default Loading;
