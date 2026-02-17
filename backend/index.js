import express from 'express';
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import courseRoute from "./routes/course.routes.js"
import fileUpload from 'express-fileupload';
import userRoute from "./routes/user.routes.js"
import adminRoute from "./routes/admin.route.js"
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

const port = process.env.PORT || 3000
const DB_URI = process.env.MONGO_URI

mongoose.connect(DB_URI).then(() => {
    console.log("Connected to mongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB", error);
});

app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})