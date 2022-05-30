import { Response, Request, NextFunction } from "express";
const pacienteAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session){
        if(req.session.user.role==2){
            next();
        }else{
            resp.redirect('/')
        }
    }else{
        resp.redirect('/')
    }
}

export default  pacienteAuth;