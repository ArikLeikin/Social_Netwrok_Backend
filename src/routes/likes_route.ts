import express from "express";
const router = express.Router();
import LikesController from "../controllers/likes_controller";
import { BaseController } from "../controllers/base_controller";
import PostModel from "../models/post_model";
import authMiddleware from "../middleware/auth_middleware";

const postController = new BaseController(PostModel);

// get all likes
router.get("/likes", authMiddleware, postController.get.bind(postController));

// get specific like by id
router.get(
  "/likes/:likeId",
  authMiddleware,
  postController.get.bind(postController)
);

// create a new like
router.post(
  "/create",
  authMiddleware,
  postController.post.bind(postController)
);

// edit a like by id
router.put("/edit", authMiddleware, postController.get.bind(postController));

// delete a post by id
router.delete(
  "/delete",
  authMiddleware,
  postController.get.bind(postController)
);

export default router;
