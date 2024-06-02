import fs from "fs";
import csv from "csv-parser";

const emails = [];
const labels = [];

// Data Preparation
fs.createReadStream("./data/Phishing_Email.csv")
  .pipe(csv())
  .on("data", (row) => {
    emails.push(row["Email Text"]);
    labels.push(row["Email Type"] === "Safe Email" ? 0 : 1);
  })
  .on("end", () => {
    console.log("CSV file successfully processed.");
    console.log("Labels:", labels);
    const data = { emails, labels };
    fs.writeFileSync("./data/dataset.json", JSON.stringify(data));
  });
