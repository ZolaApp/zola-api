export const up = async knex => {
  await knex.schema.createTable('users', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table.string('email').notNull()
  })
}

export const down = async knex => {
  await knex.schema.dropTableIfExists('users')
}
