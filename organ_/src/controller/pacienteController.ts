import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';

import { Response, Request, Router, request } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);

const PacienteController=Router();

import { date } from '@hapi/joi';
// import bCryptjs from 'bcryptjs
PacienteController.post('/criarpaciente',async(req:Request, resp: Response)=>{
  try {
    const {nomePaciente,nascimentoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente,senhaPaciente2}=req.body; 
   if(nomePaciente ===''||nascimentoPaciente===''|| userPaciente===''|| emailPaciente===''||tellPaciente ===''||senhaPaciente===''||senhaPaciente2===''){
    req.flash("errado"," Um dos compas não foi preenchido!")
     resp.redirect('/cadastrar')
   }else{ 
    let re = /[A-Z]/;
    const hasUpper = re.test(userPaciente);
    const verificaEspaco = /\s/g.test(userPaciente);
    const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailPaciente);
    const number = /^[9]{1}[0-9]{8}$/.test(tellPaciente)
    var dat3 = new Date();
    var ano = (dat3.getFullYear())
    var c =nascimentoPaciente.split("-")
    var a =parseInt(c[0])
    var t = ano-a 
    if(t > 90){
      req.flash('errado', "Idade Superior");
      resp.redirect('/cadastrar')
    }else
         if(t < 13){
            req.flash('errado', "Idade inferio aos 13");
            resp.redirect('/cadastrar')
         }else if (hasUpper === true) {
            req.flash('errado', "nao cadastrado 1");
            resp.redirect('/cadastrar')
   
   
         } else if (verificaEspaco === true) {
            req.flash('errado', "nao cadastrado 2");
            resp.redirect('/cadastrar')
   
         } else
            if (!Mailer) {
               req.flash('errado', "nao cadastrado 3");
               resp.redirect('/cadastrar')
            } else
               if (senhaPaciente.length < 5) {
                  req.flash('errado', "Senha muito fraca");
                  resp.redirect('/cadastrar')
               } else
                  if (senhaPaciente != senhaPaciente2) {
                     req.flash('errado', "Senha Diferentes");
                     resp.redirect('/cadastrar')
   
                  } else if(number == false) {
                     req.flash('errado', "Numero de Telefone incorreto");
                     resp.redirect('/cadastrar')
      
                  }else{
                    const estadoPaciente = "1"
                    const imgPaciente= (req.file) ? req.file.filename : 'user.png';
                    const verify= await knex('paciente').where('nomePaciente', nomePaciente).orWhere('userPaciente', userPaciente)
                    if(verify.length===0){
                      const ids = await knex('paciente').insert({imgPaciente, nomePaciente, nascimentoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente,estadoPaciente})
                      const p = await knex('paciente').orderBy('idPaciente', 'desc').select('*')
                      //resp.render("admin/paciente/index",  {paciente:req.session?.paciente.paciente, p})
                      req.flash("certo","Criado com sucesso !")
                      resp.redirect("/login")
                      //cod«ndições para quando o Adm cadastra e quando o Aluno se cadastra 
                    }else{
                      req.flash("errado","Esta conta Ja existe !")
                      resp.redirect('/cadastrar')
                    }}

                  }
 
  
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }})

  PacienteController.get("/paciente/:id", async(req:Request, resp:Response) =>{
    const{id}=req.params;
    const d= await knex('paciente').where('idpaciente',id).select("")
    if(d.length >0){
      resp.json(d)
    }else{
      resp.json("Paciente Nao encontrado")
    }
  })
  PacienteController.get("/pacientePainel", async(req:Request, resp: Response) =>{
    resp.render("Paciente/index")
  })

PacienteController.post('/editarpaciente',upload.single('image'),async(req:Request, resp: Response)=>{
  try {
    const {idPaciente, nomePaciente, nascimentoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente}= req.body; 

    const imgPaciente= (req.file) ? req.file.filename : 'user.png';
    const d= await knex('paciente').where('idPaciente',idPaciente).update({nomePaciente, nascimentoPaciente,imgPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente});
    const p = await knex('paciente').orderBy('idPaciente', 'desc').select('*')

      resp.redirect("/login")
     
   
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }})
 

  // Papel Do administrador
  PacienteController.get('/ListarPaciente', async(req:Request, resp:Response)=> {
    const p= await knex('paciente').orderBy('idPaciente', 'desc').select('*')
    resp.json(p)
  })
  
  PacienteController.get("/deletarpaciente/:id", async(req:Request, resp:Response) =>{
    const{id}=req.params;
    const d= await knex('paciente').where('idpaciente',id).delete();
    resp.json("Deletado")
   // resp.render("admin/medico/index")
  }) 

  


export default PacienteController;

//image, name, email, whatsaap, nomeuser senha

