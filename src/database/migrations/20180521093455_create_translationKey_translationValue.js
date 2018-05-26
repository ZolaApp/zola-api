export const up = async knex => {
  await knex.schema.createTable('translationKeys', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table.string('key', 255).notNull()
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updatedAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .integer('projectId')
      .unsigned()
      .references('id')
      .inTable('projects')
    table.unique(['key', 'projectId'])
  })

  await knex.schema.createTable('translationValues', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
    table.text('value')
    table
      .timestamp('createdAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updatedAt')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .integer('localeId')
      .unsigned()
      .references('id')
      .inTable('locales')
    table
      .integer('translationKeyId')
      .unsigned()
      .references('id')
      .inTable('translationKeys')
    table.unique(['translationKeyId', 'localeId'])
  })
}

export const down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('translationKeys')
  await knex.schema.dropTableIfExists('translationValues')
}
