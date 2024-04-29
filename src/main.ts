import { connectToServer } from "./socket-client";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>WebSocket - Client</h2>
    <input type='text' id='jwt-token' />
    <button id='connect-button'>Connect</button>
    <br /> <br />
    <span id='server-status'></span>
    <ul id='clients-connected-list'></ul>
    <form id='message-form'>
      <input type='text' id='message-input' />
    </form>
    <h3>Messages</h3>
    <ul id='messages-list'></ul>
  </div>
`;

// connectToServer();
document
  .querySelector<HTMLButtonElement>("#connect-button")!
  .addEventListener("click", () => {
    const jwtToken = document
      .querySelector<HTMLInputElement>("#jwt-token")!
      .value.trim();
    if (jwtToken.length <= 0) return alert("Please provide a JWT token");
    connectToServer(jwtToken);
  });
