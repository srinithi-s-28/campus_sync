import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { createCreditsOrder } from "../controllers/credits.controllers.js"

const CreditRouter = express.Router()


CreditRouter.post("/create-order", isAuth, createCreditsOrder)


export default CreditRouter
