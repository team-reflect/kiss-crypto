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

import {arrayBufferToString, stringToArrayBuffer} from './utils'

it('encrypts/decrypts plaintext', async function () {
  const key = await generateEncryptionKey()

  const plaintext = 'hello world'

  const ciphertext = await encrypt({
    plaintext,
    key,
  })

  const decrypted = await decrypt({
    ciphertext,
    key,
  })

  expect(decrypted).toEqual(plaintext)
})

it('encrypts/decrypts blobs', async function () {
  const key = await generateEncryptionKey()

  const plaintext = 'hello world'

  const plainblob = await stringToArrayBuffer(plaintext)

  const cipherblob = await encryptBlob({
    plainblob,
    key,
  })

  const decrypted = await decryptBlob({
    cipherblob,
    key,
  })

  expect(await arrayBufferToString(decrypted!)).toEqual(plaintext)
})

it('hashes a password', async function () {
  const password = 'password1'
  const salt = await generateSalt()
  const hash1 = await hashPassword({password, salt})

  expect(hash1.length).toEqual(64)

  const hash2 = await hashPassword({password, salt})
  expect(hash1).toEqual(hash2)
})

it('hashes a key', async function () {
  const key = 'key1'
  const salt = await generateSalt()
  const hash1 = await hash({key, salt})

  const hash2 = await hash({key, salt})
  expect(hash1).toEqual(hash2)
})

it('encrypts with hashed password', async function () {
  const password = 'password1'
  const salt = await generateSalt()
  const key = await hashPassword({password, salt})

  const plaintext = 'hello world'

  const ciphertext = await encrypt({
    plaintext,
    key,
  })

  const decrypted = await decrypt({
    ciphertext,
    key,
  })

  expect(decrypted).toEqual(plaintext)
})
