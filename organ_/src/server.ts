import express from "express";
import route from './Routes'
import cors from 'cors';
import path from 'path';
import bodyParser from "body-parser";
import flash from 'express-flash'
import session from 'express-session'
import MarcacaoController from './controller/marcacaoController';
import PacienteController from './controller/pacienteController';
import MedicoController from './controller/medicoController';
import RelatorioController from './controller/relatorioController';
import EspecialidadeController from './controller/especialidadeController';
import knex from './database/conection';
import cron  from 'node-cron'


const app= express();
app.use(flash())

app.use(session({
    secret:'ineforLearning',
    cookie:{maxAge: 3000000000}
}))

app.use('/upload', express.static(path.resolve(__dirname, '..','upload')) );
app.use(express.static(path.resolve(__dirname, '..','public')))
app.set('view engine', 'ejs')
app.use(cors());


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(route);
app.use(PacienteController);
app.use(MedicoController);
app.use(MarcacaoController);
app.use(EspecialidadeController);
app.use(RelatorioController);

app.use(async(req,res, next)=>{ 
    const esp=await knex('especialidade').limit(3)
    res.render("Site/404", {esp})
}) 



app.listen(1001, () => {
    cron.schedule('* * * * * *', () => {
        console.log('running a task every minute');
      });
    console.log('Created');
})