import express from "express";
const router = express.Router();
import CommentController from "../controllers/comment_controller";
import { BaseController } from "../controllers/base_controller";
import PostModel from "../models/post_model";
import authMiddleware from "../middleware/auth_middleware";

const postController = new BaseController(PostModel);

// get all comments
router.get(
  "/comments",
  authMiddleware,
  postController.get.bind(postController)
);

// get specific comment by id
router.get(
  "/comment/:commentId",
  authMiddleware,
  postController.get.bind(postController)
);

// create a new post
router.post(
  "/create",
  authMiddleware,
  postController.post.bind(postController)
);

// edit a post by id
router.put("/edit", authMiddleware, postController.get.bind(postController));

// delete a post by id
router.delete(
  "/delete",
  authMiddleware,
  postController.get.bind(postController)
);

export default router;
