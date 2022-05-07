const express = require('express');
const router = express.Router();


const loginController = require("../controller/loginController")
const middleWare =require("../middleWare/auth")


const author =require("../controller/authorController")

const blog=require("../controller/BlogsController")



router.post("/authors", author.createAuthor)

router.post("/login",loginController.loginUser)

router.post("/blogs",middleWare.validateToken,author.createBlogs)

router.get("/blogs",middleWare.validateToken,blog.getList)

router.put("/blogs/:blogId", middleWare.validateToken,blog.updateblogs)

router.delete("/blogs/:blogId",middleWare.validateToken,blog.deletById)

router.delete("/blogs",middleWare.validateToken,blog.deletByProperty)








module.exports = router;