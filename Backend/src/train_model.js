import fs from "fs";
import natural from "natural";
import * as tf from "@tensorflow/tfjs";

let TfIdf = natural.TfIdf;
let tfidf = new TfIdf();

const VECTOR_LENGTH = 1000; // Fixed length for TF-IDF vectors

// Function to tokenize emails using the natural library
function tokenizeEmails(emails) {
  const tokenizer = new natural.WordTokenizer();
  return emails.map((email) => tokenizer.tokenize(email));
}

// Function to convert tokenized emails to TF-IDF vectors using natural library
function convertToTFIDF(tokenizedEmails) {
  tokenizedEmails.forEach((emailTokens) => {
    tfidf.addDocument(emailTokens);
  });

  const tfidfVectors = tokenizedEmails.map((emailTokens) => {
    const vector = new Array(VECTOR_LENGTH).fill(0);
    tfidf.listTerms().forEach((term, index) => {
      if (index < VECTOR_LENGTH) {
        vector[index] = tfidf.tfidf(term.term, 0);
      }
    });
    return vector;
  });

  return tf.tensor2d(tfidfVectors, [tfidfVectors.length, VECTOR_LENGTH]);
}

// Load data from JSON file
const data = JSON.parse(fs.readFileSync("data/dataset.json"));
const emails = data.emails;
const labels = data.labels;

// Tokenize emails
const tokenizedEmails = tokenizeEmails(emails);

// Convert tokenized emails to TF-IDF vectors
const emailTensors = convertToTFIDF(tokenizedEmails);
const labelTensors = tf.tensor1d(labels, "int32");

// Model Building and Training (remaining code)
const model = tf.sequential();

model.add(
  tf.layers.dense({
    units: 128,
    inputShape: [VECTOR_LENGTH],
    activation: "relu",
  })
);
model.add(tf.layers.dropout({ rate: 0.2 }));
model.add(tf.layers.dense({ units: 64, activation: "relu" }));
model.add(tf.layers.dropout({ rate: 0.2 }));
model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

model.compile({
  optimizer: tf.train.adam(),
  loss: "binaryCrossentropy",
  metrics: ["accuracy"],
});

const trainModel = async () => {
  await model.fit(emailTensors, labelTensors, {
    epochs: 10,
    batchSize: 32,
    validationSplit: 0.2,
  });

  await model.save("http://localhost:8000/upload");
  console.log("Training Complete");
};

trainModel();

// import fs from "fs";
// import natural from "natural";
// import * as tf from "@tensorflow/tfjs";

// let TfIdf = natural.TfIdf;
// let tfidf = new TfIdf();

// // Function to tokenize emails using the natural library
// function tokenizeEmails(emails) {
//   const tokenizer = new natural.WordTokenizer();
//   return emails.map((email) => tokenizer.tokenize(email));
// }

// // Function to convert tokenized emails to TF-IDF vectors using natural library
// function convertToTFIDF(tokenizedEmails) {
//   tokenizedEmails.forEach((emailTokens) => {
//     tfidf.addDocument(emailTokens);
//   });

//   const tfidfVectors = [];
//   tokenizedEmails.forEach((emailTokens) => {
//     const vector = tfidf
//       .listTerms()
//       .map((term) => tfidf.tfidf(term, emailTokens));
//     tfidfVectors.push(vector);
//   });

//   return tf.tensor2d(tfidfVectors);
// }

// // Load data from JSON file
// const data = JSON.parse(fs.readFileSync("data/dataset.json"));
// const emails = data.emails;
// const labels = data.labels;

// // Tokenize emails
// const tokenizedEmails = tokenizeEmails(emails);

// // Convert tokenized emails to TF-IDF vectors
// const emailTensors = convertToTFIDF(tokenizedEmails);
// const labelTensors = tf.tensor1d(labels, "int32");

// // Model Building and Training (remaining code)
// const model = tf.sequential();

// model.add(
//   tf.layers.dense({
//     units: 128,
//     inputShape: [emailTensors.shape[1]],
//     activation: "relu",
//   })
// );
// model.add(tf.layers.dropout({ rate: 0.2 }));
// model.add(tf.layers.dense({ units: 64, activation: "relu" }));
// model.add(tf.layers.dropout({ rate: 0.2 }));
// model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

// model.compile({
//   optimizer: tf.train.adam(),
//   loss: "binaryCrossentropy",
//   metrics: ["accuracy"],
// });

// const trainModel = async () => {
//   await model.fit(emailTensors, labelTensors, {
//     epochs: 10,
//     batchSize: 32,
//     validationSplit: 0.2,
//   });
// };

// trainModel().then(() => {
//   console.log("Training Complete");
//   model.save(`http://localhost:8000/upload`);
// });
