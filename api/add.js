import { put } from "@vercel/blob";

export default async function handler(req, res) {

    try {

        if (req.method !== "POST") {

            return res.status(405).json({
                success: false,
                message: "Method không được hỗ trợ"
            });

        }


        const {
            name,
            message
        } = req.body || {};


        if (!name || !message) {

            return res.status(400).json({
                success: false,
                message: "Thiếu name hoặc message"
            });

        }


        /*
         * Tạo tên file duy nhất
         *
         * Ví dụ:
         * messages/1723456789012-abc123.json
         */

        const fileName =
            `messages/${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}.json`;


        const data = {

            name: name,

            message: message

        };


        const blob =
            await put(
                fileName,

                JSON.stringify(
                    data,
                    null,
                    2
                ),

                {
                    access: "private",

                    contentType:
                        "application/json"
                }
            );


        return res.status(200).json({

            success: true,

            data: data,

            blob: blob

        });


    } catch (error) {

        console.error(
            "ADD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }
}