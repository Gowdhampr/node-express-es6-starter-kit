import express from "express";

const rootRoute = express.Router();

/* GET api root */
rootRoute.get("/", (req, res, next) => {
    res.status(200).send("OK");
});

export default rootRoute;
