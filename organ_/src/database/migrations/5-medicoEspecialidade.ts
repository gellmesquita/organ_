import { Knex } from "knex";
export async function up(knex: Knex) {
    return knex.schema.createTable('medicoEspecialidade', (table)=>{
        table.increments('id').primary();
        table.integer('idMedico').notNullable().references('idMedico').inTable('medico');
        table.integer('idEspecialidade').notNullable().references('idEspecialidade').inTable('especialidade');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('medicoEspecialidade')
}
