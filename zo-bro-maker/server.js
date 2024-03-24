import fs from "fs";
import { generateBro } from "./bro-generator.js";
import { generateBae } from "./bro-generator.js";
import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import csv from "csv-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static("public"));

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/saveChanges", (req, res) => {
  const updatedData = req.body.updatedData;
  let updatedCSV = "";
  let headers = "";
  updatedData.forEach((row, index) => {
    if (index === 0) {
      headers = Object.keys(row).join(",") + "\n";
    }
    updatedCSV += Object.values(row).join(",") + "\n";
  });
  fs.writeFile(
    "assets/Baes/background/list.csv",
    headers + updatedCSV,
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving changes");
      } else {
        console.log("Changes saved successfully");
        res.status(200).send("Changes saved successfully");
      }
    }
  );
});

app.get("/generate-bro", generateBro);
app.get("/generate-bae", generateBae);

app.use(cors());

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
