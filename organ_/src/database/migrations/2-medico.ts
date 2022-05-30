import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('medico', (table)=>{
        table.increments('idMedico').primary();
        table.string('nomeMedico').notNullable();
        table.timestamp('dataMedico').defaultTo(knex.fn.now())
        table.string('userMedico').notNullable();
        table.string('emailMedico').notNullable();
        table.string('tellMedico').notNullable();
        table.string('passMedico').notNullable();
        table.integer('role').notNullable();
        
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('medico')
}

//nome, nomeMedico, userMedico, emailMedico, tellMedico, passMedico