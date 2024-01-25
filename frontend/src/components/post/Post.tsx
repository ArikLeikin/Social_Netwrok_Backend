import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./post.css";
import profileImg from "../../assets/profile.png";
import bg from "../../assets/background.png";
import likeIcon from "../../assets/like-icon.png";

const Post = () => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div
      className="p-3 myWrapper postContainer"
      style={{ alignItems: "flex-start" }}
    >
      <div className="d-flex flex-row userDetails">
        <img
          src={profileImg}
          alt="Profile"
          style={{ maxHeight: "50px", maxWidth: "50px" }}
        />
        <h6 className="p-3">John Doe</h6>
      </div>
      <hr className="myHr" />
      <div className="mt-1 postBody">
        <p>
          This is a text body test for the post component lets see how it looks
          like all together when styling it
        </p>
        <img src={bg} alt="" style={{ maxWidth: "100%" }} />
      </div>
      <hr />
      <div className="d-flex flex-row mt-2 mb-2 justify-content-between counts">
        <div className="d-flex flex-row likes">
          <span className="mx-1 likesCounter">
            <div className="d-flex align-items-center">
              <img
                className="likeButton"
                src={likeIcon}
                alt=""
                style={{ maxHeight: "25px", maxWidth: "25px" }}
              />
              <span className="ml-1">10</span>
            </div>
          </span>
        </div>
        <div className="comments">
          <span className="mx-1 commentCounter">20</span>
          <a className="navbar-brand" href="#" onClick={toggleComments}>
            {showComments ? "Comments" : "Comments"}
          </a>
        </div>
      </div>
      <hr />

      {showComments && (
        <div className="d-flex flex-column mt-3 comments">
          <div className="d-flex flex-row userDetails">
            <img
              src={profileImg}
              alt="Profile"
              style={{ maxHeight: "30px", maxWidth: "30px" }}
            />
            <span className="p-1">John Doe</span>
          </div>
          <div className="commentContent mt-1">
            Comment 1 CommentCommentvvComment Comment Comment vComment vComment
            Comment Comment Comment Comment
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
