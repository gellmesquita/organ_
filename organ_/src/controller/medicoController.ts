import knex from '../database/conection';
import multerConfig from '../config/multer';
import multer from 'multer'
import { Response, Request, Router } from  "express";
import adminAuth from '../middlewre/admin'
import medicoAuth from '../middlewre/medico'
import pacienteAuth from '../middlewre/paciente'
import {addDias, c,day,dataAtual } from '../config/data'
const upload = multer(multerConfig);

const MedicoController=Router();
//Papel do Admin
  MedicoController.post('/cadastarMedico',upload.single('image'),async (req:Request, resp: Response)=>{
      try {
        const imagemMedico= (req.file) ? req.file.filename : 'user.png';       
        const {nomeMedico, userMedico, emailMedico, tellMedico, passMedico, idEspecialidade,generoMedico, descMedico, passMedico2}= req.body;         
        if(nomeMedico=='' || userMedico=='' || emailMedico=='' || tellMedico=='' || passMedico=='' || idEspecialidade=='' || generoMedico=='' || descMedico=='' || passMedico2==''){
          req.flash('errado', 'Valores incorretos');
          resp.redirect('/FormMedico')
        }else{
          let re = /[A-Z]/;
          const hasUpper = re.test(userMedico);
          const verificaEspaco = /\s/g.test(userMedico);
          const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailMedico);
          const number = /^[9]{1}[0-9]{8}$/.test(tellMedico)
          if (hasUpper === true) {
            req.flash('errado', "Ocorreu um problema");
          resp.redirect('/FormMedico')
       
   
         } else if (verificaEspaco === true) {
            req.flash('errado', "nao cadastrado 2");
          resp.redirect('/FormMedico')
   
         } else
            if (!Mailer) {
               req.flash('errado', "nao cadastrado 3");
             resp.redirect('/FormMedico')
            } else
               if (passMedico.length < 5) {
                  req.flash('errado', "Senha muito fraca");
                resp.redirect('/FormMedico')
               } else
                  if (passMedico != passMedico2) {
                     req.flash('errado', "Senha Diferentes");
                   resp.redirect('/FormMedico')
   
                  } else if(number == false) {
                     req.flash('errado', "Numero de Telefone incorreto");
                   resp.redirect('/FormMedico')
      
                  }else{ 
          const medico= await knex('medico').where('userMedico',userMedico).orWhere('tellMedico',tellMedico).orWhere('passMedico',emailMedico)
          if(medico.length>0){
            
            req.flash('errado', 'Esses dados Ja encontra-se presente ');
            resp.redirect('/FormMedico')
          }else{
            const medito= await knex('medico').insert({role:0, nomeMedico, userMedico, emailMedico, tellMedico, passMedico, idEspecialidade,generoMedico,imagemMedico, descMedico})
            req.flash('certo', 'Medico Cadastrato com Sucesso');
            resp.redirect('/listarMedico')
           
          }
        }
      }
       
      } catch (error) {
        resp.send(error + " - falha ao registar")
      }
    }    
  )

MedicoController.post("/editarrMedic0",medicoAuth,upload.single('image'), async(req:Request, resp:Response) =>{
     

  const {nomeMedico,id, userMedico, emailMedico, tellMedico, passMedico,generoMedico, descMedico,enderecoMedico}= req.body;
  const idUser= req.session?.user.id;
  const f= await knex('medico').where('idMedico',id).first(); 
  const imagemMedico= (req.file) ? req.file.filename : f.imagemMedico; 
  const d= await knex('medico')
  .where('idMedico',id).update({nomeMedico, userMedico, emailMedico, tellMedico, passMedico,generoMedico,enderecoMedico, descMedico,imagemMedico});
  console.log(d);
  resp.redirect('/medicoperfil');
  
  

})
MedicoController.get("/deletarMedico/:id", async(req:Request, resp:Response) =>{
  const{id}=req.params;
  const d= await knex('medico').where('idMedico',id).delete();
  resp.json("Deletado")
})
MedicoController.get("/medicoperfil",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMedico}= req.params;
  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('marcacao.idMedico', idUser).distinct()

  resp.render("Medico/perfilMedico",  {medico,consultas, especialidades })
})

