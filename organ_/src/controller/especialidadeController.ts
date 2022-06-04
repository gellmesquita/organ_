import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
const EspecialidadeController=Router();


EspecialidadeController.post('/teste',async(req:Request, resp: Response)=>{
  try {
    const {nomeEspecialidade,descEspecialidade}= req.body; 
    const ids = await knex('especialidade').insert({nomeEspecialidade,descEspecialidade})
    if(ids.length > 0){
      resp.send('Especialidade cadastrado')
    }else{
      resp.send("Nao cadastrou")
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})

EspecialidadeController.post('/editarespecialidade', async(req:Request, resp: Response)=>{
  try {
    const {id,nomeEspecialidade}= req.body; 
    const ids = await knex('especialidade').insert({nomeEspecialidade})
    const d= await knex('especialidade').where('idEspecialidade',id).update({nomeEspecialidade});
    if(ids.length > 0){
      resp.send('Especialidade cadastrado')
    }else{
      resp.send("Nao cadastrou")
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})
EspecialidadeController.get('/listarEspecialidade', async(req:Request, resp: Response)=>{
  try { 
    const especialidades= await knex('especialidade').select('*').orderBy('idEspecialidade','desc');
   

    resp.render('Administrador/especializacaoLista', {especialidades})
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


export default EspecialidadeController;

//image, name, email, whatsaap, nomeuser senha

