const express = require('express');
const router = express.Router();



const {validateToken} =require("../middleWare/auth")


const {createAuthor,loginUser,createBlogs} =require("../controller/authorController")

const {getList,updateblogs,deletByProperty,deletById}=require("../controller/BlogsController")



router.post("/authors", createAuthor)

router.post("/login",loginUser)

router.post("/blogs",validateToken,createBlogs)

router.get("/blogs",validateToken,getList)

router.put("/blogs/:blogId", validateToken,updateblogs)

router.delete("/blogs/:blogId",validateToken,deletById)

router.delete("/blogs",validateToken,deletByProperty)



module.exports = router;