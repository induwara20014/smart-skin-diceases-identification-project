import json
import os
import sys

# Suppress TensorFlow logging to prevent breaking the JSON output read by Node.js
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    import numpy as np
    import tensorflow as tf
    from PIL import Image
except ImportError as e:
    # If packages are not installed, return a JSON error
    print(json.dumps({"label": f"Model Error: Missing module {str(e)}", "confidence": 0.0}))
    sys.exit(0)

labels = [
    'Eczema',
    'Scabies',
    'Tinea-Corporis',
    'ch-Chickenpox-Varicela',
    'skin-cancer'
]

def main():
    # Usage: python predict.py <image_path>
    if len(sys.argv) < 2:
        print(json.dumps({"label": "Unknown", "confidence": 0.0}))
        return

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(json.dumps({"label": "Unknown", "confidence": 0.0}))
        return

    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, "..", "skin_model.h5")

    try:
        # Load the user's trained model
        model = tf.keras.models.load_model(model_path)
        
        # Standard input size for most image models
        target_size = (128, 128) 
        
        try:
            # We attempt to read the TARGET_SIZE from the environment if specified (.env passes this occasionally)
            env_size = os.getenv("MODEL_INPUT_SIZE")
            if env_size:
                target_size = (int(env_size), int(env_size))
        except:
            pass

        # Image Preprocessing
        img = Image.open(image_path).convert('RGB')
        img = img.resize(target_size)
        
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
        
        # Scale pixel values to 0-1
        img_array /= 255.0

        # Run inference
        predictions = model.predict(img_array, verbose=0)
        
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        
        # Map back to string label
        if predicted_idx < len(labels):
            label = labels[predicted_idx]
        else:
            label = "Unknown"

        # Print the exact JSON format expected by the Node.js backend
        print(json.dumps({
            "label": label, 
            "confidence": round(confidence, 4)
        }))

    except Exception as e:
        print(json.dumps({"label": f"Prediction failed: {str(e)}", "confidence": 0.0}))

if __name__ == "__main__":
    main()

