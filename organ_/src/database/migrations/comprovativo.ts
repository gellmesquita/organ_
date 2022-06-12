import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('comprovativo', (table)=>{
        table.increments('idComprovativo').primary();
        table.timestamp('dataPagamanto').defaultTo(knex.fn.now());
        table.string('arquivo').notNullable();
        table.integer('idMarcacao').notNullable().references('idMarcacao').inTable('marcacao');
      
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('comprovativo')
}

//dataMarcacao, estadoMarcacao, mes, dia, ano, diaExtenso, idPaciente,idMedico