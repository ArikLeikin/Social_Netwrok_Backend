import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import { BaseController } from "../controllers/base_controller";
import PostModel from "../models/post_model";
import authMiddleware from "../middleware/auth_middleware";

const userController = new BaseController(PostModel);

// get all likes
router.get("/", authMiddleware, userController.get.bind(userController));

// get specific like by id
router.get("/:likeId", authMiddleware, userController.get.bind(userController));

// create a new like
router.post(
  "/create",
  authMiddleware,
  userController.post.bind(userController)
);

// edit a like by id
router.put("/edit", authMiddleware, userController.get.bind(userController));

// delete a post by id
router.delete(
  "/delete",
  authMiddleware,
  userController.get.bind(userController)
);

export default router;
