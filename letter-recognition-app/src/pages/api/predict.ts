// pages/api/predict.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Interface for the expected request body
interface PredictRequestBody {
  image: string; // Base64 encoded image
}

// Interface for the response data
interface PredictResponseData {
  predictedLetter: string;
  confidence: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PredictResponseData | { error: string }>
) {
    console.log("sending api request");
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body as PredictRequestBody;
    
    if (!image) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    // Here we would send the image to your ML backend
    // For example, with Python Flask running your prediction code
    const backendResponse = await fetch(' http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    });
    console.log("backend Response", backendResponse);

    if (!backendResponse.ok) {
      throw new Error('Backend prediction failed');
    }

    const prediction = await backendResponse.json();
    
    // Return the prediction result
    return res.status(200).json({
      predictedLetter: prediction.predicted_class.toString(),
      confidence: prediction.confidence || 0.0,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return res.status(500).json({ error: 'Failed to process prediction' });
  }
}