// import React from "react";
// import "./chat.css";
// const ChatComponent = () => {
//   return (
//     <>
//       <section>
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <div className="maintext">
//                 <h3>CitySpot Community Chat</h3>
//                 <h3>Share your experiences with Others</h3>
//                 <p>This is the beginning of this chat.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="chat-sec">
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <div className="chat-box">
//                 <img
//                   src="img/bandmember.jpg"
//                   alt="Avatar"
//                   style={{ width: "100%" }}
//                 />
//                 <p className="customer_name">
//                   Noman Ali
//                   <span className="time-right">Last Monday at 1:23 PM</span>
//                 </p>
//                 <p className="chat">Hello</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section>
//         <div className="row">
//           <div className="col-12">
//             <div className="input_field">
//               <form>
//                 <input
//                   type="text"
//                   placeholder="Type Your Text here...."
//                   name="lname"
//                 />
//                 <input type="button" value="SEND" />
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default ChatComponent;

import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
// Components
import Message from "./Message";
import { useAuth } from "../../AuthContext";
import { useFirestoreQuery } from "./hooks";
import "./chat.css";
import fire from "../../../config";
import Spinner from "../Spinner/Spinner";

const ChatComponent = ({ user = null }) => {
  const db = firebase.firestore();
  const messagesRef = db.collection("messages");
  const refItem = fire.firestore().collection("User");

  const messages = useFirestoreQuery(
    messagesRef.orderBy("createdAt", "desc").limit(100)
  );
  const [newMessage, setNewMessage] = useState("");
  const [photo, setPhoto] = useState("");

  const inputRef = useRef();
  const bottomListRef = useRef();
  const sendBtnRef = useRef();

  // const { uid, displayName, photoURL } = user;
  const { currentUser } = useAuth();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      fetchUserDetails();
    }
  }, [inputRef, photo]);

  const fetchUserDetails = () => {
    refItem.doc(currentUser.email).onSnapshot((doc) => {
      if (doc.exists) {
        // setDetails(doc.data());
        setPhoto(doc.data().photourl);
      } else {
        console.log("No such document!");
      }
    });
  };

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      messagesRef.add({
        text: trimmedMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: photo,
      });
      // Clear input field
      setNewMessage("");
      // Scroll down to the bottom of the list
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="maintext">
                <h3>CitySpot Community Chat</h3>
                <h3>Share your experiences with Others</h3>
                <p>This is the beginning of this chat.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="chat-sec">
        <div
          style={{
            marginTop: "0px",
          }}
          className="container"
        >
          {messages
            ?.sort((first, second) =>
              first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
            )
            ?.map((message) => (
              <Message key={message.id} {...message} />
            ))}
        </div>
        <div ref={bottomListRef} />
      </section>

      <section>
        <div className="row">
          <div className="col-12">
            <div className="input_field">
              <form onSubmit={handleOnSubmit}>
                <input
                  className="input-type"
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={handleOnChange}
                  placeholder="Type your message here..."
                  name="lname"
                />
                <input
                  type="button"
                  ref={sendBtnRef}
                  disabled={!newMessage}
                  value="SEND"
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
ChatComponent.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default ChatComponent;
