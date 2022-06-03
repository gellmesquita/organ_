import {Router, Request, Response} from 'express';
const Route= Router (); 
import knex from './database/conection';
import MarcacaoController from './controller/marcacaoController';
import PacienteController from './controller/pacienteController';
import { authenticate } from './config/loginService';
import MedicoController from './controller/medicoController';
import multerConfig from './config/multer';
import multer from 'multer';
const upload = multer(multerConfig);


//Middlewares
import pacienteAuth from './middlewre/paciente' //medico
import adminAuth from './middlewre/admin'
import medicoAuth from './middlewre/medico'






//Rotas Gerais do Sistema
//Login principal
Route.get('/loginGeral', (req:Request, resp: Response)=>{
    resp.render('Site/login',{certo:req.flash('certo'),errado:req.flash('errado')})
})

//Cadastrar principal
Route.get('/cadastrarPaciente', (req:Request, resp: Response)=>{
    resp.render('Site/cadastroPaciente',{info:req.flash('info'),errado:req.flash('errado')})
})
Route.get('/acercade', async(req:Request, resp: Response)=>{
    const medicos= await knex('medico').where('role', 0)
    const consultas= await knex('marcacao').select('*')
    const pacientes= await knex('paciente').select('*')
    const especialidades=await knex('especialidade').select('*')
    const esp=await knex('especialidade').limit(3)
    resp.render('Site/acercade',{medicos, consultas, pacientes, especialidades,esp})
})


// Home page do Sistema
Route.get('/',async (req:Request, resp: Response)=>{
    const esp=await knex('especialidade').limit(3)
  
    const consultas= await knex('marcacao').select('*')
    const pacientes= await knex('paciente').select('*')
    const especialidades=await knex('especialidade').select('*');
    const medicos= await knex('medico').leftJoin('especialidade', 'medico.idEspecialidade','=', 'especialidade.idEspecialidade').where('role', 0).limit(4)
    resp.render('Site/index',{medicos, consultas, pacientes, especialidades,esp})
})

Route.get('/logout', (req:Request, resp: Response)=>{
    req.session = undefined
    resp.redirect('/')
})

//LOGIN GERAL DO SISTEMA
Route.post('/loginGeral',async (req:Request, resp: Response)=>{ 
    try {
        const {user, pass}= req.body;
        authenticate(user, pass).then(r=>{
            if(r==='-1'){
                req.flash("errado","Erro ao autenticar!")
                resp.redirect('/loginGeral')
                
            }else{
                const dados=r;
                if(dados){
                     if(dados.p === 'paciente'){ 
                        const pc:any = dados
                        if(req.session){
                          req.session.user={role:2, id:pc.pc.idPaciente};
                          resp.redirect('/pacientePainel')
                        }      
                     }else if(dados.p === 'admin'){
                        const adminDados:any = dados
                        if(req.session){
                          req.session.user={role:adminDados.admn.role, id:adminDados.admn.idMedico};
                          console.log(req.session.user);
                          resp.redirect('/adminPainel')
                        } 
                     }else if(dados.p==='medico_normal'){
                        const medico:any= dados
                        if(req.session){
                            req.session.user={role:medico.admn.role, id:medico.admn.idMedico};
                            resp.redirect('/medicoPainel')
                          
                        } 
                    }
                }
            }
        })   
    } catch (error) {
        console.log(error)
    }
})

export default Route;