import knex from '../database/conection';
import multerConfig from '../config/multer';
import multer from 'multer'
import { Response, Request, Router } from  "express";
// import bCryptjs from 'bcryptjs'
const upload = multer(multerConfig);

const MedicoController=Router();
  MedicoController.post('cadastarMedico',upload.single('image'),async (req:Request, resp: Response)=>{
      try {
        const {nome, nomeMedico, userMedico, emailMedico, tellMedico, passMedico}= req.body; 
        const estadoMedico = 1
        const imagemMedico= (req.file) ? req.file.filename : 'user.png';
        const verify= await knex('medico').where('nomeMedico', nomeMedico).orWhere('userMedico', userMedico).orWhere('emailMedico', emailMedico)
        if(verify.length===0){
          const ids = await knex('medico').insert({nome, nomeMedico, userMedico, emailMedico, tellMedico, passMedico, estadoMedico, imagemMedico})
          const medico = await knex('medico').where('idMedico', ids[0])
          resp.send('Rota admin dash')
        }else{
          resp.send("erro")
        }
      } catch (error) {
        resp.send(error + " - falha ao registar")
      }
    }    
  )
  MedicoController.get("listarMedico", async(req:Request, resp:Response) =>{
    const d= await knex('medico').select('*')
    .join('especialidade', 'especialidade.idEspecialidade', 'medico.idMedico')
    resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})
MedicoController.get("editarrMedico/:id", async(req:Request, resp:Response) =>{
  const{id, nomeMedico, userMedico, emailMedico, tellMedico, passMedico}=req.params;
  const d= await knex('medico').where('idMedico',id).update({nomeMedico, userMedico, emailMedico, tellMedico, passMedico});
  resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})
MedicoController.get("deletarMedico/:id", async(req:Request, resp:Response) =>{
  const{id}=req.params;
  const d= await knex('medico').where('idMedico',id).delete();
  resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})
MedicoController.get("imagemMedico/:id",upload.single('image'), async(req:Request, resp:Response) =>{
  const{id}=req.params;
  const imagemMedico= (req.file) ? req.file.filename : 'user.png';
  const d= await knex('medico').where('idMedico',id).update({imagemMedico});
  resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})
// todas as marcacoes
MedicoController.get("listarmarcacoes", async(req:Request, resp:Response) =>{
  const d= await knex('marcacao')
  .join('marcacao', 'marcacao.idMarcacao', 'medico.idMedico').select('*')
  resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})
//Marcacoes especificos
MedicoController.get("Minhasmarcacoes", async(req:Request, resp:Response) =>{
  const d= await knex('marcacao')
  .join('marcacao', 'marcacao.idMarcacao', 'medico.idMedico').where({idMedico:req.session?.id})
  resp.render("admin/medico/index",  {adm:req.session?.admin.admn, d})
})



export default MedicoController;

//image, name, email, whatsaap, nomeuser senha

