const express = require("express");

const auth = require("./routes/auth");
const posts = require('./routes/posts');

const app = express();

app.use(express.json());
app.use("/auth", auth);
app.use("/post", posts);

app.get("/", (req, res) => {
  res.send("This is homepage");
});

app.listen(5000, () => {
  console.log("Now running on 5000");
});
