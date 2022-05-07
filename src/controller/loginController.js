



const jwt = require("jsonwebtoken");

const authorModel = require("../model/authorModel");

const isValidRequestBody =(value)=>{
  return Object.keys(value).length>0
}

const isValid =(value)=>{
  if(typeof value ==="undefined"||value ===null) return false
  if(typeof value ==="string"&& value.trim().length ===0) return false
  return true
}



const loginUser = async function (req, res) {
    try{
       const data = req.body;
       if(!isValidRequestBody(data)) return res.status(400).send({status:false,msg:"Please enter  mail and password"})
     
        const{email,password}= data
        // validation for login

      if(!isValid(email)) {
        return res.status(400).send({status:false,msg:"please enter email"})
      }

      if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return res.status(400).send({status:false,msg:"please enter valid email address"})
      }

      if(!isValid(password)) {
        return res.status(400).send({status:false,msg:"please enter password"})
      }

   
      let user = await authorModel.findOne({ email, password});
      if (!user)
        return res.status(404).send({status: false, msg: "Please enter a valid email address and password"});
   
      let token = jwt.sign(
        {
          authorId: user._id,
          group :"12",
          project:1,
        },
        "project-1-group-12"
      );
      
      
      res.setHeader("x-api-key", token);
      return res.status(200).send({ status: true, data: token });
    }
    catch(err){
      console.log(err.message)
       return res.status(500).send({status:"error",msg:err.message})
    }
  }

module.exports.loginUser=loginUser
  