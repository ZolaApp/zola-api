import database from '@server/database'

// Recursively rollback migrations until there is none left
const resetDatabase = async () => {
  try {
    await database.migrate.forceFreeMigrationsLock()
    const currentVersion = await database.migrate.currentVersion()

    if (currentVersion !== 'none') {
      await database.migrate.rollback()
      await resetDatabase()
    }
  } catch (error) {
    console.warn('Database resetting failed.', error)
  }
}

export default resetDatabase
