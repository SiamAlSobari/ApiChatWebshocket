import { hash } from "bcryptjs";
import { db } from "../src/common/utils/db";

async function main(){
    //seed data user dan profile pertama
    const user1 = await db.user.upsert({
        where: { user_name: "user1" },
        update: {},
        create: {
            user_name: "user1",
            hash_password: await hash("siam123", 10),
            profile: { create: {
                first_name: "user1",
                last_name: "user1",
            } },
        },
    })

    //seed data user dan profile kedua
    const user2 = await db.user.upsert({
        where: { user_name: "user2" },
        update: {},
        create: {
            user_name: "user2",
            hash_password: await hash("siam123", 10),
            profile: { create: { 
                first_name: "user2",
                last_name: "user2",
            } },
        },
    })


    console.log({ user1, user2 });
    console.log("seed data berhasil dijalankan");
}


main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        console.error("seed data gagal dijalankan");
        await db.$disconnect();
        process.exit(1);
    });