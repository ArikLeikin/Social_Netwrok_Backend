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
exports.postId = void 0;
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const auth_test_1 = require("./auth.test");
const user_model_1 = __importDefault(require("../models/user_model"));
let accessToken;
let accessToken2;
let app;
const user = {
    email: "test@test.com",
    password: "1234567890"
};
const user2 = {
    email: "testlike@testlike.com",
    password: "1234567890"
};
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post("/auth/register").send(user); //register user
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        return response.body.accessToken;
    });
}
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log('------Post Test Start------');
    yield post_model_1.default.deleteMany();
    // Use the function to run tests and get the token
    yield user_model_1.default.deleteMany();
    createUser(user);
    accessToken = yield createUser(user);
    createUser(user2);
    accessToken2 = yield createUser(user2);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log('------Post Test End------');
}));
describe('Post Module', () => {
    const userId = new mongoose_1.default.Types.ObjectId().toHexString();
    const post1 = {
        user: userId,
        title: 'Test Post',
        body: 'This is a test post',
        comments: undefined,
        likes: undefined
    };
    (0, auth_test_1.authUser)();
    test("TEST 1: GET /post/:id empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/65a3f0c6c1d4cafa959dcf32`)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 2: PUT /:id/update empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/65a3f0c6c1d4cafa959dcf32/update`)
            .send({ title: "updated title", body: "updated body" })
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        console.log(response.text);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 3: POST /add-post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/posts/addPost').send(post1)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(201);
        exports.postId = response.body._id;
    }));
    test("TEST 4: POST post not found for add likes", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/65a3f0c6c1d4cafa959dcf32/like`).send(user2)
            .set('Authorization', `JWT ${accessToken2}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Post not found");
    }));
    test('TEST 5: DELETE like post not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/65a3f0c6c1d4cafa959dcf32/like`).send(user2)
            .set('Authorization', `JWT ${accessToken2}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Post not found");
    }));
    test("TEST 5: GET /:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/${exports.postId}`)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user).toEqual(post1.user);
        expect(response.body.title).toEqual(post1.title);
        expect(response.body.body).toEqual(post1.body);
    }));
    test("TEST 6: Post Like", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/${exports.postId}/like`).send(user2)
            .set('Authorization', `JWT ${accessToken2}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Post liked");
    }));
    test("TEST 7: DELETE Post Like", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${exports.postId}/like`).send(user2)
            .set('Authorization', `JWT ${accessToken2}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Post unliked");
    }));
    test("TEST 7: GET /allPosts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/posts/allPosts`).set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body[0].user).toEqual(post1.user);
        expect(response.body[0].title).toEqual(post1.title);
        expect(response.body[0].body).toEqual(post1.body);
    }));
    test("TEST 8:GET /:id unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/65a3f0c6c1d5cafa959dcf32`)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 9:PUT /:id/update", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/${exports.postId}/update`)
            .send({ title: "updated title", body: "updated body" })
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.title).toEqual("updated title");
        expect(response.body.body).toEqual("updated body");
    }));
    test("TEST 10:PUT /:id/update unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/65a3f0c6c1d5cafa959dcf32/update`)
            .send({ title: "updated title", body: "updated body" })
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 11: DELETE /:id unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/posts/65a3f0c6c1d5cafa959dcf32`)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
    }));
    test("TEST 11: DELETE /:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${exports.postId}`)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("Deleted successfully");
    }));
    test("TEST 12: DELETE /:id empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/posts/65a3f0c6c1d5cafa959dcf32`).set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
    }));
});
//# sourceMappingURL=post.test.js.map