// todas as marcacoes
MedicoController.get("/listarmarcacoes",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('marcacao.idMedico', idUser)
  
  resp.render('Medico/consultaLista',{medico, consultas});
})
MedicoController.get("/medicioEditar_",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();
  const consultas= await knex('marcacao').join('medico', 'marcacao.idMedico', 'medico.idMedico').where('marcacao.idMedico', idUser)
  const especialidades=await knex('especialidade').select('*')
  
  resp.render('Medico/editarMedico',{medico, consultas, especialidades});
})
MedicoController.post("/editarMedico_",medicoAuth,upload.single('image'), async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {nomeMedico, userMedico, emailMedico, descMedico, idMedico , idEspecialidade} =req.body;
  
  const paciente= await knex('medico').where('idMedico', idMedico).update({nomeMedico, userMedico, emailMedico, descMedico,idEspecialidade})
  resp.redirect('/perfilMedico_/'+idMedico)
})
MedicoController.get("/pacienteMedico",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('marcacao.idMedico', idUser)
  
  resp.render('Medico/pacienteLista',{medico, consultas});
})

MedicoController.get("/consultaDetalhe/:id",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {id}= req.params;

  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();
  const consulta= await knex('marcacao').join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('idMarcacao', id).first()
  const relatorios= await knex('Relatorio')
  .join('medico', 'Relatorio.idMedico', 'medico.idMedico')
  .join('marcacao', 'Relatorio.idMarcacao', 'marcacao.idMarcacao')
  .join('paciente', 'Relatorio.idPaciente', 'paciente.idPaciente')
  .where('Relatorio.idMarcacao', id).select('id');
  
  let verify=0;
  if(relatorios.length>0){
    verify =1
  }
  const data= new Date();
 

  resp.render('Medico/consultaDetail',{medico, consulta, verify, dataAtual, hora:data.getHours(), relatorio:relatorios[0]});
})

//Roras Do Medico 
MedicoController.get("/medicoPainel",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').select('*')
  const especialidades= await knex('especialidade').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').where('marcacao.idMedico',idUser )

  const m= await knex('marcacao').where('estadoMarcacao', 0).andWhere('idMedico',idUser );
  const r= await knex('marcacao').where('estadoMarcacao', 1).andWhere('idMedico',idUser );
  const n= await knex('marcacao').where('estadoMarcacao', 2).andWhere('idMedico',idUser );

  const ev= await knex('marcacao').groupBy('mes').where('idMedico',idUser ).count('mes', {as:'marcada'}).select('*')
  const marcRealizada= await knex('marcacao').where('estadoMarcacao',1).where('idMedico',idUser ).groupBy('mes').count('mes', {as:'marcRealizada'}).select('*')
  const naoRealizada= await knex('marcacao').where('estadoMarcacao',2).where('idMedico',idUser ).groupBy('mes').count('mes', {as:'naoRealizada'}).select('*')

  const dados=ev.map(e=>{
      //Consultas Efectuadas 
      const real=marcRealizada.map(ed=>(ed.mes==e.mes)?ed.marcRealizada:0)
      const v=real.map(r=>parseInt(r.toString())).reduce((prev, curr)=>prev+curr, 0)
      //Não Realizada
      const realC=naoRealizada.map(ed=>(ed.mes==e.mes)?ed.naoRealizada:0);
      const vC=realC.map(r=>parseInt(r.toString())).reduce((prev, curr)=>prev+curr, 0)
      
     let name;
     switch (e.mes) {
         case '01':
             name="Janeiro"
             break;
             case '02':
                 name="Fevereiro"
                 break;
                 case '03':
                     name="Março"
                     break;
                     case '04':
                         name="Abril"
                         break;
                         case '05':
                             name="Maio"
                             break;
                             case '06':
                                 name="Junho"
                                 break;
                                 case '07':
                                     name="Julho"
                                     break;
                                     case '08':
                                     name="Agosto"
                                     break;
                                     case '09':
                                     name="Setembro"
                                     break;
                                     case '10':
                                     name="Outubro"
                                     break;
                                     case '11':
                                     name="Novembro"
                                     break;
                                     case '12':
                                     name="Dezembro"
                                     break;
     
         default:
             break;
     }
     return {mes:name, marcada:e.marcada, realizada:v, naoRealizada:vC}
  }) 
  const meses= ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro','Outubro','Novembro','Dezembro'];
  const naorealizado=meses.map(i=>{
      const e=dados.filter(e=>e.mes==i);
      if(e.length>0){
          return e[0].naoRealizada
      }else{
          return 0
      }
      
  })
  const realizado=meses.map(i=>{
      const e=dados.filter(e=>e.mes==i);
      if(e.length>0){
          return e[0].realizada
      }else{
          return 0
      }
      
  })
  const marcada=meses.map(i=>{
    const e=dados.filter(e=>e.mes==i);
    if(e.length>0){
        return e[0].marcada
    }else{
        return 0
    }
    
})
  resp.render("Medico/index",  {medico,medicos,consultas, especialidades, m,r,n , marcada, realizado, naorealizado, meses})
})

