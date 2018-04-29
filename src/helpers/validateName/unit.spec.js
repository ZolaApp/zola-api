import validateName from './index'

describe('The `validateName` helper', () => {
  it('should return an object with an `isValid` key set to `false` and an error when the name is shorter than 2 characters', () => {
    const actual = validateName({ name: 'A' })
    const expected = {
      isValid: false,
      error: 'Your name is too short. It should be between 2 and 30 characters.'
    }

    expect(actual).toEqual(expected)
  })

  it('should return an object with an `isValid` key set to `false` and an error when the name is longer than 30 characters', () => {
    const actual = validateName({ name: 'A'.repeat(31) })
    const expected = {
      isValid: false,
      error: 'Your name is too long. It should be between 2 and 30 characters.'
    }

    expect(actual).toEqual(expected)
  })

  it('should return an object with an `isValid` key set to `true` and an and an empty string as error when the name is valid', () => {
    const actual = validateName({ name: 'Foo Bar' })
    const expected = {
      isValid: true,
      error: ''
    }

    expect(actual).toEqual(expected)
  })

  it('should be possible to override the `minLength` parameter', () => {
    const actual = validateName({ name: 'Fo', minLength: 3 })
    const expected = {
      isValid: false,
      error: 'Your name is too short. It should be between 3 and 30 characters.'
    }

    expect(actual).toEqual(expected)
  })

  it('should be possible to override the `maxLength` parameter', () => {
    const actual = validateName({ name: 'Foo Bar', maxLength: 3 })
    const expected = {
      isValid: false,
      error: 'Your name is too long. It should be between 2 and 3 characters.'
    }

    expect(actual).toEqual(expected)
  })
})
