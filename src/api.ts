import AWS from "aws-sdk";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: "*",
  })
);

const upload = multer({ dest: "uploads/" });

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "us-east-1",
});
const rekognition = new AWS.Rekognition();

app.get("/test", (_, res) => {
  console.log("Server is running...");
  res.send("OK");
});

app.post("/analysis", upload.single("image"), (req, res) => {
  console.log("hello WOrld");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = req.file.path;
  const imageBuffer = fs.readFileSync(imagePath);

  const params = {
    Image: { Bytes: imageBuffer },
    MaxLabels: 10,
  };

  rekognition.detectLabels(params, (err, data) => {
    fs.unlink(imagePath, () => {});

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    console.log({ data });

    res.json(data);
  });
});

app.listen(3000, () => {
  console.log(`HTTP Server is running on port 3000`);
});
