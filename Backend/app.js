import express from "express";
import * as tf from "@tensorflow/tfjs";
import natural from "natural";

const app = express();
const port = 3000;

// configuration
app.use(express.json());
app.use(cors())
// Load the trained model
const modelPath = "https://greenlock.onrender.com/uploads/model.json";
const loadModel = async () => {
  const model = await tf.loadLayersModel(modelPath);
  return model;
};

// Function to tokenize emails using the natural library
function tokenizeEmails(emails) {
  const tokenizer = new natural.WordTokenizer();
  return emails.map((email) => tokenizer.tokenize(email));
}

// Function to convert tokenized emails to TF-IDF vectors using natural library
function convertToTFIDF(tokenizedEmails) {
  const tfidf = new natural.TfIdf();
  const tfidfVectors = [];
  tokenizedEmails.forEach((emailTokens) => {
    const vector = new Array(1000).fill(0); // Initialize TF-IDF vector with zeros
    tfidf.addDocument(emailTokens);
    tfidf.listTerms().forEach((term) => {
      const index = parseInt(term.id); // Convert term ID to integer
      if (index < 1000) {
        // Ensure index is within bounds
        vector[index] = tfidf.tfidf(term.term, emailTokens); // Update TF-IDF value at the corresponding index
      }
    });
    tfidfVectors.push(vector);
  });
  return tf.tensor2d(tfidfVectors);
}

// Endpoint to receive email data
app.post("/predict", async (req, res) => {
  try {
    // Preprocess the email data
    const tokenizedEmails = tokenizeEmails(req.body.emails);
    const emailTensors = convertToTFIDF(tokenizedEmails);

    // Load the trained model
    const model = await loadModel();

    // Make predictions using the model
    const predictions = model.predict(
      emailTensors.reshape([emailTensors.shape[0], 1000])
    );

    // Extract prediction and confidence score
    const isPhishing = predictions.dataSync()[0] > 0.2;
    const confidenceScore = predictions.dataSync()[0];

    // Send back the prediction and confidence score
    res.json({ isPhishing, confidenceScore });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
