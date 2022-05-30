import { Response, Request, NextFunction } from "express";
const pacienteAuth= (req:Request, resp:Response, next:NextFunction)=>{

    if(req.session){
        if(req.session.paciente!==undefined){
            next();
        }else{
            resp.redirect('/paciente')
        }
    }else{
        resp.redirect('/paciente')
    }
}

export {pacienteAuth};