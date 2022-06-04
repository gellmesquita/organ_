import knex from '../database/conection';
import multerConfig from '../config/multer';
import multer from 'multer'
import { Response, Request, Router } from  "express";
import adminAuth from '../middlewre/admin'
import medicoAuth from '../middlewre/medico'
import pacienteAuth from '../middlewre/paciente'
// import bCryptjs from 'bcryptjs'
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
  MedicoController.get("/Medico/:id", async(req:Request, resp:Response) =>{
    const{id}=req.params;
    const d= await knex('medico').where('idMedico',id).select("")
    if(d.length >0){
      resp.json(d)
    }else{
      resp.json("Paciente Nao encontrado")
    }
  
   // resp.render("admin/medico/index")
  })
MedicoController.post("/editarrMedico", async(req:Request, resp:Response) =>{
  const{id, nomeMedico, userMedico, emailMedico, tellMedico, passMedico}=req.params;
  const d= await knex('medico').where('idMedico',id).update({nomeMedico, userMedico, emailMedico, tellMedico, passMedico});

})
MedicoController.get("/deletarMedico/:id", async(req:Request, resp:Response) =>{
  const{id}=req.params;
  const d= await knex('medico').where('idMedico',id).delete();
  resp.json("Deletado")
})
MedicoController.get("imagemMedico/:id",upload.single('image'), async(req:Request, resp:Response) =>{
  const{id}=req.params;
  const imagemMedico= (req.file) ? req.file.filename : 'user.png';
  const d= await knex('medico').where('idMedico',id).update({imagemMedico});
  resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})
// todas as marcacoes
MedicoController.get("/listarmarcacoes", async(req:Request, resp:Response) =>{
  const d= await knex('marcacao')
  .join('marcacao', 'marcacao.idMarcacao', 'medico.idMedico').select('*')
  resp.json(d)
})
//Marcacoes especificos
MedicoController.get("Minhasmarcacoes", async(req:Request, resp:Response) =>{
  const d= await knex('marcacao')
  .join('marcacao', 'marcacao.idMarcacao', 'medico.idMedico').where({idMedico:req.session?.id})
  resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})
//Roras Do Medico 
MedicoController.get("/medicoPainel", async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  
  resp.render("Medico/index",  {medico,medicos,consultas })
})

//Rotas Para o Administrador

MedicoController.get("/adminPainel",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  const pacientes=await knex('paciente').select('*')
  
  resp.render("Administrador/index",  {medico,medicos,consultas, pacientes })
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
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .distinct()

  resp.render("Administrador/listaConsulta",  {medico,medicos,consultas, especialidades })
})

MedicoController.get("/detalheConsulta/:idMarcacao",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMarcacao} =req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const consulta= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente')
  .where('idMarcacao',idMarcacao).first()

  resp.render("Administrador/consultaDetalhes",  {medico, especialidades, consulta })
})
MedicoController.get("/deletarConsulta/:idMarcacao",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const {idMarcacao} =req.params;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const especialidades= await knex('especialidade').select('*')
  const consulta= await knex('marcacao').where('idMarcacao',idMarcacao).del()

  resp.redirect("/listarConsulta")
})

export default MedicoController;

//image, name, email, whatsaap, nomeuser senha

