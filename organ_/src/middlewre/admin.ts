import { Response, Request, NextFunction } from "express";
const adminAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session){
        if(req.session.admin!==undefined){
            next();
        }else{
            resp.redirect('/')
        }
    }else{
        resp.redirect('/')
    }
}


export {adminAuth};