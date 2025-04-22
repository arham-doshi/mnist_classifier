"use client"
// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import DrawingBoard from '../components/DrawingBoard';
import { getPrediction, PredictionResponse } from '../services/predictionService';

const Home: NextPage = () => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleDrawingComplete = async (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handlePredictClick = async () => {
    if (!capturedImage) {
      setError('Please draw something first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getPrediction(capturedImage);
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Letter Recognition App</title>
        <meta name="description" content="Draw a letter and get it recognized" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-200">
        <h1 className="text-5xl font-extrabold mb-10 text-gray-800 tracking-tight">
          Letter Recognition
        </h1>
  
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transition-all duration-300">
          <p className="text-lg text-gray-700 mb-6">Draw a letter in the box below:</p>
  
          <DrawingBoard
            width={280}
            height={280}
            onImageCapture={handleDrawingComplete}
          />
  
          <div className="mt-8 space-y-4">
            {loading && (
              <div className="flex justify-center">
                <p className="text-blue-600 font-medium animate-pulse">Analyzing your drawing...</p>
              </div>
            )}
  
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md">
                <p>{error}</p>
              </div>
            )}
  
            {prediction && !loading && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Prediction Result</h3>
                <p className="text-4xl font-extrabold text-center">{prediction.predictedLetter}</p>
                <p className="text-sm text-center mt-1">
                  Confidence: <span className="font-medium">{Math.round(prediction.confidence * 100)}%</span>
                </p>
              </div>
            )}
  
            <button
              onClick={handlePredictClick}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl w-full transition duration-200"
            >
              Predict
            </button>
          </div>
        </div>
      </main>
  
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>Letter Recognition App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
    

};

export default Home;