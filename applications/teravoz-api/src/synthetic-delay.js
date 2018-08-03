export function randomTimeout(max = 10000) {
  return Math.floor(Math.random() * (max + 1))
}

export function delay(timeout, fn, ...args) {
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      resolve(fn(...args))
    }, timeout)
  })
}
