import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState , useContext , useEffect } from "react";
import {PacmanLoader , ClimbingBoxLoader , RingLoader} from "react-spinners";


function ChatWindow(){
    const {prompt , setPrompt , reply , setReply , currThreadId , setPrevChats , setNewChat} = useContext(MyContext);
    const [loading , setLoading] = useState(false);
    const [isOpen , setIsOpen] = useState(false); // for dropdown;

    function inputMsg(event){
        setPrompt(event.target.value);
    }

    async function getReply(){
        if(!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        }

        try{
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat` , options);
            const res = await response.json();
            // console.log(response);
            // console.log(res);
            setReply(res.reply);
            setLoading(false);
        }
        catch(err){
            console.log(err);
        }

        // setLoading(false);
    }

    // appending new chats to prevChats
    useEffect(() => {
        if (!reply) return;

        setPrevChats(prev => [
            ...prev,
            { role: "user", content: prompt },
            { role: "assistant", content: reply }
        ]);

        setPrompt("");
    }, [reply]);



    function handleProfileClick(){
        setIsOpen(!isOpen);
    }

    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>Narayanam AI</span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {
                isOpen ?
                <div className="dropdown">
                    <div className="dropdownItem"><a href="https://github.com/TejSaxena-0811/Narayanam" target="_blank"><i className="fa-brands fa-github"></i>Github Repo</a></div>
                </div>
                :
                null
            }

            <div className="chatArea">
                <Chat />
            </div>


            <div className="loader">
                {/* <PacmanLoader color="white" loading={loading} /> */}
                {/* <ClimbingBoxLoader color="white" loading={loading} /> */}
                <RingLoader color="white" loading={loading} />
            </div>


            <div className="chatInput">
                <div className="inputBox">
                    <input type="text" placeholder="Ask anything" value={prompt} onChange={inputMsg} onKeyDown={(event) => event.key === 'Enter' ? getReply() : ''}/>
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    This project is built with love and effort :)
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;