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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model")); // Import your user model
let app;
let authToken; // Variable to store the authentication token
let testUserId;
const user = {
    email: "testUser@test.com",
    password: "1234567890",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany({ email: user.email });
    // Create a user for testing
    const userResponse = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    testUserId = userResponse.body._id;
    // Authenticate the user and get the token
    const authResponse = yield (0, supertest_1.default)(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "testpassword" });
    authToken = authResponse.body.token;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Cleanup: Delete the test user after all tests are done
    yield user_model_1.default.findByIdAndDelete(testUserId);
    yield mongoose_1.default.connection.close();
}));
const testPost = {
    user: "659e61bc90bcb1c185eb6932",
    body: "Test post body",
};
describe("Post model tests", () => {
    let createdPostId;
    test("Create a new post", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app)
                .post("/create")
                .set("Authorization", `Bearer ${authToken}`)
                .send(testPost);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty("user", testUserId); // Ensure the post is associated with the test user
            createdPostId = response.body._id;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }));
    test("Get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app).get("/posts");
            expect(response.statusCode).toBe(200);
            // Add more assertions based on your application's logic
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }));
    test("Get specific post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app).get(`/post/${createdPostId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("user", testPost.user);
            expect(response.body).toHaveProperty("body", testPost.body);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }));
    test("Edit a post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedPost = {
                body: "Updated post body",
            };
            const response = yield (0, supertest_1.default)(app)
                .put(`/edit/${createdPostId}`) // Assuming your edit route requires an ID
                .send(updatedPost);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("body", updatedPost.body);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }));
    test("Delete a post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app).delete(`/delete/${createdPostId}`);
            expect(response.statusCode).toBe(200);
            // Verify that the post is deleted by trying to fetch it again
            const getResponse = yield (0, supertest_1.default)(app).get(`/post/${createdPostId}`);
            expect(getResponse.statusCode).toBe(404);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }));
});
//# sourceMappingURL=post.test.js.map