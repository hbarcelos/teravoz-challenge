export function randomTimeout(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function delay(timeout, fn, ...args) {
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      resolve(fn(...args))
    }, timeout)
  })
}
