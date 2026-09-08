import dotenv from "dotenv"

dotenv.config()

if (!process.env.MONGO_URI) {
  throw new Error("MONTO_URI doesn't exists in the enviroment variable ")
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET doesn't exists in the enviroment variable")
}


if (!process.env.EMAIL_USER) {
  throw new Error("EMAIL_USER doesn't exists in the enviroment variable")
}


if (!process.env.EMAIL_PASS) {
  throw new Error("EMAIL_PASS doesn't exists in the enviroment variable")
}

const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
}

export default config