//Rotas Para o Administrador

MedicoController.get("/adminPainel",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').orderBy('idMarcacao', 'desc').distinct()
  const pacientes=await knex('paciente').select('*')
  const especialidades=await knex('especialidade').select('*')
  
  const ev= await knex('marcacao').groupBy('mes').count('mes', {as:'marcada'}).select('*')
  const marcRealizada= await knex('marcacao').where('estadoMarcacao',1).groupBy('mes').count('mes', {as:'marcRealizada'}).select('*')
  const naoRealizada= await knex('marcacao').where('estadoMarcacao',2).groupBy('mes').count('mes', {as:'naoRealizada'}).select('*')

  const dados=ev.map(e=>{
      //Consultas Efectuadas 
      const real=marcRealizada.map(ed=>(ed.mes==e.mes)?ed.marcRealizada:0)
      const v=real.map(r=>parseInt(r.toString())).reduce((prev, curr)=>prev+curr, 0)
      //Não Realizada
      const realC=naoRealizada.map(ed=>(ed.mes==e.mes)?ed.naoRealizada:0);
      const vC=realC.map(r=>parseInt(r.toString())).reduce((prev, curr)=>prev+curr, 0)
      
     let name;
     switch (e.mes) {
         case '01':
             name="Janeiro"
             break;
             case '02':
                 name="Fevereiro"
                 break;
                 case '03':
                     name="Março"
                     break;
                     case '04':
                         name="Abril"
                         break;
                         case '05':
                             name="Maio"
                             break;
                             case '06':
                                 name="Junho"
                                 break;
                                 case '07':
                                     name="Julho"
                                     break;
                                     case '08':
                                     name="Agosto"
                                     break;
                                     case '09':
                                     name="Setembro"
                                     break;
                                     case '10':
                                     name="Outubro"
                                     break;
                                     case '11':
                                     name="Novembro"
                                     break;
                                     case '12':
                                     name="Dezembro"
                                     break;
     
         default:
             break;
     }
     return {mes:name, marcada:e.marcada, realizada:v, naoRealizada:vC}
  }) 
  const meses= ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro','Outubro','Novembro','Dezembro'];
  const naorealizado=meses.map(i=>{
      const e=dados.filter(e=>e.mes==i);
      if(e.length>0){
          return e[0].naoRealizada
      }else{
          return 0
      }
      
  })
  const realizado=meses.map(i=>{
      const e=dados.filter(e=>e.mes==i);
      if(e.length>0){
          return e[0].realizada
      }else{
          return 0
      }
      
  })
  const marcada=meses.map(i=>{
    const e=dados.filter(e=>e.mes==i);
    if(e.length>0){
        return e[0].marcada
    }else{
        return 0
    }
    
})

  const usuarios=medicos.concat(pacientes).concat(medico)
  
  resp.render("Administrador/index",  {medico,usuarios,medicos,consultas, pacientes, naorealizado,realizado,marcada, meses, especialidades })
})

MedicoController.get("/listarMedico",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').join('especialidade', 'medico.idEspecialidade','=', 'especialidade.idEspecialidade').where('role', 0)
  const especialidades= await knex('especialidade').select('*')
    
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  
  resp.render("Administrador/listaMedico",  {medico,medicos,consultas, especialidades,certo:req.flash('certo'),errado:req.flash('errado') })
})

MedicoController.get("/FormMedico",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').leftJoin('medicoEspecialidade', 'medico.idMedico','=', 'medicoEspecialidade.idMedico').where('role', 0)
  const especialidades= await knex('especialidade').select('*') 
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  
  resp.render("Administrador/cadastroMedico",  {medico,medicos,consultas, especialidades,certo:req.flash('certo'),errado:req.flash('errado')})
})

