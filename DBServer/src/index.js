const express = require("express")
const config = require("config")
const host = config.get("server.host")
const port = config.get("server.port")

const app = express()

app.get("/",(req,res)=>{
    res.status(200)
    .json({
        "success":true,
        "message":"Welcome to ScratchDB. A database build from scratch",
        "data": null
    })
})

app.get("/ping",(req,res)=>{
    res.status(200)
    .json({
        "success":true,
        "message":"Successfully pinged server",
        "data": null
    })
})

app.listen(port,host,(err)=>{
    if (err){
        console.log(err)
    }
    console.log(`Server is running on port ${port}`)
})