import { Knex } from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('paciente', (table)=>{
        table.increments('idPaciente').primary();
        table.string('imgPaciente').notNullable();
        table.string('nomePaciente').notNullable();
        table.string('nascimentoPaciente').notNullable();
        table.string('userPaciente').notNullable();
        table.string('emailPaciente').notNullable();
        table.string('tellPaciente').notNullable();
        table.string('generoPaciente').defaultTo("M");
        table.string('enderecoPaciente').defaultTo("Luanda");
        table.string('provinciaPaciente').defaultTo("Provincia");
        table.string('municipioPaciente').defaultTo("Municipio");
        table.string('senhaPaciente').notNullable();
        table.string('estadoPaciente').notNullable();
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('paciente')
}

//idPaciente, imgPaciente, nomePaciente, nascimentoPaciente, userPaciente, emailPaciente,tellPaciente,senhaPaciente,estadoPaciente