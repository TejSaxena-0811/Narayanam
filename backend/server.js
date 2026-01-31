import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(express.json());
app.use(cors());


// for localhost:
// const connectDB = async function(){
//     try{
//         await mongoose.connect(process.env.MONGODB_URL);
//         console.log("connected with database :)");
//     }
//     catch(err){
//         console.log(err);
//     }
// }




// for deployment:
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("connected with database :)");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

// connect DB on every request.
app.use(async (req, res, next) => {
  await connectDB();
  next();
});




app.use("/api" , chatRoutes);



if(process.env.NODE_ENV !== "production"){
    app.listen(3000 , () => {
        console.log("server running on port 3000");
        connectDB();
    })
}


export default app;



// app.post("/test" , async function(req , res){ // a post request will be used because when user enters their prompt on the frontend, which when reaches the backend, will generate/create some response.
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [
//                 {
//                     role: "user",
//                     content: req.body.message
//                 }
//             ]
//         })
//     }

//     try{
//         const response = await fetch("https://api.openai.com/v1/chat/completions" , options);
//         const data = await response.json();
//         // console.log(data);
//         res.send(data.choices[0].message.content);
//     }
//     catch(err){
//         console.log(err);
//     }
// })