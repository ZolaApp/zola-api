export const up = async knex => {
  await knex.schema.createTable('tokens', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table
      .string('token')
      .unique()
      .notNull()
    table
      .integer('userId')
      .unsigned()
      .notNull()
      .unique()
    table.foreign('userId').references('users.id')
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updatedAt')
      .notNull()
      .defaultTo(knex.fn.now())
  })
}

export const down = async knex => {
  await knex.schema.dropTableIfExists('tokens')
}
