const express = require("express");
const bodyParser = require("body-parser");

const { getStoredPosts, storePosts } = require("./data/posts");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/posts", async (req, res) => {
  const storedPosts = await getStoredPosts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ posts: storedPosts });
});

app.get("/posts/:id", async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);
  res.json({ post });
});

app.post("/posts", async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  const newPost = {
    ...postData,
    // id: Math.random().toString(),
    id: Math.floor(Math.random() + 1).toString(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: "Stored new post.", post: newPost });
});

app.delete("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const existingPosts = await getStoredPosts();
    const updatedPosts = existingPosts.filter((post) => post.id !== postId);
    await storePosts(updatedPosts);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.delete("/writer/:id", function (req, res) {
//   var reqBody = "";

//   req.on("data", function (data) {
//     reqBody += data;
//     if (reqBody.length > 1e7) {
//       //10MB
//       httpMsgs.show404(req, res);
//     }
//   });
//   req.on("end", function () {
//     wr.delete(req, res, reqBody);
//   });
// });
// async function remove(id) {
//   const storedData = await readData();
//   const updatedData = storedData.postData.filter((ev) => ev.id !== id);
//   await writeData({ postData: updatedData });
// }

app.listen(8080);
