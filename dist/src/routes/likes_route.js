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
// get all likes
router.get("/likes", auth_middleware_1.default, postController.get.bind(postController));
// get specific like by id
router.get("/likes/:likeId", auth_middleware_1.default, postController.getById.bind(postController));
// create a new like
router.post("/create", auth_middleware_1.default, postController.post.bind(postController));
// edit a like by id
router.put("/edit/:id", auth_middleware_1.default, postController.putById.bind(postController));
// delete a post by id
router.delete("/delete/:id", auth_middleware_1.default, postController.deleteById.bind(postController));
exports.default = router;
//# sourceMappingURL=likes_route.js.map