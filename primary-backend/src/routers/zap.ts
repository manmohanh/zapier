import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router()


//create zap
router.post("/",async (req,res)=>{

})

//get zap
router.get("/",authMiddleware,async(req,res)=>{

})

//get zap
router.get("/:zapId",authMiddleware,async(req,res)=>{

})


export default router;