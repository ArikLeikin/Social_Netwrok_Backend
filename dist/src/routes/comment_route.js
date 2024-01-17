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
const postController = new base_controller_1.BaseController(post_model_1.default);
// get all comments
router.get("/comments", auth_middleware_1.default, postController.get.bind(postController));
// get specific comment by id
router.get("/comment/:commentId", auth_middleware_1.default, postController.get.bind(postController));
// create a new post
router.post("/create", auth_middleware_1.default, postController.post.bind(postController));
// edit a post by id
router.put("/edit", auth_middleware_1.default, postController.get.bind(postController));
// delete a post by id
router.delete("/delete", auth_middleware_1.default, postController.get.bind(postController));
exports.default = router;
//# sourceMappingURL=comment_route.js.map