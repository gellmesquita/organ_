import knex from '../database/conection';
import multerConfig from '../config/multer';
import multer from 'multer'
import { Response, Request, Router } from  "express";
import adminAuth from '../middlewre/admin'
import medicoAuth from '../middlewre/medico'
import pacienteAuth from '../middlewre/paciente'
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);

const relatorioController=Router();
//Papel do Admin
  relatorioController.post('/criarRelatorio',async (req:Request, resp: Response)=>{
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


relatorioController.get("/listarRelatorios",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();

  const relatorios= await knex('Relatorio')
  .join('medico', 'Relatorio.idMedico', 'medico.idMedico')
  .join('marcacao', 'Relatorio.idMarcacao', 'marcacao.idMarcacao')
  .join('paciente', 'Relatorio.idPaciente', 'paciente.idPaciente')
  .where('relatorio.idMedico', idUser);
    const paciente= await knex('marcacao').join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').where('marcacao.idMedico',idUser )
  
  resp.render('Medico/relatorioLista',{medico, relatorios, paciente});
})

relatorioController.get("/relatoriosMedicos_",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();

  const relatorios= await knex('Relatorio')
  .join('medico', 'Relatorio.idMedico', 'medico.idMedico')
  .join('marcacao', 'Relatorio.idMarcacao', 'marcacao.idMarcacao')
  .join('paciente', 'Relatorio.idPaciente', 'paciente.idPaciente')

  const especialidades= await knex('especialidade').select('*');
    const paciente= await knex('marcacao').join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  
  resp.render('Administrador/relatorioLista',{medico, relatorios, paciente, especialidades});
})

relatorioController.get("/relatorioMedico_/:id",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {id}= req.params;

  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();
  const consulta= await knex('marcacao').join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('idMarcacao', id).first()
  
  resp.render('Medico/relatorioMedico',{medico, consulta});
})

relatorioController.post("/relatorio1",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {id, descRelatorio1, idPaciente}= req.body;

  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();

  const consulta= await knex('marcacao').join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('idMarcacao', id).first()
  
  resp.render('Medico/enviarRelatorio2',{medico, consulta, id, descRelatorio1, idPaciente});
})

relatorioController.post("/relatorioFinal",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMarcacao, descRelatorio1, AnaliseRelatorio, descRelatorio, Resultado, idPaciente}= req.body;
  const idMedico=idUser;
  const estadoRelatorio=0;
  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();

  const consulta= await knex('marcacao').join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('idMarcacao', idMarcacao).first()
  if(descRelatorio=="" || AnaliseRelatorio==""){
    resp.redirect('/relatorioMedico_/'+idMarcacao)
  }else{
    const c=await knex('Relatorio').insert({idMarcacao,idPaciente, descRelatorio1, AnaliseRelatorio, descRelatorio, Resultado,estadoRelatorio,idMedico})
    resp.redirect('/listarRelatorios')
  }
    
  // resp.render('Medico/enviarRelatorio2',{medico, consulta, id, descRelatorio1});
})
relatorioController.get("/relatorioDetalhe/:id/:idMarcacao",medicoAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {id, idMarcacao}= req.params;

  const medico= await knex('medico')
  .join('especialidade', 'medico.idEspecialidade', 'especialidade.idEspecialidade').where('idMedico', idUser).first();
  const consulta= await knex('marcacao').join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('idMarcacao', idMarcacao).first()
  const relatorios= await knex('Relatorio')
  .join('medico', 'Relatorio.idMedico', 'medico.idMedico')
  .join('marcacao', 'Relatorio.idMarcacao', 'marcacao.idMarcacao')
  .join('paciente', 'Relatorio.idPaciente', 'paciente.idPaciente')
  .where('id', id).first();
  // console.log(relatorios);
  
  
  resp.render('Medico/relatorioDetail',{medico, consulta, relatorios});
})


export default relatorioController;

//image, name, email, whatsaap, nomeuser senha

