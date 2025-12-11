class ChatUI {
  constructor(list) {
    this.list = list;
  }

  render(data) {
    const date = dateFns.distanceInWordsToNow(data.created_at.toDate(), {
      addSuffix: true,
    });
    const html = `
            <li class="list-group-item">
                <span class = "username">${data.username} </span>
                <span class = "message">${data.message} </span>
                <div class = "time">${date} </div>
            </li>
        `;
    // Defensive: ensure the list element exists before modifying it
    if (!this.list) {
      ``;
      console.warn("ChatUI: list element not found; skipping render.");
      return;
    }

    this.list.innerHTML += html;
    console.log(data);
  }

  reset() {
    this.list.innerHTML = "";
  }
}
