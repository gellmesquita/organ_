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
          req.flash('Erro1', 'Valores incorretos');
          resp.redirect('/FormMedico')
        }else{
          const medico= await knex('medico').where('nomeMedico',nomeMedico).orWhere('userMedico',userMedico).orWhere('tellMedico',userMedico).orWhere('passMedico',passMedico)
          if(medico.length>0){
            console.log('Certo1');
            req.flash('Erro1', 'Valores incorretos');
            resp.redirect('/FormMedico')
          }else{
            if(!nomeMedico.match(/\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi) || !( /^[9]{1}[0-9]{8}$/.test(tellMedico)) || !userMedico.match(/^[a-z0-9_.]+$/)){
              console.log('Certo2')
              req.flash('Erro1', 'Valores incorretos');
              resp.redirect('/FormMedico')
            }else{
              if(passMedico2==passMedico){
                const medito= await knex('medico').insert({role:0, nomeMedico, userMedico, emailMedico, tellMedico, passMedico, idEspecialidade,generoMedico,imagemMedico, descMedico})
                req.flash('Certo', 'Medico Cadastrato com Sucesso');
                resp.redirect('/listarMedico')
              }else{
                console.log('Certo3')
                req.flash('Erro1', 'Valores incorretos');
                resp.redirect('/FormMedico')
              }
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

MedicoController.get("/adminPainel", async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  
  resp.render("Administrador/index",  {medico,medicos,consultas })
})

MedicoController.get("/listarMedico",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').join('especialidade', 'medico.idEspecialidade','=', 'especialidade.idEspecialidade').where('role', 0)
  const especialidades= await knex('especialidade').select('*')
    
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  
  resp.render("Administrador/listaMedico",  {medico,medicos,consultas, especialidades })
})

MedicoController.get("/FormMedico",adminAuth, async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').leftJoin('medicoEspecialidade', 'medico.idMedico','=', 'medicoEspecialidade.idMedico').where('role', 0)
  const especialidades= await knex('especialidade').select('*') 
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  
  resp.render("Administrador/cadastroMedico",  {medico,medicos,consultas, especialidades })
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

export default MedicoController;

//image, name, email, whatsaap, nomeuser senha

