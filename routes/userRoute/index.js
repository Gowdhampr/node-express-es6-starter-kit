import express from "express";
const verifyAuthorization = require("../../middleware/verifyAuthorization");
const verifyToken = require("../../middleware/verifyToken");

const userRoute = express.Router();
import search from "./search";

userRoute.get("/search", verifyToken, search);

export default userRoute;
