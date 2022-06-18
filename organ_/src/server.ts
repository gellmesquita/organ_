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
import {addDias, c,day,dataAtual,horatual } from './config/data'

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
    
    res.render("Site/404")
}) 



app.listen(1001, () => {
    
    cron.schedule('* */1440  * * *', async () => {
        const d = await knex('marcacao').where('estadoMarcacao', 4).andWhere('diacron','=',0).delete()
    const mr = await knex('marcacao').where('estadoMarcacao', 4).andWhere('diacron','>',0).select('*');
    mr.map(async e=>{
        const up = await knex('marcacao').where('idMarcacao',e.idMarcacao).update({diacron:e.diacron-1})
    })
     
        const marcacao = await knex('marcacao').where('dataMarcacao', '<=',dataAtual).andWhere('hora','>',horatual).update({estadoMarcacao:'2'});
      });
    console.log('Created');
})