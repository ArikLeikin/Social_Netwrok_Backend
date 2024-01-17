"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const base_controller_1 = require("../controllers/base_controller");
const post_model_1 = __importDefault(require("../models/post_model"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
const userController = new base_controller_1.BaseController(post_model_1.default);
// get all likes
router.get("/", auth_middleware_1.default, userController.get.bind(userController));
// get specific like by id
router.get("/:likeId", auth_middleware_1.default, userController.get.bind(userController));
// create a new like
router.post("/create", auth_middleware_1.default, userController.post.bind(userController));
// edit a like by id
router.put("/edit", auth_middleware_1.default, userController.get.bind(userController));
// delete a post by id
router.delete("/delete", auth_middleware_1.default, userController.get.bind(userController));
exports.default = router;
//# sourceMappingURL=user_route.js.map