import ConnectedToMongo from "./db/db.js"
import dotenv from "dotenv"
import { app } from "./app.js"

 dotenv.config({
    path: './env'
 })

ConnectedToMongo().then(app.listen(process.env.PORT|| 8000, ()=>{
    console.log(`server is running on port : ${process.env.PORT}`)
})).catch((err)=>{
    console.log("MONGODB CONNECTION FAILED !! ERROR", err)
})
