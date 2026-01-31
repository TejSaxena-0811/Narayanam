import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(express.json());
app.use(cors());




mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully :)"))
  .catch(err => console.log(err));




app.use("/api" , chatRoutes);



app.get("/", (req, res) => {
  res.send("Narayanam backend is running.");
});




export default app;





// const connectDB = async function(){
//     try{
//         await mongoose.connect(process.env.MONGODB_URL);
//         console.log("connected with database :)");
//     }
//     catch(err){
//         console.log(err);
//     }
// }


// app.listen(3000 , () => {
//     console.log("server running on port 3000");
//     connectDB();
// })


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