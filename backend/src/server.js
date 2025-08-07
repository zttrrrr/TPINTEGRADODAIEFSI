import 'dotenv/config.js'
import express from "express";
import cors from "cors"

//Routers
import EventController from "./controllers/event-controller.js";        
import UserController from "./controllers/user-controller.js";
import EventLocationController from "./controllers/eventLocation-controller.js";

const app = express()
const port =  process.env.PORT ?? 3000;

app.use(cors())
app.use(express.json())

app.use("/api/events", EventController)
app.use("/api/events-locations", EventLocationController)
app.use("/api/user", UserController)

//app.use('/api/provinces', provinceRouter)

app.listen(port, () => {
    console.log("SERVIDOR EN " + port)
})