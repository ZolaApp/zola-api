export const up = async knex => {
  await knex.schema.createTable('projectsUsers', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
    table
      .integer('projectId')
      .unsigned()
      .references('id')
      .inTable('projects')
    table.string('role', 30).notNull()
  })
}

export const down = async knex => {
  await knex.schema.dropTableIfExists('projectsUsers')
}
