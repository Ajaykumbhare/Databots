const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const app = express();
const http = require("http");
const socket = require("socket.io");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const server = http.Server(app);
const io = socket(server);

// Import API's
const users = require("./routes/api/users");
const workRequest = require("./routes/api/workRequest");
const checkOut = require("./routes/api/checkout");

// allow-cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Body Parser middleware
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "200kb" }));
app.set("socketio", io);

//Db Config
const db = require("./config/key.js").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Password Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

//File Upload
app.use(fileUpload());

//Use Routes
app.use("/api/users", users);
app.use("/api/workRequest", workRequest);
app.use("/api/checkOut", checkOut);

// Server static assets if in production

if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// socket.io connection
io.on("connection", socket => {
  socket.on("reply", reply => {
    socket.broadcast.emit("display", { reply });
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server running on port ${port}`));
