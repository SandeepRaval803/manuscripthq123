import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

const Modal = ({ children, onClose }) => (
  <div className="fixed z-40 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
    <div className="bg-white text-end p-4 rounded-lg shadow-lg w-[80%] md:w-[600px]">
      {children}
      <button
        onClick={onClose}
        className="mt-4 bg-gray-600 ml-4 text-white py-2 px-4 rounded-md"
      >
        Cancel
      </button>
    </div>
  </div>
);

const Slider = ({ value, min, max, step, onChange }) => (
  <input
    type="range"
    value={value}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onChange(Number(e.target.value))}
    className="w-full mt-2"
  />
);

const ImageCrop = ({ selectedFile, aspect = 1, onCropComplete, onConfirm, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [localCroppedAreaPixels, setLocalCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setLocalCroppedAreaPixels(croppedPixels);
    if (onCropComplete) {
      onCropComplete(croppedPixels);
    }
  }, [onCropComplete]);

  return (
    <Modal onClose={onClose}>
      <div className="relative w-full h-[300px]">
        <Cropper
          image={URL.createObjectURL(selectedFile)}
          crop={crop}
          zoom={zoom}
          aspect={aspect} 
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <Slider value={zoom} min={1} max={3} step={0.1} onChange={setZoom} />
      <button
        onClick={() => onConfirm(localCroppedAreaPixels)}
        className="mt-4 bg-primary text-white py-2 px-4 rounded-md"
      >
        Update
      </button>
    </Modal>
  );
};

export default ImageCrop;
