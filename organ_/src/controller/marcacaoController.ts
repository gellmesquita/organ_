import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
import {addDias, c} from '../config/data'

const MarcacaoController=Router();
MarcacaoController.post('criarmarcacao', async(req:Request, resp: Response)=>{

  try {
    const { dataMarcacao, mes, dia, ano, diaExtenso, idpaciente,idMedico}= req.body; 
    const  estadoMarcacao = "1"
  
    const verify= await knex('marcacao').join('marcacao', 'marcacao.idMarcacao', 'medico.idMedico').where('dataMarcacao', c).groupBy('dia').count('dia',{as: 'quantidade'}).select('*');
    if(verify.length >  0){
      const horas_marcadas=verify.map(hora=>hora.hora);
      var maior =0;
      for(let i=0;i<horas_marcadas.length;i++){

        for(let i1=0;i1<horas_marcadas.length;i1++){
        if(horas_marcadas[i]>horas_marcadas[i1] ){
          if(horas_marcadas[i]>maior){
            maior=horas_marcadas[i]
          }
        }
      } 
    }
    const hora_consulta=(maior!=0 && maior< 17)?maior+1:8;

      const ids = await knex('marcacao').insert({})
      const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
      //resp.render("admin/marcacao/index",  {marcacao:req.session?.marcacao.marcacao, p})
      resp.redirect("/login")
      //cod«ndições para quando o Adm cadastra e quando o Aluno se cadastra 
    }else{
      resp.send('Nome de usuário já existe, troca por um outro') 
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})

MarcacaoController.post('editarmarcacao', async(req:Request, resp: Response)=>{
  try {
    const {id,nomemarcacao}= req.body; 
    const ids = await knex('marcacao').insert({nomemarcacao})
    const d= await knex('marcacao').where('idmarcacao',id).update({nomemarcacao});
    if(ids.length > 0){
      resp.send('marcacao cadastrado')
    }else{
      resp.send("Nao cadastrou")
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})
MarcacaoController.get('editarmarcacao/:id', async(req:Request, resp: Response)=>{
  try {
    const {id}= req.params; 
    const d= await knex('marcacao').where('idmarcacao',id).delete();

    if(d){
      resp.send('marcacao deletado')
    }else{
      resp.send("Nao deletou")
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})


export default MarcacaoController;

//image, name, email, whatsaap, nomeuser senha

