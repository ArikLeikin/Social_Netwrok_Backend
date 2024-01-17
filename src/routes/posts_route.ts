import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import { BaseController } from "../controllers/base_controller";
import PostModel from "../models/post_model";
import authMiddleware from "../middleware/auth_middleware";

const postController = new BaseController(PostModel);

// get all posts
router.get("/posts", authMiddleware, postController.get.bind(postController));

// get specific post by id
router.get(
  "/post/:postId",
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
