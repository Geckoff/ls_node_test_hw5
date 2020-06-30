const { WebSocketStore, WebSocketConnection } = require("./WebSocket");
const webSocketStore = new WebSocketStore();

const initIo = (io) => {
	io.on("connection", (socket) => {
		const webSocketConnection = new WebSocketConnection(socket, webSocketStore);
		socket.on("users:connect", webSocketConnection.userConnect);
		socket.on("disconnect", webSocketConnection.userDisconnect);
		socket.on("message:add", webSocketConnection.addMessage);
		socket.on("message:history", webSocketConnection.history);
	});
};

module.exports = initIo;
