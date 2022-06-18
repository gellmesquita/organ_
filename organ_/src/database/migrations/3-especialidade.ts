import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('especialidade', (table)=>{
        table.increments('idEspecialidade').primary();
        table.string('nomeEspecialidade').notNullable();
        table.string('precoEspecialidade').notNullable();
        table.string('descEspecialidade').defaultTo("Descrição");
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('especialidade')
}

//nome, idProfessor, data-inicio, data-fim, image, desc, estado