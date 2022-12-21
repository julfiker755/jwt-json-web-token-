const express=require('express')
const app=express()
const port=process.env.PORT || 5050
const cors=require('cors')
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser')
// middleware
app.use(cors())
app.use(bodyParser.json())

// varify
function varifyjwt(req,res,next){
    const headerdata=req.headers.authorization
    if(!headerdata){
        return res.status(401).send({Message:'unset user token'})
    }
    const token=headerdata.split(' ')[1]
    jwt.verify(token, '23423444', function(err, decoded) {
       if(err){
        return res.status(403).send({message:'sry Not your decoded access'})
       }
       console.log("decoded",decoded)
       req.decoded=decoded
       next()
      });
   
}
// mongo bd
const uri = "mongodb+srv://emajhon:J8PzySQt9u8eb4zj@cluster0.bbfxr09.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
 try{
    const collection = client.db("genius-car").collection("user");
    const ordercollection = client.db("genius-car").collection("order");
    // Auth Information
    app.post("/login",async(req,res)=>{
        const user=req.body
        const accesstoken=jwt.sign(user,'23423444',{
            expiresIn:'1d',
        })
        res.send({accesstoken})

    })
    // servies Information
    app.get("/user",async(req,res)=>{
        const query={}
        const cursor=collection.find(query)
        const result=await cursor.toArray()
        res.send(result)
    })
    // how to use post data
    app.post("/user",async(req,res)=>{
        const bodydata=req.body
        const result=await collection.insertOne(bodydata)
        res.send(result)
    })
    // how to routing
    app.get("/user/:id",async(req,res)=>{
        const id=req.params.id
        const query={_id:ObjectId(id)}
        const result=await collection.findOne(query)
        res.send(result)
    })
    app.delete("/user/:id",async(req,res)=>{
        const id=req.params.id
        const query={_id:ObjectId(id)}
        const result=await collection.deleteOne(query)
        res.send(result)
    })
    app.put("/user/:id",async(req,res)=>{
        const bodydata=req.body
        const id=req.params.id
        const query={_id:ObjectId(id)}
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name:bodydata.name,
                price:bodydata.price,
                description:bodydata.description,
                img:bodydata.img,
            },
          };
          const result=await collection.updateOne(query,updateDoc,options)
          res.send(result)
    })
    // order item set value
  app.post("/order",async(req,res)=>{
    const orderdata=req.body
    const result=await ordercollection.insertOne(orderdata)
    res.send(result)
  })
  app.get("/order",varifyjwt,async(req,res)=>{
    const email1=req.query.email
    const decodedemail=req.decoded.email
    if(email1 == decodedemail){
        const query={email:email1}
        const cursor=ordercollection.find(query)
        const result=await cursor.toArray()
        res.send(result)
    }else{
        res.status(403).send({message:'sry Not your decoded access'})
    }
  })
 
 }finally{

 }
}
run().catch(console.dir)

app.listen(port,function(err){
    if(err){
        console.log("Your server not run")
    }else{
        console.log("Your server run sccessfull")
    }
})