import express from "express";
import * as tf from "@tensorflow/tfjs";
import natural from "natural";

const app = express();
const port = 6000;

app.use(express.json());

// Load the trained model
const modelPath = "http://localhost:8000/uploads/model.json";
const loadModel = async () => {
  const model = await tf.loadLayersModel(modelPath);
  return model;
};

// Function to tokenize email using the natural library
function tokenizeEmail(email) {
  const tokenizer = new natural.WordTokenizer();
  return tokenizer.tokenize(email);
}

// Function to convert tokenized email to TF-IDF vector using natural library
function convertToTFIDF(tokenizedEmail) {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(tokenizedEmail);

  const tfidfVector = tfidf
    .listTerms()
    .map((term) => tfidf.tfidf(term, tokenizedEmail));
  return tf.tensor2d([tfidfVector]);
}

// Endpoint to receive email data
app.post("/predict", async (req, res) => {
  try {
    // Receive email data here (assuming it's in req.body.email)
    const emailContent = req.body.email;

    // Preprocess the email data
    const tokenizedEmail = tokenizeEmail(emailContent);
    const emailTensor = convertToTFIDF(tokenizedEmail);

    // Load the trained model
    const model = await loadModel();

    // Make predictions using the model
    const predictions = model.predict(emailTensor);

    // Extract prediction and confidence score
    const confidenceScore = predictions.dataSync()[0];
    const isPhishing = confidenceScore > 0.5;

    let intensityLevel;
    if (confidenceScore >= 0.9) {
      intensityLevel = "High Intensity Phishing";
    } else if (confidenceScore >= 0.7) {
      intensityLevel = "Moderate Intensity Phishing";
    } else if (confidenceScore >= 0.5) {
      intensityLevel = "Low Intensity Phishing";
    } else {
      intensityLevel = "Safe";
    }

    // Send back the prediction and confidence score
    res.json({ isPhishing, confidenceScore, intensityLevel });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
