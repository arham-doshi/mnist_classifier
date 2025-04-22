// components/DrawingBoard.tsx
"use client"
import React, { useRef, useState, useEffect } from 'react';

interface DrawingBoardProps {
  width: number;
  height: number;
  onImageCapture: (imageData: string) => void;
}

const DrawingBoard: React.FC<DrawingBoardProps> = ({ width, height, onImageCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set up the canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 15;
    context.lineCap = 'round';
    context.strokeStyle = 'black';
  }, [width, height]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get image data and pass it to parent component
    // We convert to grayscale and resize to 28x28 to match MNIST format
    captureImageData();
  };
  const captureImageData = () => {
    const imageData = getProcessedImageData();
    if (imageData) {
      onImageCapture(imageData);
    }
  };
  
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    
    if ('touches' in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
  };
  
  const getProcessedImageData = (): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    // Create a temporary canvas for processing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempContext = tempCanvas.getContext('2d');
    if (!tempContext) return null;
    
    // Draw the original canvas content onto the scaled down canvas
    tempContext.fillStyle = 'white';
    tempContext.fillRect(0, 0, 28, 28);
    tempContext.drawImage(canvas, 0, 0, width, height, 0, 0, 28, 28);
    
    // Convert to grayscale (you could do more processing here)
    const imageData = tempCanvas.toDataURL('image/png');
    return imageData;
  };
  
  return (
    <div className="drawing-board-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        style={{ 
          border: '2px solid #000',
          borderRadius: '8px',
          touchAction: 'none' // Prevents scrolling while drawing on touch devices
        }}
      />
      <div className="controls mt-4">
        <button 
          onClick={clearCanvas}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DrawingBoard;