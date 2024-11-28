import cp from 'crypto-js'

const encrypt = valor => {
  return cp.AES.encrypt(valor.toString(), process.env.JWT_SECRET).toString()
}

const decrypt = valor => {
  if (!valor) return ''
  const bytes = cp.AES.decrypt(valor.toString('base64'), process.env.JWT_SECRET)
  return bytes.toString(cp.enc.Utf8)
}

export {
  encrypt,
  decrypt
}
