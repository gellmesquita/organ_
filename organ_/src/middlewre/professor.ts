import { Response, Request, NextFunction } from "express";
const profAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session){
        if(req.session.professor!==undefined){
            next();
        }else{
            resp.redirect('/')
        }
    }else{
        resp.redirect('/')
    }
}


export {profAuth};