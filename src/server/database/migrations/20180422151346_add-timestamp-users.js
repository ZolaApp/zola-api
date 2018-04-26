export const up = async knex => {
  await knex.schema.table('users', table => {
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table.timestamp('updatedAt').nullable()
  })
}

export const down = async knex => {
  await knex.schema.table('users', table => {
    table.dropColumn('createdAt')
    table.dropColumn('updatedAt')
  })
}