MedicoController.get("/perfilMedico_/:idMedico",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMedico}= req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').join('especialidade', 'medico.idEspecialidade','=', 'especialidade.idEspecialidade').where('medico.idMedico',idMedico).distinct().first()
  const especialidades= await knex('especialidade').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('marcacao.idMedico', idMedico).distinct()

  resp.render("Administrador/perfilMedico",  {medico,medicos,consultas, especialidades })
})
MedicoController.get("/perfilPaciente/:idPaciente",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMedico}= req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').join('medicoEspecialidade', 'medico.idMedico','=', 'medicoEspecialidade.idMedico').where('medico.idMedico',idMedico).distinct().first()
  const especialidades= await knex('especialidade').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('marcacao.idMedico', idMedico).distinct()
  resp.render("Administrador/perfilMedico",  {medico,medicos,consultas, especialidades })
})
MedicoController.get("/pacientes_",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const paciente= await knex('paciente').select('*')
  resp.render("Administrador/paciente",  {medico,paciente, especialidades })
})

MedicoController.get("/pacienteDetalhe/:idPaciente",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idPaciente} =req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const paciente= await knex('paciente').where('idPaciente', idPaciente).first();
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .where('idPaciente', idPaciente).select('*')

  resp.render("Administrador/pacienteDetalhe",  {medico,paciente, especialidades, consultas })
})


MedicoController.get("/pacienteDeletar/:idPaciente",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idPaciente} =req.params;
  const marcacao=await knex('marcacao').where('idPaciente', idPaciente).del();
  const paciente= await knex('paciente').where('idPaciente', idPaciente).del();
  resp.redirect('/pacientes_')

})

MedicoController.get("/pacienteEditar/:idPaciente",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idPaciente} =req.params;
  const paciente= await knex('paciente').where('idPaciente', idPaciente).first()
  resp.render('Administrador/editarPaciente',{paciente})

})

MedicoController.post("/editarPaciente_",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {nomePaciente, userPacientem, emailPaciente, enderecoPaciente, idPaciente } =req.body;
  const paciente= await knex('paciente').where('idPaciente', idPaciente).update({nomePaciente, userPacientem, emailPaciente, enderecoPaciente})
  resp.redirect('/pacienteDetalhe/'+idPaciente)
})
MedicoController.get("/medicoEditar/:idMedico",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMedico} =req.params;
  console.log(idMedico);
  
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const medicos= await knex('medico').where('idMedico', idMedico).first();
  console.log(medicos);
    
  resp.render("Administrador/editarMedico",  {medico, especialidades, medicos })
})


MedicoController.get("/editarMedicos_/:idMedico",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMedico} =req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const medicos= await knex('medico').where('idMedico', idMedico).first();
  
  resp.render("Administrador/editarMedico",  {medico, especialidades, medicos })
})

MedicoController.post("/editarMedico_",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {nomeMedico, userMedico, emailMedico, descMedico, idMedico , idEspecialidade} =req.body;
  console.log(idMedico);
  
  const paciente= await knex('medico').where('idMedico', idMedico).update({nomeMedico, userMedico, emailMedico, descMedico,idEspecialidade})
  resp.redirect('/perfilMedico_/'+idMedico)
})

MedicoController.get("/listarConsulta",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').join('especialidade', 'medico.idEspecialidade','=', 'especialidade.idEspecialidade').where('role', 0)
  const especialidades= await knex('especialidade').select('*') 
  const consultas= await knex('marcacao').where('estadoMarcacao','<', 4)
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .distinct()

  resp.render("Administrador/listaConsulta",  {medico,medicos,consultas, especialidades })
})
MedicoController.get("/listarPedido",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').join('especialidade', 'medico.idEspecialidade','=', 'especialidade.idEspecialidade').where('role', 0)
  const especialidades= await knex('especialidade').select('*') 
  const consultas= await knex('marcacao').where('estadoMarcacao', 5)
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .distinct()

  resp.render("Administrador/listaPedidos",  {medico,medicos,consultas, especialidades, })
})

MedicoController.get("/detalheConsulta/:idMarcacao",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMarcacao} =req.params;
  const comprovativo= await knex('comprovativo').where('idMarcacao', idMarcacao).first();
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const consulta= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('idMarcacao',idMarcacao).first()

  resp.render("Administrador/consultaDetalhes",  {medico,comprovativo, especialidades, consulta,certo:req.flash('certo'),errado:req.flash('errado') })
})
MedicoController.get("/deletarConsulta/:idMarcacao",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMarcacao} =req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const consulta= await knex('marcacao').where('idMarcacao',idMarcacao).del()

  resp.redirect("/listarConsulta")
})

MedicoController.get("/perfilAdmin",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMedico}= req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')


  resp.render("Administrador/perfilAdmin",  {medico, especialidades })
})

export default MedicoController;

//image, name, email, whatsaap, nomeuser senha

