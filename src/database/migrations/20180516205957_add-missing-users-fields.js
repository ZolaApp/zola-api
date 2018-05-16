export const up = async knex => {
  await knex.schema.table('users', table => {
    table.dropColumn('name')
    table.string('firstName', 30).notNull()
    table.string('lastName', 30).notNull()
    table.string('job', 50).notNull()
  })
}

export const down = async knex => {
  await knex.schema.table('users', table => {
    table.dropColumn('firstName')
    table.dropColumn('lastName')
    table.string('name', 30).notNull()
  })
}
