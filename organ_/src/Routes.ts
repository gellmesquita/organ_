import {Router, Request, Response} from 'express';
const Route= Router (); 
import MarcacaoController from './controller/marcacaoController';
import PacienteController from './controller/pacienteController';
import { authenticate } from './config/loginService';
import MedicoController from './controller/medicoController';
import multerConfig from './config/multer';
import multer from 'multer';
const upload = multer(multerConfig);

//Instancia dos Controller

//Body-parser para adicionar e obter dados a partir das rotas
import bodyParser from "body-parser";
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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
    resp.render('Site/cadastroPaciente',{certo:req.flash('certo'),errado:req.flash('errado')})
})

// Home page do Sistema
Route.get('/', (req:Request, resp: Response)=>{
    resp.render('Site/index')
})

Route.get('/logout', (req:Request, resp: Response)=>{
    req.session = undefined
    resp.redirect('/login')
})

//LOGIN GERAL DO SISTEMA
Route.post('/loginGeral',urlencodedParser, (req:Request, resp: Response)=>{ 
    try {
        const {user, pass}= req.body;
        authenticate(user, pass).then(r=>{
            if(r==='-1'){

                resp.redirect('/')
                
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