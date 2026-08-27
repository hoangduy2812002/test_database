import { get } from "@vercel/blob";

export default async function handler(req, res) {

    try {

        if (req.method !== "GET") {

            return res.status(405).json({
                success: false,
                message: "Method không được hỗ trợ"
            });

        }


        const name = req.query.name;


        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Thiếu tên file"
            });

        }


        // Đọc Blob Private
        const result = await get(name, {
            access: "private"
        });


        if (!result) {

            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Blob"
            });

        }


        // Đọc nội dung Blob
        const text =
            await new Response(
                result.stream
            ).text();


        // Chuyển JSON thành object
        const data =
            JSON.parse(text);


        return res.status(200).json({

            success: true,

            data: data

        });


    } catch (error) {

        console.error(
            "READ ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
}