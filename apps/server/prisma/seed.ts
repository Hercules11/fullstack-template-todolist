import { PrismaClient } from "generated/prisma";
import { guid } from '@todo-monorepo/shared';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    const todo1 = await prisma.todo.create({
        data: {
            id: guid(),
            title: "Learn Prisma",
            description: "Learn how to use Prisma with NestJS",
            completed: false,
            isPending: false,
        },
    })
    const todo2 = await prisma.todo.create({
        data: {
            id: guid(),
            title: "Learn React",
            description: "Learn how to use React with NestJS",
            completed: false,
            isPending: false,
        }
    })

    console.log({ todo1, todo2 });
}






// excute the seed function
main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})