import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import pacienteAuth from '../middlewre/paciente'

import { Response, Request, Router, request } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);

const PacienteController=Router();

import { date } from '@hapi/joi';
// import bCryptjs from 'bcryptjs
PacienteController.post('/Criarpaciente',async(req:Request, resp: Response)=>{
  const {nomePaciente,nascimentoPaciente,enderecoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente,senhaPaciente2,generoPaciente,provinciaPaciente,municipioPaciente}=req.body; 
 const estadoPaciente = "1";
 if(!(nomePaciente===''||nascimentoPaciente===''||enderecoPaciente===''|| userPaciente===''|| emailPaciente===''||tellPaciente===''||senhaPaciente===''||senhaPaciente2===''||generoPaciente===''||provinciaPaciente===''||municipioPaciente==='')){
  const imgPaciente= (req.file) ? req.file.filename : 'user.png';
  let re = /[A-Z]/;
  const hasUpper = re.test(userPaciente);
  const verificaEspaco = /\s/g.test(userPaciente);
  const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailPaciente);
  const number = /^[9]{1}[0-9]{8}$/.test(tellPaciente)
  var dat3 = new Date();
  var ano = (dat3.getFullYear());
  var c =nascimentoPaciente.split("-");
  var a =parseInt(c[0]);
  var t = ano-a ;
  if(t > 90){
    req.flash('errado', "Idade Superior");
   resp.redirect("/cadastrarPaciente")
  }else
       if(t < 13){
          req.flash('errado', "Idade inferio aos 13");
         resp.redirect("/cadastrarPaciente")
       }else if (hasUpper === true) {
          req.flash('errado', "nao cadastrado 1");
         resp.redirect("/cadastrarPaciente")
 
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
         resp.redirect("/cadastrarPaciente")
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
            resp.redirect("/cadastrarPaciente")
          } else
             if (senhaPaciente.length < 5) {
                req.flash('errado', "Senha muito fraca");
               resp.redirect("/cadastrarPaciente")
             } else
                if (senhaPaciente != senhaPaciente2) {
                   req.flash('errado', "Senha Diferentes");
                  resp.redirect("/cadastrarPaciente")
 
                } else if(number == false) {
                   req.flash('errado', "Numero de Telefone incorreto");
                  resp.redirect("/cadastrarPaciente")
    
                }else{ 
                  const verify= await knex('paciente').where('nomePaciente', emailPaciente).orWhere('userPaciente', userPaciente)
                  if(verify.length===0){
                    const ids = await knex('paciente').insert({imgPaciente, nomePaciente, nascimentoPaciente,enderecoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente,estadoPaciente,generoPaciente,provinciaPaciente,municipioPaciente}).catch(err =>{console.log(err); req.flash("errado","Ocorreu um problema!");resp.redirect("/cadastrarPaciente")})
                    const p = await knex('paciente').orderBy('idPaciente', 'desc').select('*')
                  
                    req.flash("certo","Criado com sucesso !")
                    resp.redirect("/loginGeral")
                  }else{
                    req.flash("info","Este usuario ja esta cadastrado!")
                    resp.redirect("/cadastrarPaciente")
                  
                   }
                }
 
 }else{
  req.flash("errado","Ocorreu um problema!")
  resp.redirect("/cadastrarPaciente")

 }
                   
})

  PacienteController.get("/perfilpaciente",pacienteAuth, async(req:Request, resp:Response) =>{
    const id=req.session?.user.id;
    const paciente= await knex('paciente').where('idPaciente', id).first();
    if(paciente){
      console.log(paciente)
      resp.render('Paciente/perfil',{paciente,certo:req.flash('certo'),errado:req.flash('errado')})
    }else{
      resp.redirect("/rota descon...")
    }
  })
  PacienteController.get("/pacientePainel",pacienteAuth, async(req:Request, resp: Response) =>{
    const id = req.session?.user.id;
    const medicos= await knex('medico').where('role', 0)
    const consultas= await knex('marcacao').select('*').where('idPaciente',id).andWhere('estadoMarcacao',0)
    const consultasfeitas= await knex('marcacao').select('*').where('idPaciente',id).andWhere('estadoMarcacao',1)
   const consultasadiadas= await knex('marcacao').select('*').where('idPaciente',id).andWhere('estadoMarcacao',2)
    const especialidades=await knex('especialidade').limit(3)
    resp.render("Paciente/index",{medicos, consultas,consultasfeitas,especialidades,consultasadiadas,certo:req.flash('certo'),errado:req.flash('errado')})
  })
  PacienteController.get("/pacientemarcacoes",pacienteAuth, async(req:Request, resp: Response) =>{
    const id = req.session?.user.id;
    
    const consultas= await knex('marcacao').where('idPaciente',id).andWhere('estadoMarcacao',0)
    .join('medico', 'marcacao.idMedico', 'medico.idMedico').select('*')
    
   console.log(consultas)
    resp.render("Paciente/marcacoes",{consultas,certo:req.flash('certo'),errado:req.flash('errado')})
  })
  PacienteController.get("/pacienteespecialidades",pacienteAuth, async(req:Request, resp: Response) =>{
    const id = req.session?.user.id;
   
    const especialidades=await knex('especialidade').select('*')
    resp.render("Paciente/especialidades",{especialidades,certo:req.flash('certo'),errado:req.flash('errado')})
  })
  PacienteController.get('/medicospaciente',pacienteAuth, async(req:Request, resp:Response)=> {
   
    const medicos= await knex('medico').leftJoin('especialidade', 'medico.idEspecialidade','=', 'especialidade.idEspecialidade').where('role', 0)

  console.log(medicos)
  resp.render("Paciente/team",{medicos})
 
  })

