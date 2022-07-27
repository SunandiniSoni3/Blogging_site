
const  mongoose  = require('mongoose');
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


  const getList =async (req,res)=>{
      try{
          const filter = {isDeleted:false,deletedAt:null,isPublished:true}
          const data = req.query;

          if(isValidRequestBody(data)){

            const{authorId,category,subcategory,tags}=data

            if(isValid(authorId)&&isValidObjectId(authorId)){
                filter["authorId"]=authorId
            }
            if(isValid(category)){
                filter["category"]=category
            }
            if(isValid(tags)){
                const tagsData = tags.trim().split(",").map(x=>x.trim())
                filter["tags"]={$all:tagsData}
            }
            if(isValid(subcategory)){
                const subcategoryData = subcategory.trim().split(",").map(x=>x.trim())
                filter["subcategory"]={$all:subcategoryData}
            }

          }

          let blogs = await blogModel.find(filter)      
          if(Array.isArray(blogs)&&blogs.length === 0){
              return res.status(404).send({status:false , message:"Blogs not found"})
          }
  
          return res.status(200).send({status: true ,data :blogs})
          


      }
      catch(err){
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })

      }


  }

//   ****************************************************************************************************************
const updateblogs = async function(req,res){

    try{
       let blogId = req.params.blogId;

       let data = req.body
       
       let tokenAuthorId =req["authorId"] 
       
       let {title,body,tags,subcategory,isPublished}=data  // destructuring
       let data1=Object.keys(data)

        

       // blogid Validation
       
       
       if(!isValidObjectId(blogId)) {
           return res.status(400).send({ status:false, messageg: `${blogId} is not a valid blogId` })
       }
       

       let status= await blogModel.findOne({_id:blogId,isDeleted:false,deletedAt:null})
       if(!status) return res.status(404).send({status :false,message :"this blog is not present"})
       
      
       if(status.authorId!= tokenAuthorId){
           return res.status(403).send({status:false,message:"You are not authorized to access this data"})
       }
       if(!isValidRequestBody(data)){
        return res.status(400).send({status:false,message:"No Data for updation !Aborting update operation"})
       }
       
       const updateblogs = await blogModel.findByIdAndUpdate( blogId,
       { $addToSet: {tags:tags,subcategory:subcategory},
         $set : { title: title, body: body,
            isPublished: isPublished ? isPublished : false,
          publishedAt: isPublished ? Date.now() : null}
       },
       { new: true});
       

       
       return res.status(200).send({ status: true, data:updateblogs });
   }
     
   catch (err) {
       console.log(err.message)
       return res.status(500).send({ status: "error", error: err.message })
   } 


}
// *******************************************************************************************************************************************


const deletById=async (req,res)=>{
    try{
       
        let blogId= req.params.blogId
       
        // blogId  validation
       
    
        if(!isValidObjectId(blogId)) 
        return res.status(400).send({ status:false, message: `${blogId} is not a valid blogId` })

        let status= await blogModel.findOne({_id:blogId,isDeleted:false,deletedAt:null})
        if(!status) return res.status(404).send({status:false,message :"this blog is not present"})


        // authorization

        let tokenAuthorId =req["authorId"]
        if(status.authorId != tokenAuthorId){
            return res.status(403).send({status:false,message:"You are not authorized to access this data"})
        }

        
        
      await blogModel.findByIdAndUpdate(blogId,
            {$set:{isDeleted:true,deletedAt: Date.now()}},
            {new:true})
        return res.status(200).send({status:true,message:"this blog is deleted successfully"})    
       
    }    
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}

//   ****************************************************************************************************************

const deletByProperty =  async (req,res)=>
{
    try{
        const filter = {isDeleted:false,deletedAt:null,isPublished:true}
        let data = req.query

        
        const {category,tags,authorId,subcategory,isPublished } = data

         let token = req["authorId"]

        if(!isValidRequestBody(data)){
             return res.status(400).send({status: false , message :"No query params received!Aborting delete operation"})
        }
        
        if(isValid(authorId)&&isValidObjectId(authorId)){
            filter["authorId"]=authorId
        }
        if(isValid(category)){
            filter["category"]=category
        }
        if(isValid(tags)){
            const tagsData = tags.trim().split(",").map(x=>x.trim())
            filter["tags"]={$all:tagsData}
        }
        if(isValid(subcategory)){
            const subcategoryData = subcategory.trim().split(",").map(x=>x.trim())
            filter["subcategory"]={$all:subcategoryData}
        }
        if(isValid(isPublished)){
            
            filter["isPublished"]=isPublished
        }

        let blogs = await blogModel.find(filter) 
           
        if(Array.isArray(blogs)&&blogs.length === 0){
            return res.status(404).send({status:false , message:"Blogs not found"})
        }
        
    //    checking authorized data
    

        const idsOfBlogsToDelete = blogs.map(blog=>{
            if(blog.authorId == token)
            
             return blog._id
        })
        
        if(idsOfBlogsToDelete.length===0) 
        return res.status(404).send({status:false , message:"No Blogs under your authorization"})


         await blogModel.updateMany({_id :{$in:idsOfBlogsToDelete}},
            {$set:{isDeleted:true,deletedAt: Date.now()}},
            {new:true});

            return res.status(200).send({status:true,message:`${idsOfBlogsToDelete.length } Blog(s) deleted successfully`})
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }
}
 

module.exports={getList,updateblogs,deletById,deletByProperty}
