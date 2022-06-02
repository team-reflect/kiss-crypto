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

it('sanity checks v001 ciphertext', async function () {
  const plaintext = 'hello world'
  const ciphertext =
    '001:a1caba8a0ff627c4f85d1134a8b69b7e4ede04c0a11c0fe6:6DIAXgI6sFceb8UZWDY7HYcRQ44opn3LTmQo'
  const key = '513fe9f410236db712a710ae8ab13bd94178fe645f3525756ebf92232a7906cf'

  const decrypted = await decrypt({
    ciphertext,
    key,
  })

  expect(decrypted).toEqual(plaintext)
})
