class WebSocketStore {
	messagesHistory = {};
	connections = {};

	get connectedUsers() {
		return Object.values(this.connections).map((connection) => connection.user);
	}

	addMessageToHistory = (senderId, recipientId, data) => {
		if (this.messagesHistory[senderId]) {
			if (!this.messagesHistory[senderId][recipientId]) {
				this.messagesHistory[senderId][recipientId] = [];
			}
		} else {
			this.messagesHistory[senderId] = {};
			this.messagesHistory[senderId][recipientId] = [];
		}
		this.messagesHistory[senderId][recipientId].push(data);
	};

	getMessageHistory = (senderId, recipientId) => {
		return this.messagesHistory[senderId] && this.messagesHistory[senderId][recipientId]
			? this.messagesHistory[senderId][recipientId]
			: null;
	};
}

class WebSocketConnection {
	user = undefined;
	userId = undefined;

	constructor(socket, webSocketStore) {
		this.socket = socket;
		this.socketId = socket.id;
		this.webSocketStore = webSocketStore;
	}

	emit = (event, data) => {
		this.socket.emit(event, data);
	};

	broadcast = (event, data) => {
		this.socket.broadcast.emit(event, data);
	};

	broadcastTo = (roomId, event, data) => {
		this.socket.broadcast.to(roomId).emit(event, data);
	};

	userConnect = (data) => {
		const user = {
			...data,
			socketId: this.socketId,
			activeRoom: null,
		};
		this.user = user;
		this.userId = user.userId;
		this.webSocketStore.connections[this.socketId] = this;

		this.emit("users:list", this.webSocketStore.connectedUsers);
		this.broadcast("users:add", this.user);
		console.log(this.user);
	};

	userDisconnect = () => {
		delete this.webSocketStore.connections[this.socketId];
		this.broadcast("users:leave", this.socketId);
	};

	addMessage = (data) => {
		const { recipientId, roomId } = data;
		console.log("test");
		this.emit("message:add", data);
		this.broadcastTo(roomId, "message:add", data);
		this.addMessageToHistory(recipientId, data);
	};

	addMessageToHistory = (recipientId, data) => {
		this.webSocketStore.addMessageToHistory(this.userId, recipientId, data);
		this.webSocketStore.addMessageToHistory(recipientId, this.userId, data);
	};

	history = ({ recipientId }) => {
		const messageHistory = this.webSocketStore.getMessageHistory(this.userId, recipientId);
		if (messageHistory) {
			this.emit("message:history", messageHistory);
		}
	};
}

module.exports = { WebSocketStore, WebSocketConnection };
