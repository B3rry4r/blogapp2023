import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import postRoute from './routes/postRoute.js';
import userRoute from './routes/userRoute.js';
import path from 'path';
import dotenv from 'dotenv';



const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
const __dirname =dirname(fileURLToPath(import.meta.url));


// middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '30mb', extended: 'true' }));
app.use(express.urlencoded({ limit: '30mb', extended: 'true' }));
app.use(cors());
app.use("/images", express.static(path.join( __dirname, "/images")));



mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log('MongoDB connected successfully');
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`did not connect ${err}`);
  });

  //FILE UPLOADING
  const storage = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {  
      cb(null, req.body.name)
    }
  });
     
  const upload = multer({ storage: storage });
  
  
  app.post("/api/upload", upload.single("file"), async (req, res) =>{
    res.status(200).json('done')
  });

app.get('/', (req, res) => {
  res.send('Hello IAM4R');
});

app.use('/posts', postRoute);
app.use('/delete', postRoute);
app.use('/user', userRoute);