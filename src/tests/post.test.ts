import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import Post from "../models/post_model";
import User from "../models/user_model"; // Import your user model

let app: Express;
let authToken: string; // Variable to store the authentication token
let testUserId: string;

const user = {
  email: "testUser@test.com",
  password: "1234567890",
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({ email: user.email });

  // Create a user for testing
  const userResponse = await request(app).post("/auth/register").send(user);

  testUserId = userResponse.body._id;

  // Authenticate the user and get the token
  const authResponse = await request(app)
    .post("/auth/login")
    .send({ username: "testuser", password: "testpassword" });

  authToken = authResponse.body.token;
});

afterAll(async () => {
  // Cleanup: Delete the test user after all tests are done
  await User.findByIdAndDelete(testUserId);
  await mongoose.connection.close();
});

const testPost = {
  user: "659e61bc90bcb1c185eb6932",
  body: "Test post body",
};

describe("Post model tests", () => {
  let createdPostId: string;

  test("Create a new post", async () => {
    try {
      const response = await request(app)
        .post("/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testPost);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("user", testUserId); // Ensure the post is associated with the test user

      createdPostId = response.body._id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test("Get all posts", async () => {
    try {
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      // Add more assertions based on your application's logic
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test("Get specific post by id", async () => {
    try {
      const response = await request(app).get(`/post/${createdPostId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user", testPost.user);
      expect(response.body).toHaveProperty("body", testPost.body);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test("Edit a post by id", async () => {
    try {
      const updatedPost = {
        body: "Updated post body",
      };

      const response = await request(app)
        .put(`/edit/${createdPostId}`) // Assuming your edit route requires an ID
        .send(updatedPost);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("body", updatedPost.body);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test("Delete a post by id", async () => {
    try {
      const response = await request(app).delete(`/delete/${createdPostId}`);
      expect(response.statusCode).toBe(200);

      // Verify that the post is deleted by trying to fetch it again
      const getResponse = await request(app).get(`/post/${createdPostId}`);
      expect(getResponse.statusCode).toBe(404);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
});
