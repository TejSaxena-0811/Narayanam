import "./Sidebar.css";
import { useContext , useEffect } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from 'uuid';



function Sidebar(){
    const {allThreads , setAllThreads , currThreadId , setCurrThreadId , setNewChat , setPrompt , setReply , setPrevChats} = useContext(MyContext);

    async function getAllThreads(){
        try{
            const response = await fetch("http://localhost:3000/api/thread");
            const res = await response.json();
            const filteredData = res.map((thread) => {
                return {
                    threadId: thread.threadId , title: thread.title
                }
            })
            setAllThreads(filteredData);
        }
        catch(err){
            console.log(err);
        }

    }

    useEffect(() => {
        getAllThreads();
    } , [currThreadId])


    function createNewChat(){
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv4());
        setPrevChats([]);
    }

    async function changeThread(newThreadId){
        setCurrThreadId(newThreadId);

        try{
            const response = await fetch(`http://localhost:3000/api/thread/${newThreadId}`);
            const res = await response.json();
            // console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }
        catch(err){
            console.log(err);
        }
    }

    async function deleteThread(threadId){
        try{
            const response = await fetch(`http://localhost:3000/api/thread/${threadId}` , {method: "DELETE"});
            const res = await response.json();

            // re-rendering updated threads:
            setAllThreads((prev) => {
                return prev.filter((thread) => {
                    return thread.threadId != threadId;
                })
            })

            if(threadId === currThreadId){
                createNewChat();
            }
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="logo" className="logo"/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* history */}
            <ul className="history">
                {
                    allThreads?.map((thread , idx) => {
                        return <li key={idx} onClick={() => changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "selectedThread" : ""}>
                            {thread.title}
                            <i class="fa-solid fa-trash" 
                                onClick={(event) => {
                                    event.stopPropagation(); // to avoid event bubbling. so that when the delete button (child) is clicked, it doesn't interfere with the parent, that is the list item.
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    })
                }
            </ul>

            {/* sign */}
            <div className="sign">
                <p>By Tej :)</p>
            </div>
        </section>
    )
}

export default Sidebar;