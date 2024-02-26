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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const path_1 = __importDefault(require("path"));
let accessToken;
let app;
let postId;
const user = {
    email: "test@test.com",
    password: "1234567890",
};
let userId = new mongoose_1.default.Types.ObjectId().toHexString();
console.log("userId-1", userId);
const post1 = {
    user: userId,
    body: "This is a test post",
    comments: [],
    likes: [],
};
const postForNotRegisteredUser = {
    user: new mongoose_1.default.Types.ObjectId().toHexString(),
    body: "This is a test post",
    comments: [],
    likes: [],
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("------Post Test Start------");
    yield post_model_1.default.deleteMany();
    yield comments_model_1.default.deleteMany();
    yield userActivity_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    accessToken = yield (0, auth_test_1.createUser)(user);
    userId = yield user_model_1.default.findOne({ email: user.email }).then((user) => {
        return user._id.toHexString();
    });
    post1.user = userId;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log("------Post Test End------");
}));
describe("Post Module", () => {
    test("TEST 1: GET /post/:id empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/65a3f0c6c1d4cafa959dcf32`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 2: PUT /:id/update empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/65a3f0c6c1d4cafa959dcf32/update`)
            .send({ body: "updated body" })
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 3: POST /add-post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts/addPost")
            .send(post1)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(201);
        postId = response.body._id;
    }));
    test("TEST 6: GET /:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/${postId}`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user).toEqual(post1.user);
        expect(response.body.body).toEqual(post1.body);
    }));
    test("TEST 9: GET /allPosts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/allPosts`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body[0].user).toEqual(post1.user);
        expect(response.body[0].body).toEqual(post1.body);
    }));
    test("TEST 10:GET /:id unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/65a3f0c6c1d5cafa959dcf32`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 11:PUT /:id/update", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/${postId}/update`)
            .send({ body: "updated body" })
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.body).toEqual("updated body");
    }));
    test("TEST 12:PUT /:id/update unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/65a3f0c6c1d5cafa959dcf32/update`)
            .send({ body: "updated body" })
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 13: DELETE /:id unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/65a3f0c6c1d5cafa959dcf32`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
    }));
    test("TEST 14: DELETE /:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${postId}`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Deleted successfully");
    }));
    test("TEST 15: DELETE /:id empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/65a3f0c6c1d5cafa959dcf32`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
    }));
    test("TEST 16: Post - User not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts/addPost")
            .send(postForNotRegisteredUser)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(401);
        expect(response.text).toEqual("User not found");
    }));
    test("TEST 17: Post - with picture", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts/addPost")
            .set("Authorization", `JWT ${accessToken}`)
            .field("user", post1.user)
            .field("body", "This is a test post")
            .attach("file", path_1.default.join(__dirname, "batman.png"));
        expect(response.statusCode).toEqual(201);
        postId = response.body._id;
    }));
    test("TEST 18: DELETE /:id with picture", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${postId}`)
            .set("Authorization", `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Deleted successfully");
    }));
});
exports.default = post1;
//# sourceMappingURL=post.test.js.map