import "./Sidebar.css";
import { useContext , useEffect } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from 'uuid';



function Sidebar(){
    const {allThreads , setAllThreads , currThreadId , setCurrThreadId , setNewChat , setPrompt , setReply , setPrevChats} = useContext(MyContext);

    async function getAllThreads(){
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/thread`);
            const res = await response.json();

            if (!Array.isArray(res)) {
                console.error("Expected array, got:", res);
                setAllThreads([]);
                return;
            }
            
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/thread/${newThreadId}`);
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/thread/${threadId}` , {method: "DELETE"});
            const res = await response.json();
            // console.log(res);

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
                <img src="/narayanam.ico" alt="logo" className="logo"/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* history */}
            <ul className="history">
                {
                    allThreads?.map((thread , idx) => {
                        return <li key={idx} onClick={() => changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "selectedThread" : ""}>
                            {thread.title}
                            <i className="fa-solid fa-trash" 
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
                <p>&copy; Narayanam</p>
            </div>
        </section>
    )
}

export default Sidebar;