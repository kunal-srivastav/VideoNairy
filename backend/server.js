const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();
const db = require("./db/db-connection");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const videoRouter = require("./routes/videoRouter");
const commentRouter = require("./routes/commentRouter");
const playlistRouter = require("./routes/playlistRouter");
const likesRouter = require("./routes/likesRouter");
const postRouter = require("./routes/postRouter");
const subscriptionRouter = require("./routes/subscriptionRouter")

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true } ));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

//import routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/posts", postRouter);

app.listen(port, () => {
    console.log(`Server is started at port ${port}`);
})