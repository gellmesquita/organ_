import { Response, Request, NextFunction } from "express";
const medicoAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session?.user){
        if(req.session.user.role==0){
            next();
        }else{
            resp.redirect('/loginGeral')
        }
    }else{
        resp.redirect('/loginGeral')
    }
}


export default medicoAuth;