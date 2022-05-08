
const authorModel = require("../model/authorModel")
const mongoose = require('mongoose');
const blogModel = require("../model/blogModel")
 
const isValidRequestBody =(value)=>{
    return Object.keys(value).length>0
  }
  
  const isValid =(value)=>{
    if(typeof value ==="undefined"||value ===null) return false
    if(typeof value ==="string"&& value.trim().length ===0) return false
    return true
  }

  const isValidObjectId =(value)=>{
      return mongoose.isValidObjectId(value)
  }
 


const createAuthor = async (req, res) => {
    try{
         let data = req.body

        //  data validation

        let {fname,lname,title, email,password} = data
        
        
        if(!isValidRequestBody(data)) return res.status(400).send({ status:false, message: "plz enter some data" })

        // Fname validation
       
        if(!isValid(fname))  return res.status(400).send({ status:false, message: "first name must be present" });
    

        // lname validation
        if(!isValid(lname))  return res.status(400).send({ status:false, message: "Last name must be present" });
        
        

        // title validation
        if(!isValid(title))  return res.status(400).send({ status:false, message: "title must be present" });
        
        if(!( ["Mr", "Mrs", "Miss"].includes(data.title))) return res.status(400).send({status: false,message:"plz write valid title"})
        
        // email validation
        if(!isValid(email)) { 
            return res.status(400).send({ status:false, message: "email must be present" });
        }
        
        let regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
       
        let x = regx.test(email)
        if(!x) {
            return res.status(400).send({status:false,message:"write the correct format for email"})
        }
         let mail = await authorModel.findOne({email})

         if(mail) return res.status(400).send({status: false,message:"this email is already registered"})
        

        // password validation
        if(!isValid(password))  return res.status(400).send({ status:false, message: "plz write the password" });
        
        
        const authorData ={fname,lname,title, email,password}
        let author = await authorModel.create(authorData)

        res.status(201).send({ status: true, data: author })
    }
    catch(err){
        res.status(500).send({status: "error" , message: err.message})
    }
}



// ******************************************************************************************************************************************************






const createBlogs = async function(req, res) {
    try {
        const data = req.body
        //  data validation
        
        if(!isValidRequestBody(data)) return res.status(400).send({ status:false, message: "plz enter some data" })
        
        //extract params 
        let {authorId,title,body ,category,tags,subcategory,isPublished}= data

         // authorId validation
         
         if (!isValid(authorId)) {
             return res.status(400).send({ status:false,message: "authorId must be present" })
         }
         
         if(!isValidObjectId(authorId)) return res.status(400).send({ status:false, message: `${authorId} is not valid authorId` })
 
         const id = await authorModel.findById(authorId)
         if (!id) {
             return res.status(404).send({ status: false, message: "this Author is not present." })
         }
        //  accessing the payload authorId from request

         let token = req["authorId"]  

        //  authorization
         if(token!=authorId)
         {
            return res.status(403).send({status:false,message:"You are not authorized to access this data"})
         }
       
 
        // title validation
        if (!isValid(title)) {
            return res.status(400).send({ status:false, message: "title is not given" })
        }

        // body validation
        if (!isValid(body)) {
            return res.status(400).send({status:false, message: "body is not Given" })
        }
        

        // category validation
        if (!isValid(category)) {
            return res.status(400).send({status:false, message: "category must be present" })
        }
        
        const blogData ={
            title,
            body,
            authorId,
            category,
            isPublished:isPublished?isPublished:false,
            publishedAt:isPublished?Date.now():null
        }
        

        // tags validation
       
        if(tags){
            if(Array.isArray(tags))
            blogData["tags"]=[...tags]
            
        }

        // subcategory validation

        if(subcategory){
            if(Array.isArray(subcategory))
            blogData["subcategory"]=[...subcategory]
            
        }
      
        // Blog Creation
        const Blog = await blogModel.create(blogData)
        return res.status(201).send({ status: true, data: Blog })
    }
     catch (err) {
        res.status(500).send({ status: "error", error: err.message})
    }
}



module.exports={createAuthor,createBlogs}





