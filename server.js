const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const socketIO = require("socket.io");

const contactsRouter = require("./api/contactsRouterApi");
const authRouter = require("./api/authRouter");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// serve static files
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// connect template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(logger(formatsLogger));

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

// Mongo DB connection
mongoose
  .connect(uriDb)
  .then((connection) => {
    console.log("Mongo DB connected..");
  })
  .catch(() => {
    console.error("DB is not connected..");
  });
// mongoose.Promise = global.Promise;

// const connection = mongoose.connect(uriDb, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const server = app.listen(PORT, function () {
  console.log(`Server running. Use our API on port: ${PORT}`);
});

// Socket.io ===============================================
const io = socketIO(server);

const node = io.of("/node");

node.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);

    node.in(data.room).emit("message", `New user joined "${data.room}" room!`);
  });

  socket.on("message", (data) => {
    node.in(data.room).emit("message", data.msg);
  });

  socket.on("disconnecting", () => {
    console.log("User disconnected");
    const rooms = Array.from(socket.rooms);

    rooms.forEach((el) => {
      node.in(el).emit("message", `User disconnected with "${el}" room! :( `);
    });
  });
});
