
import Post,{IPost} from "../models/post_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import UserActivity from "../models/userActivity_model";
class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }
  async deleteLike(req: Request, res: Response) {
    try {
      const post = await Post.findById(req.params.id);
      if (post) {
        const length = post.likes.length;
         post.likes = post.likes.filter((like) => like !== req.body.email);
        if (length === post.likes.length) {
          res.status(402).json({ message: "Like not found" });
          return;
        }
        await post.save();
        res.status(200).json({ message: "Post unliked" });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addLike(req: Request, res: Response) {
    try {
      const userActivity = await UserActivity.findOne({email: req.body.email});
      if(!userActivity){
        res.status(402).json({ message: "User not found" });
        return;
      }
      const post = await Post.findById(req.params.id);
      if (post) {
        post.likes.push(req.body.email);
        await post.save();
        res.status(200).json({ message: "Post liked" });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async post(req: Request, res: Response) {
    const user = await UserActivity.findOne({user: req.body.user});
    if(!user){
      res.status(402).send("User not found");
      return;
    }
    try{
      const post = await Post.create(req.body);
        if(post){
          const userActivity = await UserActivity.findOneAndUpdate({user: post.user},{post: post._id},{upsert: true})
          if(userActivity){
            res.status(201).send(post);
        }
      }
        else{
          res.status(402).send("Error in creating object");
        }
         

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}
}
export default new PostController();

