export const up = async knex => {
  await knex.schema.table('users', table => {
    table.renameColumn('name', 'firstName')
    table.string('lastName', 30).notNull()
    table.string('job', 50).notNull()
  })
}

export const down = async knex => {
  await knex.schema.table('users', table => {
    table.renameColumn('firstName', 'name')
    table.dropColumn('lastName')
    table.dropColumn('job')
  })
}
