import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('marcacao', (table)=>{
        table.increments('idMarcacao').primary();
        table.timestamp('dataMarcacao').defaultTo(knex.fn.now());
        table.string('estadoMarcacao').notNullable();
        table.string('mes').notNullable();
        table.string('dia').notNullable();
        table.string('ano').notNullable();
        table.string('hora').notNullable();
        table.string('diaExtenso').notNullable();
        table.integer('idPaciente').notNullable().references('idPaciente').inTable('paciente');
        table.integer('idMedico').notNullable().references('idMedico').inTable('medico');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('marcacao')
}

//dataMarcacao, estadoMarcacao, mes, dia, ano, diaExtenso, idPaciente,idMedico