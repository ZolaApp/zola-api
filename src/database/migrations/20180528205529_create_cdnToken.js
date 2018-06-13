export const up = async knex => {
  await knex.schema.alterTable('projects', t => {
    t.string('cdnToken', 255)
      .notNull()
      .unique()
  })
}

export const down = async knex => {
  await knex.schema.alterTable('projects', t => {
    t.dropColumn('cdnToken')
  })
}
