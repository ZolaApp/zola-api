export const up = async knex => {
  await knex.schema.createTable('locales', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table.string('name', 50).notNull()
    table
      .string('code')
      .unique()
      .notNull()
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updatedAt')
      .notNull()
      .defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('projects_locales', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table.foreign('projectId').references('projects.id')
    table.foreign('localeId').references('locales.id')
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table.unique(['projectId', 'localeId'])
  })
}

export const down = async knex => {
  await knex.schema.dropTableIfExists('tokens')
}
