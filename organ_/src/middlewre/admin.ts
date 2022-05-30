import { Response, Request, NextFunction } from "express";
const adminAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session){
        if(req.session.user.role==1){
            next();
        }else{
            resp.redirect('/login')
        }
    }else{
        resp.redirect('/login')
    }
}


export default adminAuth;