PacienteController.post('/editarpaciente',pacienteAuth,async(req:Request, resp: Response)=>{
  try {
    const {idPaciente, nomePaciente, enderecoPaciente, userPaciente, emailPaciente,tellPaciente,senha,senha2}= req.body; 
    console.log(senha)
    if(senha === senha2){
      if(senha ===''){
        const d= await knex('paciente').where('idPaciente',idPaciente).update({nomePaciente,userPaciente,enderecoPaciente, emailPaciente,tellPaciente});
        const p = await knex('paciente').orderBy('idPaciente', 'desc').select('*')
        req.flash('certo','Os dados Foram Actualizados') 
          resp.redirect("/perfilpaciente")
      }else{
        const d= await knex('paciente').where('idPaciente',idPaciente).update({nomePaciente,userPaciente,enderecoPaciente, emailPaciente,tellPaciente,senhaPaciente:senha});
        const p = await knex('paciente').orderBy('idPaciente', 'desc').select('*')
        req.flash('certo','Os dados Foram Actualizados') 
          resp.redirect("/perfilpaciente")
      }

    
    }else{
      req.flash('errado','Ocorreu um problema ao tentar alterar a senha de acesso') 
      resp.redirect("/perfilpaciente")
    }
   
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }})
  PacienteController.get('/acercade', async(req:Request, resp:Response)=> {
    const especialidades=await knex('especialidade').select('*')
  
    resp.render("Site/about",{especialidades})
  })
  PacienteController.get('/medicosLista', async(req:Request, resp:Response)=> {
    const especialidades=await knex('especialidade').select('*')
    const medicos= await knex('medico').where('role', 0).select('*')

  console.log(medicos)
  resp.render("Site/team",{medicos,especialidades})
 
  })
  PacienteController.get('/updatephoto',pacienteAuth, async(req:Request, resp:Response)=> {
    const id=req.session?.user.id;
    const paciente= await knex('paciente').where('idPaciente', id).first();
    if(paciente){
      console.log(paciente)
      resp.render('Paciente/updatephoto',{paciente,errado:req.flash('errado')})
    }else{
      resp.redirect("/rota descon...")
    }

 
  })
  PacienteController.post("/fotopaciente",upload.single('image'),pacienteAuth, async(req:Request, resp:Response) =>{
    const{idPaciente}=req.body;
    const imgPaciente= (req.file) ? req.file.filename : 'user.png';
    const d= await knex('paciente').where('idPaciente',idPaciente).update({imgPaciente});
    req.flash('certo','Sua foto Foi atualizado') 
    resp.redirect("/perfilpaciente")
  })
 


export default PacienteController;

//image, name, email, whatsaap, nomeuser senha

