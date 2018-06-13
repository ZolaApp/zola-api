export const up = async knex => {
  await knex.schema.createTable('users', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table
      .string('email')
      .unique()
      .notNull()
    table.string('name', 30).notNull()
    table.string('passwordHash').notNull()
  })
}

export const down = async knex => {
  await knex.schema.dropTableIfExists('users')
}
