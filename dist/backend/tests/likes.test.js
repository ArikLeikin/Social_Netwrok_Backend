"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
const auth_test_1 = require("./auth.test");
let accessToken;
let postId;
let app;
const user = {
    email: "testlike@testlike.com",
    password: "1234567890",
};
let userId = new mongoose_1.default.Types.ObjectId().toHexString();
const post1 = {
    user: userId,
    body: "This is a test post",
    comments: [],
    likes: [],
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("------Post Test Start------");
    yield post_model_1.default.deleteMany();
    yield userActivity_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    accessToken = yield (0, auth_test_1.createUser)(user);
    userId = yield user_model_1.default.findOne({ email: user.email }).then((user) => {
        return user === null || user === void 0 ? void 0 : user._id.toHexString();
    });
    post1.user = userId;
    const response = yield (0, supertest_1.default)(app)
        .post("/posts/addPost")
        .send(post1)
        .set("Authorization", `JWT ${accessToken}`);
    postId = response.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log("------Post Test End------");
}));
describe("Tests for Like Posts", () => {
    test("TEST 1: POST - post not found for add likes", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/65a3f0c6c1d4cafa959dcf32/like`)
            .send(user)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Post not found");
    }));
    test("TEST 2: DELETE like post not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/65a3f0c6c1d4cafa959dcf32/like`)
            .send(user)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Post not found");
    }));
    test("TEST 3: Post like for unregister user", () => __awaiter(void 0, void 0, void 0, function* () {
        const noUser = {
            email: "",
            password: "",
        };
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/${postId}/like`)
            .send(noUser);
        expect(response.statusCode).toEqual(401);
    }));
    test("TEST 4: Post like for unAthorized user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/${postId}/like`)
            .send(user)
            .set("Authorization", `JWT invalidToken`);
        expect(response.statusCode).toEqual(403);
        expect(response.text).toEqual("invalid access token");
    }));
    test("TEST 5: Post Like", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/${postId}/like`)
            .send(user)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Post liked");
    }));
    test("TEST 6: Post Like - Post already liked", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/${postId}/like`)
            .send(user)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(409);
        expect(response.body.message).toEqual("Post already liked");
    }));
    test("TEST 7: DELETE Post Like", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${postId}/like`)
            .send(user)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Post unliked");
    }));
    test("TEST 8: DELETE Post Like - Like not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${postId}/like`)
            .send(user)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Like not found");
    }));
});
//# sourceMappingURL=likes.test.js.map