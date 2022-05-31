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
  MedicoController.post('/cadastarMedico',async (req:Request, resp: Response)=>{
      try {
        const {nomeMedico, userMedico, emailMedico, tellMedico, passMedico}= req.body; 
        const estadoMedico = 1;
        const role= 0;
        const imagemMedico= (req.file) ? req.file.filename : 'user.png';
        let re = /[A-Z]/;
        const hasUpper = re.test(userMedico);
        const verificaEspaco = /\s/g.test(userMedico);
        const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(emailMedico);
        const number = /^[9]{1}[0-9]{8}$/.test(tellMedico)
        if (hasUpper === true) {
          req.flash('errado', "nao cadastrado 1");
          resp.redirect('/cadastrar')
 
 
       } else if (verificaEspaco === true) {
          req.flash('errado', "nao cadastrado 2");
          resp.redirect('/cadastrar')
 
       } else
          if (!Mailer) {
             req.flash('errado', "nao cadastrado 3");
             resp.redirect('/cadastrar')
          } else
             if (passMedico.length < 5) {
                req.flash('errado', "Senha muito fraca");
                resp.redirect('/cadastrar')
             }else{
              
              const verify= await knex('medico').where('userMedico', userMedico).orWhere('emailMedico', emailMedico)
              if(verify.length===0){
                const ids = await knex('medico').insert({nomeMedico, userMedico, emailMedico, tellMedico, passMedico, estadoMedico, imagemMedico,role})
                const medico = await knex('medico').where('idMedico', ids[0])
                if (medico) {
                  req.flash("certo","Criado com sucesso !")
                  resp.json("criou")
                } else {
                  req.flash("errado","Nao criou !")
                  resp.json("Nao criou")
                }
              }else{
                resp.send("Esse dados ja Existem")
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
  MedicoController.get("/listarMedico", async(req:Request, resp:Response) =>{
    const d= await knex('medico').select('*')
    resp.json(d)
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

//Rotas Para o Administrador

MedicoController.get("/adminPainel", async(req:Request, resp:Response) =>{
  const idUser= req.session?.user.id;
  const medico= await knex('medico').where('idMedico', idUser).first();
  const medicos= await knex('medico').select('*')
  const consultas= await knex('marcacao')
  .join('medico', 'marcacao.idMedico', 'medico.idMedico')
  .join('paciente', 'marcacao.idPaciente', 'paciente.idPaciente').distinct()
  
  resp.render("admin/index",  {medico,medicos,consultas })
})



export default MedicoController;

//image, name, email, whatsaap, nomeuser senha

