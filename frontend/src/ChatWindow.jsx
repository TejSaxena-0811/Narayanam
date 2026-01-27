import "./ChatWindow.css";
import Chat from "./Chat.jsx";


function ChatWindow(){
    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>Narayanam AI</span>
                <div className="userIconDiv">
                    <span className="userIcon"><i class="fa-solid fa-user"></i></span>
                </div>
            </div>

            <Chat></Chat>

            <div className="chatInput">
                <div className="inputBox">
                    <input type="text" placeholder="Ask anything" />
                    <div id="submit">
                        <i class="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    This project is made with love and effort :)
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;