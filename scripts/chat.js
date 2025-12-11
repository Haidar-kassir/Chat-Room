class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.unsub = null;
  }

  // add a new chat document
  async addChat(message) {
    // format a chat object
    const now = new Date();
    const chat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: window.Timestamp.fromDate(now),
    };
    // save the chat document
    const response = await addDoc(collection(window.db, "chats"), chat);
    return response;
  }

  getChats(callback) {
    // real-time listener to the collection
    const chatsRef = collection(window.db, "chats");
    // log which room we're querying and use the correct equality operator
    console.debug("Chatroom.getChats - querying room:", this.room);
    const q = window.query(
      chatsRef,
      window.where("room", "==", this.room),
      window.orderBy("created_at")
    );

    this.unsub = window.onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          callback(change.doc.data());
        }
      });
    });
  }

  UpdateRoom(room) {
    this.room = room;
    console.log("room changed to " + room);
    if (this.unsub) {
      this.unsub();
    }
    
  }

  UpdateName(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }
}

// use the instance to add a chat (was calling the class directly)
//note: event "DOMContentLoaded" to ensure modules are loaded (firestore, etc.)
// document.addEventListener("DOMContentLoaded", () => {
//   const chatroom = new Chatroom("gaming", "mario");

//   chatroom
//     .addChat("hello world")
//     .then(() => console.log("chat added"))
//     .catch((err) => console.log(err));

//   chatroom.getChats((data) => {
//     console.log(data);
//   });

//   setTimeout(() => {
//     chatroom.UpdateRoom("general");
//     chatroom.UpdateName("luigi");
//     chatroom.getChats((data) => {
//       console.log(data);
//     });
//     chatroom.addChat(`hi iam ${chatroom.username}`)
//             .then(() => console.log("chat added"))
//             .catch((err) => console.log(err));
//   }, 3000);
// });
