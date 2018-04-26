import { APP_HREF } from '@constants/api'
import database from '@database/index'
import redis from '@server/redis'
import validateEmail from './index'

const responseMock = {
  redirect: () => jest.fn()
}

describe('The `validateEmail` route', () => {
  beforeAll(async done => {
    await database.migrate.latest()
    done()
  })

  beforeEach(async done => {
    await database.seed.run()
    await redis.set('user:emailValidationToken:DUMMY_VALIDATION_TOKEN', 1)
    done()
  })

  it('should redirect to the `/validate-email` page if the token doesn’t exist', async done => {
    const redirectSpy = jest.spyOn(responseMock, 'redirect')
    await validateEmail(
      { params: { emailValidationToken: 'FOO_BAR' } },
      responseMock
    )

    expect(redirectSpy).toHaveBeenCalledWith(`${APP_HREF}/validate-email`)
    done()
  })

  it('should redirect to the `/email-validated` page if the token exists', async done => {
    const redirectSpy = jest.spyOn(responseMock, 'redirect')
    await validateEmail(
      { params: { emailValidationToken: 'DUMMY_VALIDATION_TOKEN' } },
      responseMock
    )

    expect(redirectSpy).toHaveBeenCalledWith(`${APP_HREF}/email-validated`)
    done()
  })

  it('should delete the token from redis if the token exists', async done => {
    const emailValidationToken = 'DUMMY_VALIDATION_TOKEN'
    const tokenOwnerPreValidation = await redis.get(
      `user:emailValidationToken:${emailValidationToken}`
    )

    await validateEmail({ params: { emailValidationToken } }, responseMock)

    const tokenOwnerPostValidation = await redis.get(
      `user:emailValidationToken:${emailValidationToken}`
    )

    expect(tokenOwnerPreValidation).toEqual('1')
    expect(tokenOwnerPostValidation).toEqual(null)
    done()
  })

  it('should toggle the associated user’s `isActivated` property to `true` in the database if the token exists', async done => {
    const userPreValidation = await database('users').where({ id: 1 })

    await validateEmail(
      { params: { emailValidationToken: 'DUMMY_VALIDATION_TOKEN' } },
      responseMock
    )

    const userPostValidation = await database('users').where({ id: 1 })

    expect(userPreValidation[0].isValidated).toEqual(false)
    expect(userPostValidation[0].isValidated).toEqual(true)
    done()
  })
})
