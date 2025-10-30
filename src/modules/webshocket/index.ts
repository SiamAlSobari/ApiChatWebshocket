import Elysia, { t } from "elysia";
import { SECRET_KEY } from "../../utils/constant/secret";
import jwt from "@elysiajs/jwt";

export const webshocketController = new Elysia({ prefix: "/ws" })
    .use(
        jwt({
            secret: SECRET_KEY,
            name: "jwt",
        })
    )
    .ws("/connect", {
        query: t.Object({
            userId: t.String(),
        }),
        // ❌ Jangan pakai body di sini biar fleksibel
        open(ws) {
            const { userId } = ws.data.query;
            console.log("✅ Client connected:", userId);
        },
        message(ws, raw) {
            try {
                const { userId } = ws.data.query;

                // Deteksi otomatis apakah raw sudah object atau masih string
                const data = typeof raw === "string" ? JSON.parse(raw) : raw;

                console.log(`📩 Pesan dari ${userId}:`, data);

                // kirim balik ke pengirim (echo)
                ws.send(
                    JSON.stringify({
                        from: userId,
                        message: data.text,
                        roomId: data.roomId,
                        type: data.type,
                    })
                );
            } catch (err) {
                console.error("❌ Error parsing message:", err);
            }
        },

        close(ws) {
            const { userId } = ws.data.query;
            console.log(`❌ Client disconnected: ${userId}`);
        },
    });
