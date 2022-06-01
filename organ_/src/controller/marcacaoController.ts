import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
import {addDias, c} from '../config/data'

const MarcacaoController=Router();
MarcacaoController.get('/criarmarcacao', async(req:Request, resp: Response)=>{

  try {
    const {mes, dia, ano, diaExtenso,idMedico ,especialidade}= req.body; 
    const  estadoMarcacao = "0";//Quer dizer que ainda não foi atendido
    const idPaciente= req.session?.user.id;
    // levar em conta a especialiade
  
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
    const idm = await  knex('marcacao').join('marcacao', 'marcacao.idMarcacao', 'medico.idMedico').where('hora', maior).select('*')
    const md =idm[0].idMedico;
    const medicos= await knex('medico').leftJoin('medicoEspecialidade', 'medico.idMedico','=', 'medicoEspecialidade.idMedico').where('role', 0).orWhere('idEspecialidade')
    const hora_consulta=(maior!=0 && maior< 17)?maior+1:8;
 

      const ids = await knex('marcacao').insert({dataMarcacao:c, estadoMarcacao, mes, dia, ano, hora:hora_consulta,diaExtenso, idPaciente,idMedico}).catch(err=> {console.log(err)})
      const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
      resp.json("cadastrado")
    }else{
      const ids = await knex('marcacao').insert({dataMarcacao:c, estadoMarcacao, mes, dia, ano, hora:8,diaExtenso, idPaciente,idMedico}).catch(err=> {console.log(err)})
      resp.json("cadastrado")
    }
  } catch (error) {
    resp.send(error + " - falha ao registar")
  }
})


MarcacaoController.get('/deletarrmarcacao/:id', async(req:Request, resp: Response)=>{
  try {
    const {id}= req.params; 
    const d= await knex('marcacao').where('idmarcacao',id).delete();

    if(d){
      req.flash("certo","Marcacao Cancelada")
      resp.redirect("/pacientemarcacoes")
    }else{
      req.flash("errado","Não deletou")
      resp.redirect("/pacientemarcacoes")
    }
  } catch (error) {
    req.flash("errado","Ocorreu um problema")
    resp.redirect("/pacientemarcacoes")
  }
})


export default MarcacaoController;

//image, name, email, whatsaap, nomeuser senha

