import knex from '../database/conection';
import multer from 'multer'
import multerConfig from '../config/multer';
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);
import {addDias, c,day} from '../config/data'

const MarcacaoController=Router();
MarcacaoController.get('/criarmarcacao/:idesp', async(req:Request, resp: Response)=>{

  try {
    const {idesp}= req.params;
 
  
    const medicos= await knex('medicoEspecialidade').where('idEspecialidade', idesp)
    const  estadoMarcacao = "0";//Quer dizer que ainda não foi atendido
    const idPaciente= req.session?.user.id;
    if(medicos.length> 0){

   
    
    const s =c.split("-")
    const ano =s[0];
    const  mes  =s[1];
    const dia =s[2];
 
  
   
  
    const verify= await knex('marcacao').where('dataMarcacao', c).max('hora',{as: 'maior'});
    const maior= verify[0].maior
    
    if(verify.length >  0 && maior!=null){
    
    console.log(maior)
    const idm = await  knex('marcacao').join('medico', 'marcacao.idMarcacao', 'medico.idMedico').where('hora', maior).select('*')
    console.log(maior)
    const hora_consulta = maior + 1;
    console.log(hora_consulta)
   if(hora_consulta > 17){

     console.log(c)
   var t =(addDias(c, 1))
   var b= t.toISOString();
   var inicio = b.split("T")
   var ctx = (inicio[0]);
   var data = new Date(ctx);    
   var dayx = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
   console.log(ctx)
   console.log(dayx)
   const verify= await knex('marcacao').where('dataMarcacao', ctx).max('hora',{as: 'maior'});
   const mai= verify[0].maior;
   const hora_consul = mai + 1;
   if(hora_consul < 18){

   if(day=="Sábado"){
    t =(addDias(c, 3))
    var b= t.toISOString();
    var inicio = b.split("T")

 ctx = (inicio[0]);
 data = new Date(ctx);
    
dayx = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
const sx =ctx.split("-")
const ano =sx[0];
const  mes  =sx[1];
const dia =sx[2];
    
const ids = await knex('marcacao').insert({dataMarcacao:ctx, estadoMarcacao, mes, dia, ano, hora:hora_consul,diaExtenso:dayx, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
 const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
 req.flash("certo","Marcação Agendada")
 resp.redirect("/pacienteespecialidades")
    

}else if(day=="Domingo"){
    t =(addDias(c, 2))
    var b= t.toISOString();
    var inicio = b.split("T")

   var  ctx = (inicio[0]);
     data = new Date(ctx);    
     dayx = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
     const sx =ctx.split("-")
     const ano =sx[0];
    const  mes  =sx[1];
    const dia =sx[2];
         
     const ids = await knex('marcacao').insert({dataMarcacao:ctx, estadoMarcacao, mes, dia, ano, hora:hora_consul,diaExtenso:dayx, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
      const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
      req.flash("certo","Marcação Agendada")
      resp.redirect("/pacienteespecialidades")
    
}else{
  var t =(addDias(c, 1))
  var b= t.toISOString();
  var inicio = b.split("T")
  var ctx = (inicio[0]);
   const sx =ctx.split("-")
     const ano =sx[0];
    const  mes  =sx[1];
    const dia =sx[2];
  var data = new Date(ctx);    
  var dayx = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
  const ids = await knex('marcacao').insert({dataMarcacao:ctx, estadoMarcacao, mes, dia, ano, hora:hora_consul,diaExtenso:dayx, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
      const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
      req.flash("certo","Marcação Agendada")
      resp.redirect("/pacienteespecialidades")

}
}else if(hora_consul == null){
  if(day=="Sábado"){
    t =(addDias(c, 3))
    var b= t.toISOString();
    var inicio = b.split("T")

 ctx = (inicio[0]);
 data = new Date(ctx);
    
dayx = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
const sx =ctx.split("-")
const ano =sx[0];
const  mes  =sx[1];
const dia =sx[2];
    
const ids = await knex('marcacao').insert({dataMarcacao:ctx, estadoMarcacao, mes, dia, ano, hora:hora_consul,diaExtenso:dayx, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
 const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
 req.flash("certo","Marcação Agendada")
 resp.redirect("/pacienteespecialidades")
    

}else if(day=="Domingo"){
    t =(addDias(c, 2))
    var b= t.toISOString();
    var inicio = b.split("T")

   var  ctx = (inicio[0]);
     data = new Date(ctx);    
     dayx = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
     const sx =ctx.split("-")
     const ano =sx[0];
    const  mes  =sx[1];
    const dia =sx[2];
         
     const ids = await knex('marcacao').insert({dataMarcacao:ctx, estadoMarcacao, mes, dia, ano, hora:hora_consul,diaExtenso:dayx, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
      const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
      req.flash("certo","Marcação Agendada")
      resp.redirect("/pacienteespecialidades")
    
}else{
  var t =(addDias(c, 1))
  var b= t.toISOString();
  var inicio = b.split("T")
  var ctx = (inicio[0]);
   const sx =ctx.split("-")
     const ano =sx[0];
    const  mes  =sx[1];
    const dia =sx[2];
  var data = new Date(ctx);    
  var dayx = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
  const ids = await knex('marcacao').insert({dataMarcacao:ctx, estadoMarcacao, mes, dia, ano, hora:hora_consul,diaExtenso:dayx, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
      const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
      req.flash("certo","Marcação Agendada")
      resp.redirect("/pacienteespecialidades")

}
}else{
  req.flash("errado","Marcações lotadas tente mas tarde ou amanhã")
  resp.redirect("/pacientemarcacoes")
}
   }else{
    const ids = await knex('marcacao').insert({dataMarcacao:c, estadoMarcacao, mes, dia, ano, hora:hora_consulta,diaExtenso:day, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
    const p = await knex('marcacao').orderBy('idmarcacao', 'desc').select('*')
    req.flash("certo","Marcação Agendada")
    resp.redirect("/pacienteespecialidades")
   } 
    }else{
      const ids = await knex('marcacao').insert({dataMarcacao:c, estadoMarcacao, mes, dia, ano, hora:8,diaExtenso:day, idPaciente,idMedico:medicos[0].idMedico}).catch(err=> {console.log(err)})
      req.flash("certo","Marcação Agendada")
    resp.redirect("/pacienteespecialidades")
    }
  }else{
    req.flash("errado","Sem especialista de momento")
    resp.redirect("/pacienteespecialidades")
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

