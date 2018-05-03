export const up = async knex => {
  await knex.schema.createTable('projects', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table.string('name', 50).notNull()
    table
      .string('slug')
      .unique()
      .notNull()
    table.string('description').notNull()
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table.timestamp('updatedAt').nullable()
  })
}

export const down = async knex => {
  await knex.schema.dropTableIfExists('projects')
}
