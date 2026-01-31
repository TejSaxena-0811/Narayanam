import "./Chat.css";
import { useContext , useState , useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";



function Chat(){
    const {newChat , prevChats , reply} = useContext(MyContext);
    const [latestReply , setLatestReply] = useState(null);
    const [headingText, setHeadingText] = useState("");
    
    let headings = ["Ready when you are." , "Start anywhere. I'm listening." , "Got a thought? Let’s unpack it." , "Ask me anything." , "Type it. I'll code it."];

    useEffect(() => {
        if(!headingText){
            const randomIndex = Math.floor(Math.random() * headings.length);
            setHeadingText(headings[randomIndex]);
        }

        if(reply === null){
            setLatestReply(null); // load previous chat
            return;
        }

        if(!prevChats?.length){
            return;
        }
        
        // const content = reply.split(" "); // individual words

        if (typeof reply !== "string") return;
        const content = reply.split(" ");


        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0 , idx + 1).join(" "));
            idx++;
            if(idx >= content.length){
                clearInterval(interval);
            }
        } , 40)

        return () => clearInterval(interval);


    } , [prevChats , reply , headingText])



    return(
        <div>
            {newChat ? <h1>{headingText}</h1> : null}
            <div className="chats">
                {
                    prevChats?.slice(0,-1).map((chat , idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "narayanamDiv"} key={idx}>
                            {
                                chat.role === "user" ? <p className="userMessage">{chat.content}</p>
                                :
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0 && latestReply !== null &&
                    <div className="narayanamDiv" key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                    </div>
                }

                {
                    prevChats.length > 0 && latestReply === null &&
                    <div className="narayanamDiv" key={"non-typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                    </div>
                }
            </div>
        </div>
    )
}

export default Chat;