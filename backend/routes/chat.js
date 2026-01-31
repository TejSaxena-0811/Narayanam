import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";


const router = express.Router();


// testing
router.post("/test" , async function(req , res){
    try{
        const thread = new Thread({
            threadId: "123xyz",
            title: "testing new threadd"
        })

        const response = await thread.save();
        res.send(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to save in DB."});
    }
})





// display all threads

// router.get("/thread" , async function(req , res){
//     try{
//         const threads = await Thread.find({}).sort({updatedAt: -1}); // -1 means descending order. threads will be printed according to "update time". most recent data on top.
//         res.json(threads);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: "Failed to fetch Chats."});
//     }
// })


router.get("/thread", async function (req, res) {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }).lean();
    res.status(200).json(threads || []);
  } catch (err) {
    console.error("GET /thread failed:", err);
    res.status(200).json([]);
  }
});




// display a particular thread
router.get("/thread/:threadId" , async function(req , res){
    try{
        const {threadId} = req.params;
        const thread = await Thread.findOne({threadId});
        
        if (!thread) {
            return res.status(200).json([]); // frontend expects array
        }

        res.status(200).json(thread.messages);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat."});
    }
})




// delete a thread
router.delete("/thread/:threadId" , async function(req , res){
    try{
        const {threadId} = req.params;
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread){
            res.status(404).json({error: "Chat not found."});
        }

        res.status(200).json({success: "Thread deleted successfully."});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to delete chat."});
    }
})




// saving user's message and model's reply to DB, and sending the reply to frontend.
router.post("/chat" , async function(req , res){
    try{
        const {threadId , message} = req.body;
        if(!threadId || !message){
            return res.status(200).json({reply: ""});
        }

        let thread = await Thread.findOne({threadId});
        if(!thread){
            // create a new thread in DB
            thread = new Thread({
                threadId,
                title: message, // title of the chat will be same as the message entered by the user.
                messages: [{role: "user" , content: message}] // array of objects
            })
        }
        else{
            thread.messages.push({role: "user" , content: message});
        }


        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assistant" , content: assistantReply}); // storing model's response in the DB
        thread.updatedAt = new Date();
        await thread.save();

        res.status(200).json({ reply: assistantReply });
    }
    catch(err){
        console.error("POST /chat failed:", err);
        res.status(200).json({ reply: "" }); // always sending the reply field. (found through debugging)
    }
})


export default router;