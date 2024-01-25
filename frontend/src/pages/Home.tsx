import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "./login.css";
import BackgroundImage from "../assets/background.png";
import Post from "../components/post/Post";

const Home = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: "Post 1", body: "This is the content of Post 1." },
    { id: 2, title: "Post 2", body: "This is the content of Post 2." },
    { id: 3, title: "Post 3", body: "This is the content of Post 3." },
    // Add more posts as needed
  ]);

  const [show, setShow] = useState(false);

  return (
    <div className="d-flex flex-column align-items-center">
      <Post />
      {posts.map((post) => (
        <div className="myWrapper mt-5">
          <div className="center"></div>
          {show && (
            <Alert variant="danger">
              Error fetching posts. Please try again later.
            </Alert>
          )}
          <div key={post.id} className="post-wrapper">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
