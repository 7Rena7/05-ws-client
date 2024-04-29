import { Manager, Socket } from "socket.io-client";

interface MessageFromServer {
  fullName: string;
  clientId: string;
  message: string;
}

interface Client {
  id: string;
  fullName: string;
}

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager("http://localhost:3000", {
    extraHeaders: {
      authorization: `${token}`,
    },
  });

  socket?.removeAllListeners();
  socket = manager.socket("/messages");

  addListeners();
};

const addListeners = () => {
  const socketStatusLabel =
    document.querySelector<HTMLSpanElement>("#server-status")!;
  const clientsConnectedList = document.querySelector<HTMLUListElement>(
    "#clients-connected-list"
  )!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesList =
    document.querySelector<HTMLUListElement>("#messages-list")!;

  socket.on("connect", () => {
    socketStatusLabel.innerText = "🟢 Connected 🟢";
  });

  socket.on("disconnect", () => {
    socketStatusLabel.innerText = "🔴 Disconnected 🔴";
  });

  socket.on("clients-updated", (clients: Client[]) => {
    clientsConnectedList.innerHTML = "";
    clients.forEach((client) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${client.fullName}</strong> - ${client.id}`;
      clientsConnectedList.appendChild(li);
    });
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (message.length <= 0) return;
    socket.emit("message-from-client", { content: messageInput.value });
    messageInput.value = "";
    // const li = document.createElement("li");
    // li.innerText = `${socket.id} - John Doe: ${message}`;
    // messagesList.appendChild(li);
  });

  socket.on(
    "message-from-server",
    ({ fullName, message }: MessageFromServer) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${fullName}</strong>: ${message}`;
      messagesList.appendChild(li);
    }
  );
};
