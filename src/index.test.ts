import { decrypt, encrypt, generateEncryptionKey, generateSalt, hashPassword } from '.'

it('encrypts/decrypts', async function () {
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

it('hashes a password', async function () {
  const password = 'password1'
  const salt = await generateSalt()
  const hash1 = await hashPassword({password, salt})

  expect(hash1.length).toEqual(512)

  const hash2 = await hashPassword({password, salt})
  expect(hash1).toEqual(hash2)
})