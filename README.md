# standard-crypto

Easily encrypt and decrypt messages. All the complexity is hidden behind the scenes.

## Usage

```typescript
import {encrypt, decrypt, generateEncryptionKey} from 'standard-crypto'

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
```

And to turn passwords into encryption keys

```typescript
const password = 'password1'
const hash = await hashPassword(password)

expect(hash.length).toEqual(512)
```
