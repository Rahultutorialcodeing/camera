"use client";

import { useState } from "react";

export default function PhotoCapture() {
  const [capture, setCapture] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  // console.log(photo)

  const startCamera = async () => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCapture(stream);
      console.log(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const stopCamera = () => {
    if (capture) {
      capture.getTracks().forEach((track) => track.stop());
      setCapture(null);
    }
  };

  const capturePhoto = () => {
    const videoElement = document.querySelector("video") as HTMLVideoElement;
    const canvasElement = document.querySelector("canvas") as HTMLCanvasElement;

    if (videoElement && canvasElement) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      const context = canvasElement.getContext("2d");
      if (context) {
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const photoData = canvasElement.toDataURL("image/png");
        setPhoto(photoData);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Video Tag */}
      <video
        className="w-1/2 rounded-md"
        autoPlay
        playsInline
        ref={(video) => {
          if (video && capture) {
            video.srcObject = capture;
          }
        }}
      ></video>

      {/* Canvas (Hidden) */}
      <canvas className="hidden"></canvas>

      {/* Display Captured Photo */}
      {photo && (
        
        <div className="mt-4">
          <img src={photo} alt="Captured" className="w-1/2 rounded-md" />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Start Camera
        </button>
        <button
          onClick={capturePhoto}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
          disabled={!capture}
        >
          Capture Photo
        </button>
        <button
          onClick={stopCamera}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
}
