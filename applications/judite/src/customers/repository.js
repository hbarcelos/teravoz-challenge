import { resolve, dirname } from 'path'
import { promisify } from 'util'
import { existsSync, mkdirSync, readFileSync, writeFile } from 'fs'

const storePath = resolve('./data/customers.json')
const storeDir = dirname(storePath)

if (!existsSync(storeDir)) {
  mkdirSync(storeDir)
}

let store
try {
  store = JSON.parse(readFileSync(storePath))
} catch (err) {
  store = {}
}

const writeFileAsync = promisify(writeFile)

function flushToDisk(store) {
  return writeFileAsync(storePath, JSON.stringify(store), {
    encoding: 'utf8'
  })
}

export default {
  async insert({ phoneNumber, ...data }) {
    Object.assign(store, { [phoneNumber]: data })
    await flushToDisk(store)
  },
  async remove(phoneNumber) {
    if (store[phoneNumber]) {
      delete store[phoneNumber]
      await flushToDisk(store)
    }
  },
  async find(phoneNumber) {
    return store[phoneNumber]
  }
}
