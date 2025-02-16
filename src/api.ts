import { DetectLabelsCommand, RekognitionClient } from "@aws-sdk/client-rekognition";
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

const rekognitionClient = new RekognitionClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_KEY ?? "",
    secretAccessKey: process.env.AWS_SECRET ?? "",
  },
});

app.get("/test", (_, res) => {
  console.log("Server is running...");
  res.send("OK");
});

app.post("/analysis", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = req.file.path;
  const imageBuffer = fs.readFileSync(imagePath);

  const params: any = {
    Image: { Bytes: imageBuffer },
    MaxLabels: 10,
  };

  try {
    const command = new DetectLabelsCommand(params);
    const data = await rekognitionClient.send(command);

    console.log({ data });

    fs.unlink(imagePath, () => {});

    res.json(data);
  } catch (err: any) {
    fs.unlink(imagePath, () => {});
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(`HTTP Server is running on port 3000`);
});
