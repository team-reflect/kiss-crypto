import {utf8ToBytes} from '@noble/hashes/utils'
import {
  decrypt,
  decryptBlob,
  encrypt,
  encryptBlob,
  generateEncryptionKey,
  generateSalt,
  hash,
  hashPassword,
} from '.'

import {arrayBufferToString} from './utils'

it('encrypts/decrypts plaintext', function () {
  const key = generateEncryptionKey()

  const plaintext = 'hello world'

  const ciphertext = encrypt({
    plaintext,
    key,
  })

  const decrypted = decrypt({
    ciphertext,
    key,
  })

  expect(decrypted).toEqual(plaintext)
})

it('encrypts/decrypts blobs', function () {
  const key = generateEncryptionKey()

  const plaintext = 'hello world'

  const plainblob = utf8ToBytes(plaintext)

  const cipherblob = encryptBlob({
    plainblob,
    key,
  })

  const decrypted = decryptBlob({
    cipherblob,
    key,
  })

  expect(arrayBufferToString(decrypted!)).toEqual(plaintext)
})

it('hashes a password', async function () {
  const password = 'password1'
  const salt = generateSalt()
  const hash1 = await hashPassword({password, salt})

  expect(hash1.length).toEqual(64)

  const hash2 = await hashPassword({password, salt})
  expect(hash1).toEqual(hash2)
})

it('sanity checks password hashes', async function () {
  const password = 'password1'
  const salt = 'cfebdb6da2d9167786c83cce87963692'
  const hash1 = await hashPassword({password, salt})

  expect(hash1).toMatchInlineSnapshot(
    '"29057df69d9940bab07be1afb4c9f1867addff3f092591f23b50152b63bcdf86"',
  )
})

it('hashes a key', function () {
  const key = 'key1'
  const salt = generateSalt()
  const hash1 = hash({key, salt})

  const hash2 = hash({key, salt})
  expect(hash1).toEqual(hash2)
})

it('sanity checks hashes', function () {
  const key = 'key1'
  const salt = '04450d2470c9d3e63259da24f4cddb7e'
  const hash1 = hash({key, salt})

  expect(hash1).toMatchInlineSnapshot(
    '"c61ba75858ee4507e940d18a00d05d655919e1d71b6166e5e86c405828cda2de"',
  )
})

it('encrypts with hashed password', async function () {
  const password = 'password1'
  const salt = generateSalt()
  const key = await hashPassword({password, salt})

  const plaintext = 'hello world'

  const ciphertext = encrypt({
    plaintext,
    key,
  })

  const decrypted = decrypt({
    ciphertext,
    key,
  })

  expect(decrypted).toEqual(plaintext)
})

it('sanity checks v001 ciphertext', function () {
  const plaintext = 'hello world'
  const ciphertext =
    '001:a1caba8a0ff627c4f85d1134a8b69b7e4ede04c0a11c0fe6:6DIAXgI6sFceb8UZWDY7HYcRQ44opn3LTmQo'
  const key = '513fe9f410236db712a710ae8ab13bd94178fe645f3525756ebf92232a7906cf'

  const decrypted = decrypt({
    ciphertext,
    key,
  })

  expect(decrypted).toEqual(plaintext)
})
