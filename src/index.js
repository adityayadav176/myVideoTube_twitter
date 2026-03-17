import ConnectedToMongo from "./db/db.js"
import dotenv from "dotenv"
import { app } from "./app.js"

 dotenv.config({
    path: './env'
 })

ConnectedToMongo()
.then(() => {
    app.listen(process.env.PORT || 9000, () => {
        console.log(`Server is running on port: ${process.env.PORT || 9000}`)
    })
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED !! ERROR", err)
})

console.log("App file loaded");