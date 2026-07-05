const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo,getVideo} = require("../controllers/videoSection")
const userMiddleware = require('../middleware/userMiddleware');
const premiumMiddleware = require('../middleware/premiumMiddleware');

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);
videoRouter.get(
    "/watch/:problemId",
    userMiddleware,
    premiumMiddleware,
    getVideo
);


module.exports = videoRouter;