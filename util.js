const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const toHashCode = (url, num) => {
  let hash = num;
  for (let i = 0; i < url.length; i++) {
    let ch = url.charCodeAt(i)
    hash += (hash << 5) + ch;
  }
  return hash & 0x7FFFFFFF;
}

const to62HEX = (hash) => {
  hash = Math.abs(hash)

  let hex = ''
  while (hash >= 62 - 1) {
    hex = str.charAt(hash % 62) + hex
    hash = hash / 62
  }
  return str.charAt(hash) + hex
}

module.exports = {
  toHashCode,
  to62HEX
}
