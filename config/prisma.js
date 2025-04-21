import { PrismaClient } from "../generated/client/index.js"
import bcrypt from "bcrypt"

const base = new PrismaClient()

const prisma = base.$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.password) {
          args.data.password = await bcrypt.hash(args.data.password, 11)
        }

        return query(args)
      },
      async update({ args, query }) {
        if (args.data.password) {
          args.data.password = await bcrypt.hash(args.data.password, 11)
        }

        return query(args)
      },
    },
  },
})

export default prisma
