import { basic } from '@ocavue/eslint-config'

export default [
  ...basic(),
  {
    ignores: ['eslint.config.js', 'vite.config.ts'],
  },
]
