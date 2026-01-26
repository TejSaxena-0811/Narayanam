import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user" , "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})


// messageSchema's "only" role is to be part of a thread, so im writing them in the same file.


const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default : "New Chat" // new convo
    },
    messages: [MessageSchema], // this means everything from the MessageSchema will also be in this messages column of ThreadSchema.
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})


export default mongoose.model("Thread" , ThreadSchema); // exporting ThreadSchema as "Thread"