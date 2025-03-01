var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b;
import { DetectLabelsCommand, RekognitionClient } from "@aws-sdk/client-rekognition";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";
dotenv.config();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: "*",
}));
var upload = multer({ dest: "uploads/" });
var rekognitionClient = new RekognitionClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: (_a = process.env.AWS_KEY) !== null && _a !== void 0 ? _a : "",
        secretAccessKey: (_b = process.env.AWS_SECRET) !== null && _b !== void 0 ? _b : "",
    },
});
app.get("/test", function (_, res) {
    console.log("Server is running...");
    res.send("OK");
});
app.post("/analysis", upload.single("image"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var imagePath, imageBuffer, params, command, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: "No file uploaded" })];
                }
                imagePath = req.file.path;
                imageBuffer = fs.readFileSync(imagePath);
                params = {
                    Image: { Bytes: imageBuffer },
                    MaxLabels: 10,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                command = new DetectLabelsCommand(params);
                return [4 /*yield*/, rekognitionClient.send(command)];
            case 2:
                data = _a.sent();
                console.log({ data: data });
                fs.unlink(imagePath, function () { });
                res.json(data);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                fs.unlink(imagePath, function () { });
                res.status(500).json({ error: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () {
    console.log("HTTP Server is running on port 3000");
});
