// select the chat list by its class (see index.html: <ul class="chat-list list-group"></ul>)
const list = document.querySelector(".chat-list");
const chatForm = document.querySelector(".new-chat");
const nameForm = document.querySelector(".new-name");
const updateMsg = document.querySelector(".update-msg");
const rooms = document.querySelector(".chat-rooms");
const listTitle = document.querySelector(".list-room");

// Wait for DOM to load before querying DOM elements
document.addEventListener("DOMContentLoaded", () => {
  //ctor UI
  const chatUI = new ChatUI(list);

  //ctor chat
  const username = localStorage.username ? localStorage.username : "anonymos";
  const chatroom = new Chatroom("general", username);

  // get chats and render them
  chatroom.getChats((data) => chatUI.render(data));
  listTitle.innerHTML = "general";

  //add chats to database
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();
    console.log(message);

    chatroom
      .addChat(message)
      .then(() => chatForm.reset())
      .catch(() => console.log("error wile adding message from form"));
  });

  nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    chatroom.UpdateName(name);

    nameForm.reset();
    notifyUser(`Name is set to ${name}`);
  });

  rooms.addEventListener("click", (e) => {
    e.preventDefault();
    const id = e.target.id;
    if (chatroom.id != id) {
      notifyUser(`Room is set to ${id}`);

      chatroom.UpdateRoom(id);
      listTitle.innerHTML = id;

      // reset chats list and render them
      chatUI.reset();
      chatroom.getChats((data) => chatUI.render(data));
    } else {
      notifyUser(`Room already set to ${id}`);
    }
  });
});

const notifyUser = (msg) => {
  updateMsg.textContent = `${msg}`;

  setTimeout(() => {
    updateMsg.textContent = ``;
  }, 3000 /* 3 secs */);
};
