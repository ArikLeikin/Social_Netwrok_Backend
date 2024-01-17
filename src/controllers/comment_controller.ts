import commentModel, { IComment } from "../models/comments_model";
import createController from "./base_controller";

const commentController = createController<IComment>(commentModel);

export default commentController;
