export const up = async knex => {
  await knex.schema.table('users', table => {
    table
      .boolean('isValidated')
      .notNull()
      .defaultTo(false)
  })
}

export const down = async knex => {
  await knex.schema.table('users', table => {
    table.dropColumn('isValidated')
  })
}
