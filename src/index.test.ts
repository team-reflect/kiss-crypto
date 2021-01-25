import { decrypt, encrypt, generateEncryptionKey, hashPassword } from '.'

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
  const hash = await hashPassword(password)

  expect(hash.length).toEqual(512)
})