import React from "react";

function OverlayImage({ img, setPreviewMainImg }) {
  function overlayClick(e) {}
  return (
    <div className="overlay" onClick={() => setPreviewMainImg(false)}>
      <div className="overlay--image" onClick={(e) => e.stopPropagation()}>
        {img}
      </div>
    </div>
  );
}

export default OverlayImage;
