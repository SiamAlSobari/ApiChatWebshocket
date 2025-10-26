import { db } from "../src/utils/constant/db";
import { hash } from "bcryptjs";
async function main() {
    const user1 = await db.user.upsert({
        where: { email: "siam@gmail.com" },
        update: {},
        create: {
            email: "siam@gmail.com",
            hashed_password: await hash("siam123", 10),
            profile: {
                create: {
                    full_name: "Siam Al",
                },
            },
        },
    });
    const user2 = await db.user.upsert({
        where: { email: "siam2@gmail.com" },
        update: {},
        create: {
            email: "siam2@gmail.com",
            hashed_password: await hash("siam123", 10),
            profile: {
                create: {
                    full_name: "Siam Al",
                },
            },
        },
    });
    const user3 = await db.user.upsert({
        where: { email: "siam3@gmail.com" },
        update: {},
        create: {
            email: "siam3@gmail.com",
            hashed_password: await hash("siam123", 10),
            profile: {
                create: {
                    full_name: "Siam Al",
                },
            },
        },
    });
    console.log({ user1, user2, user3 });
}

main().then(async () => {
    await db.$disconnect();
}).catch(async (e) => {
    console.error(e);
    console.log("Seeding failed");
    await db.$disconnect();
    process.exit(1);
});
