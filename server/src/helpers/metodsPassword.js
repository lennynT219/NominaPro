import bcrypt from 'bcryptjs'

const enryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const passwordEmcrypt = await bcrypt.hash(password, salt)
  return passwordEmcrypt
}

const matchPassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword)
}

export {
  enryptPassword,
  matchPassword
}
