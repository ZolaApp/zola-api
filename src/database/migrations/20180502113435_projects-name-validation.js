export const up = async knex => {
  await knex.schema.table('projects', table => {
    table
      .integer('ownerId')
      .unsigned()
      .references('id')
      .inTable('users')
    table.dropUnique('slug')
    table.unique(['slug', 'ownerId'])
  })
}

export const down = async knex => {
  await knex.schema.table('projects', table => {
    table.dropUnique(['slug', 'ownerId'])
    table.dropColumn('ownerId')
    table.unique('slug')
  })
}
