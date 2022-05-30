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
import {pacienteAuth} from './middlewre/paciente' //Aluno
import {adminAuth} from './middlewre/admin'






//Rotas Gerais do Sistema
//Login principal
Route.get('/login', (req:Request, resp: Response)=>{
    resp.render('login')
})

//Cadastrar principal
Route.get('/cadastrar', (req:Request, resp: Response)=>{
    resp.render('cadastrar')
})

// Home page do Sistema
Route.get('/', (req:Request, resp: Response)=>{
    resp.render('home')
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
                resp.send('Não existe uma conta')
            }else{
                const dados=r;
                if(dados){
                     if(dados.p === 'paciente'){ 
                        const pc = dados
                        if(req.session){
                          req.session.paciente=pc;
                          resp.redirect('/paciente')
                          //console.log(paciente)
                          //resp.json(req.session.paciente)
                        }      
                     }else if(dados.p === 'admin'){
                        const adminDados = dados
                        if(req.session){
                          req.session.admin=adminDados;
                          
                          
                          resp.redirect('/admin')
                          //console.log(admin)
                          //resp.json(req.session.admin)
                        } 
                     }/*else if(dados.p==='aluno'){
                        const aluno= dados
                        if(req.session){
                          req.session.aluno=aluno;
                          resp.redirect('/aluno')
                        } 
                    }*/
                }
            }
        })   
    } catch (error) {
        console.log(error)
    }
})

export default Route;