import localesJson from './data/locales.json'

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
    table
      .integer('projectId')
      .unsigned()
      .references('id')
      .inTable('projects')
    table
      .integer('localeId')
      .unsigned()
      .references('id')
      .inTable('locales')
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table.unique(['projectId', 'localeId'])
  })

  const localesToSave = Object.entries(localesJson).map(([key, value]) => ({
    code: key,
    name: value
  }))

  await knex('locales').insert(localesToSave)
}

export const down = async knex => {
  await knex.schema.dropTableIfExists('locales')
  await knex.schema.dropTableIfExists('projects_locales')
}
