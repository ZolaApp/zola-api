// @flow
import path from 'path'
import { Model } from 'objection'
import Project from '@models/Project'

class Locale extends Model {
  static tableName = 'locales'
  static idColumn = 'id'
  static relationMappings = {
    movies: {
      relation: Model.ManyToManyRelation,
      modelClass: path.resolve(__dirname, '../Project'),
      join: {
        from: 'locales.id',
        through: {
          // persons_movies is the join table.
          from: 'project_locale.locale_id',
          to: 'project_locale.project_id'
        },
        to: 'projects.id'
      }
    }
  }

  id: string
  updatedAt: Date
  createdAt: Date
  code: string
  name: string
  projects: Array<Project>

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Locale
