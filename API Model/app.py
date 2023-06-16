# from flask import Flask, request, jsonify
# import tensorflow as tf
# import os
# import requests
# import numpy as np
# from tensorflow import keras
# import requests


# app = Flask(__name__)

# # # Load model.h5
# # model = keras.models.load_model('model.h5')

# # Load the tokenizer and model
# tokenizer = tf.keras.preprocessing.text.Tokenizer()
# max_sequence_length = 47  # Sesuaikan dengan panjang maksimum urutan yang digunakan saat training
# model = tf.keras.models.load_model("model.h5")

# # Preprocess data
# def preprocess_data(texts):
#     sequences = tokenizer.texts_to_sequences(texts)
#     sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, maxlen=max_sequence_length)
#     return sequences

# # Postprocess data
# def postprocess_data(predictions):
#     categories = ["Zumba Dance", "Yoga Dance", "Cardio", "Aerobic", "Healthy", "Fitness"]
#     categories = [categories[i] for i in predictions.argmax(axis=1)]
#     return categories

# # Predict function
# def predict(request):
#     data = request.get_json()
#     if data is None or "texts" not in data:
#         return jsonify({"error": "Invalid request data"}), 400

#     texts = data["texts"]
#     inputs = preprocess_data(texts)  # Preprocess the input data
#     outputs = model.predict(inputs)  # Make predictions
#     results = postprocess_data(outputs)  # Postprocess the predictions
#     return jsonify(results)

# # Set up the Flask app
# app = Flask(__name__)

# @app.route("/predict", methods=["POST"])
# def prediction():
#     result = predict(request)
#     return result

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8084)))

from flask import Flask, request, jsonify
import tensorflow as tf
import os
from tensorflow import keras

app = Flask(__name__)

# Load the tokenizer and model
tokenizer = tf.keras.preprocessing.text.Tokenizer()
max_sequence_length = 47  # Sesuaikan dengan panjang maksimum urutan yang digunakan saat training
model = tf.keras.models.load_model("model.h5")

# Preprocess data
def preprocess_data(texts):
    sequences = tokenizer.texts_to_sequences(texts)
    sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, maxlen=max_sequence_length)
    return sequences

# Postprocess data
def postprocess_data(predictions):
    categories = ["Zumba Dance", "Yoga Dance", "Cardio", "Aerobic", "Healthy", "Fitness"]
    categories = [categories[i] for i in predictions.argmax(axis=1)]
    return categories

# Predict function
def predict(request):
    data = request.get_json()
    if data is None or "texts" not in data:
        return jsonify({"error": "Invalid request data"}), 400

    texts = data["texts"]
    inputs = preprocess_data(texts)  # Preprocess the input data
    outputs = model.predict(inputs)  # Make predictions
    results = postprocess_data(outputs)  # Postprocess the predictions
    return jsonify({"predictions": results})

@app.route("/predict", methods=["POST"])
def prediction():
    result = predict(request)
    return result

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8084)))
