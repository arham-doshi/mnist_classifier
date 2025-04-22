# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import base64
import io
from PIL import Image
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the model (update path as needed)
MODEL_PATH = "../models/mnist_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_image(base64_string):
    # Extract the base64 encoded image data (remove the data:image/png;base64, prefix)
    image_data = re.sub('^data:image/.+;base64,', '', base64_string)
    
    # Decode the base64 string
    image_bytes = base64.b64decode(image_data)
    
    # Create an image from the bytes
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to grayscale
    image = image.convert('L')
    
    # Resize to 28x28 (MNIST format)
    image = image.resize((28, 28))
    
    # Convert to numpy array and normalize
    image_array = np.array(image)
    
    # Invert colors (MNIST has white digits on black background)
    image_array = 255 - image_array
    
    # Normalize pixel values to range [0, 1]
    image_array = image_array / 255.0
    
    # Reshape to match model input shape
    image_array = image_array.reshape(1, 28, 28)
    
    return image_array

@app.route('/predict', methods=['POST'])
def predict():
    print("Received request for prediction")
    if not request.json or 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Get the base64 encoded image
        base64_image = request.json['image']
        
        # Preprocess the image
        processed_image = preprocess_image(base64_image)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predicted_class = np.argmax(predictions, axis=1)[0]
        confidence = float(predictions[0][predicted_class])
        
        # Return the predicted class and confidence
        return jsonify({
            'predicted_class': int(predicted_class),
            'confidence': confidence
        })
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)