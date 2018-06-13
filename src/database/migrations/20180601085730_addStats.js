export const up = async knex => {
  await knex.schema.alterTable('translationKeys', t => {
    t.boolean('isNew')
      .notNullable()
      .defaultTo(false)
  })
}

export const down = async knex => {
  await knex.schema.alterTable('translationKeys', t => {
    t.dropColumn('isNew')
  })
}
