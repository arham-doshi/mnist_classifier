// services/predictionService.ts

export interface PredictionResponse {
    predictedLetter: string;
    confidence: number;
  }
  
  /**
   * Sends the drawing to the backend API for prediction
   * @param imageData - Base64 encoded image data from the canvas
   */
  export const getPrediction = async (imageData: string): Promise<PredictionResponse> => {
    try {
      console.log('Sending image data to backend:');
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
  
      if (!response.ok) {
        throw new Error('Prediction request failed');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting prediction:', error);
      throw error;
    }
  };