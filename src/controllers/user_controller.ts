import userModel, { IUser } from "../models/user_model";
import createController, { BaseController } from "./base_controller";

const UserController = createController<IUser>(userModel);

export default UserController;
