import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
const EspecialidadeController=Router();
import medicoAuth from '../middlewre/medico'
import adminAuth from '../middlewre/admin'
import pacienteAuth from '../middlewre/paciente'


EspecialidadeController.post('/cadastarEspecialidade',adminAuth,async(req:Request, resp: Response)=>{
  try {
    const {nomeEspecialidade,descEspecialidade,precoEspecialidade}= req.body; 
    const idUser= req.session?.user.id;
    const {idMedico}= req.params;
    const medico= await knex('medico').where('idMedico', idUser).first();
    
    const verify = await knex('especialidade').where('nomeEspecialidade', nomeEspecialidade);
    if(verify.length>0){
      req.flash('Errado', 'Especialidade Não Cadastrada');
      resp.redirect('/listarEspecialidade')
    }else{
      const ids = await knex('especialidade').insert({nomeEspecialidade,descEspecialidade,precoEspecialidade});
      req.flash('certo', 'Especialidade Cadastrada');
      resp.redirect('/listarEspecialidade')
    }

  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})

EspecialidadeController.post('/editarespecialidade',adminAuth, async(req:Request, resp: Response)=>{
  try {
    const {idEspecialidade,nomeEspecialidade, descEspecialidade}= req.body; 
    const ids = await knex('especialidade').insert({nomeEspecialidade})
    const d= await knex('especialidade').where('idEspecialidade',idEspecialidade).update({nomeEspecialidade, descEspecialidade});
    if(ids.length > 0){
      resp.redirect('detalheEsp/'+idEspecialidade)
    }else{
      resp.send("Nao cadastrou")
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})
EspecialidadeController.get('/listarEspecialidade',adminAuth, async(req:Request, resp: Response)=>{
  try { 
    const especialidades= await knex('especialidade').select('*').orderBy('idEspecialidade','desc');
    const idUser= req.session?.user.id;
    const {idMedico}= req.params;
    const medico= await knex('medico').where('idMedico', idUser).first();
    const quantidade= await knex('medico').groupBy('idEspecialidade').count('idEspecialidade', {as:'quantidade'}).select('idEspecialidade');
    resp.render('Administrador/especializacaoLista', {especialidades, quantidade, medico})
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})
EspecialidadeController.get('/detalheEsp/:idEsp',adminAuth, async(req:Request, resp: Response)=>{
  try { 
    const {idEsp}= req.params;
    const idUser= req.session?.user.id;
    const medico= await knex('medico').where('idMedico', idUser).first();
    const especialidades= await knex('especialidade').where('idEspecialidade',idEsp).first();
    const quantidade= await knex('medico').where('idEspecialidade',idEsp).select('*');
    resp.render('Administrador/detalheEsp', {especialidades, quantidade,medico})
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})
EspecialidadeController.get('/editarespecialidade/:id', async(req:Request, resp: Response)=>{
  try {
    const {id}= req.params; 
    const d= await knex('especialidade').where('idEspecialidade',id).delete();

    if(d){
      resp.send('Especialidade deletado')
    }else{
      resp.send("Nao deletou")
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})
EspecialidadeController.get('/deletarEsp/:id', async(req:Request, resp: Response)=>{
  try {
    const {id}= req.params; 
    const d= await knex('especialidade').where('idEspecialidade',id).delete();
    resp.redirect('/listarEspecialidade')
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})


export default EspecialidadeController;

//image, name, email, whatsaap, nomeuser senha

