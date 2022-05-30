import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);

const PacienteController=Router();
import { date } from '@hapi/joi';
// import bCryptjs from 'bcryptjs
PacienteController.post('criarpaciente',upload.single('image'),async(req:Request, resp: Response)=>{
  try {
    const { nomePaciente, nascimentoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente}= req.body; 
    const estadoPaciente = "1"
    const data = new Date()
    const imgPaciente= (req.file) ? req.file.filename : 'user.png';
    const verify= await knex('paciente').where('nomePaciente', nomePaciente).orWhere('userPaciente', userPaciente)
    if(verify.length===0){
      const ids = await knex('paciente').insert({imgPaciente, nomePaciente, nascimentoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente,estadoPaciente})
      const p = await knex('paciente').orderBy('idPaciente', 'desc').select('*')
      //resp.render("admin/paciente/index",  {paciente:req.session?.paciente.paciente, p})
      resp.redirect("/login")
      //cod«ndições para quando o Adm cadastra e quando o Aluno se cadastra 
    }else{
      resp.send('Nome de usuário já existe, troca por um outro') 
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }})


PacienteController.get('ListarPaciente', async(req:Request, resp:Response)=> {
  const p= await knex('paciente').orderBy('idPaciente', 'desc').select('*')
  resp.render("admin/paciente/index",  {adm:req.session?.admin.admn, p})
})

PacienteController.post('editarpaciente',upload.single('image'),async(req:Request, resp: Response)=>{
  try {
    const {idPaciente, nomePaciente, nascimentoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente}= req.body; 
   
    const data = new Date()
    const imgPaciente= (req.file) ? req.file.filename : 'user.png';
    const d= await knex('paciente').where('idPaciente',idPaciente).update({nomePaciente, nascimentoPaciente,imgPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente});
      const p = await knex('paciente').orderBy('idPaciente', 'desc').select('*')
      //resp.render("admin/paciente/index",  {paciente:req.session?.paciente.paciente, p})
      resp.redirect("/login")
      //cod«ndições para quando o Adm cadastra e quando o Aluno se cadastra 
   
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }})
  
  PacienteController.get("deletarpaciente/:id", async(req:Request, resp:Response) =>{
    const{id}=req.params;
    const d= await knex('paciente').where('idpaciente',id).delete();
    resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
  }) 
  


export default PacienteController;

//image, name, email, whatsaap, nomeuser senha

