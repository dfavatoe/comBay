import express from "express";

const testRouter = express.Router();

testRouter.get("/test", (req, res) => {
  console.log("I am triggering a test route".bgBlue);
  res.json("this is a test route");
});

export default testRouter;
