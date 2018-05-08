import validateString from './index'

describe('The `validateString` helper', () => {
  it('should be possible to change the string type in the error message using the `type` parameter', () => {
    const actualFoo = validateString({ type: 'FOO' })('A')
    const expectedFoo = {
      isValid: false,
      error: 'Your FOO is too short. It should be between 2 and 30 characters.'
    }
    const actualBar = validateString({ type: 'BAR' })('A')
    const expectedBar = {
      isValid: false,
      error: 'Your BAR is too short. It should be between 2 and 30 characters.'
    }

    expect(actualFoo).toEqual(expectedFoo)
    expect(actualBar).toEqual(expectedBar)
  })

  it('should, by default, return an object with an `isValid` key set to `false` and an error when the string is shorter than 2 characters', () => {
    const actual = validateString({ type: 'string' })('A')
    const expected = {
      isValid: false,
      error:
        'Your string is too short. It should be between 2 and 30 characters.'
    }

    expect(actual).toEqual(expected)
  })

  it('should be possible to override the `minLength` parameter', () => {
    const actual = validateString({ type: 'string', minLength: 3 })('Fo')
    const expected = {
      isValid: false,
      error:
        'Your string is too short. It should be between 3 and 30 characters.'
    }

    expect(actual).toEqual(expected)
  })

  it('should, by default, return an object with an `isValid` key set to `false` and an error when the string is longer than 30 characters', () => {
    const actual = validateString({ type: 'string' })('A'.repeat(31))
    const expected = {
      isValid: false,
      error:
        'Your string is too long. It should be between 2 and 30 characters.'
    }

    expect(actual).toEqual(expected)
  })

  it('should be possible to override the `maxLength` parameter', () => {
    const actual = validateString({ type: 'string', maxLength: 3 })('Foo Bar')
    const expected = {
      isValid: false,
      error: 'Your string is too long. It should be between 2 and 3 characters.'
    }

    expect(actual).toEqual(expected)
  })

  it('should return an object with an `isValid` key set to `true` and an and an empty string as error when the string is valid', () => {
    const actual = validateString({ type: 'string' })('Foo Bar')
    const expected = {
      isValid: true,
      error: ''
    }

    expect(actual).toEqual(expected)
  })
})
