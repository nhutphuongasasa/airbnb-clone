import { PrismaClient } from "@prisma/client";
//Prisma client giup tuong tac voi database thong qua orm
declare global {
  var prisma: PrismaClient | undefined;
}
//neu chua co instance thi se tao bien moi
const client = globalThis.prisma || new PrismaClient();
// chi gan lai trong moi truong phat trien
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
