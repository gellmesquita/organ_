//import jwt  from 'jsonwebtoken';
import knex from '../database/conection';


async function authenticate(user:string, pass:string) {
    try {
        const pDados =await knex('paciente').where('userPaciente', user).where('senhaPaciente', pass)
        if(pDados.length!==0){
            const pc = pDados[0]
            return {pc, p:'paciente'}
        }else if(pDados.length===0){
            const admin= await knex('medicos').where('userAdmin', user).where('senhaAdmin',pass)
            if(admin.length!==0){
                const admn= admin[0];
                if (admn.tipoAdmin==1) {
                    const ADMINadmn = {admn, p:'admin'}
                    
                    
                    return ADMINadmn
                }
            }else{ 
                return '-1'  
            }
        }else{
            return '-1'
        }
    } catch (error) {
        console.log(error)
    }

}

export {authenticate};
