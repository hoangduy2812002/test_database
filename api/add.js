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
            data
        } = req.body || {};


        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Thiếu tên file"
            });
        }


        if (data === undefined) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu"
            });
        }


        const blob = await put(
            name,
            JSON.stringify(
                data,
                null,
                2
            ),
            {
                access: "private",
                contentType: "application/json"
            }
        );


        return res.status(200).json({
            success: true,
            message: "Thêm thành công",
            blob
        });


    } catch (error) {

        console.error("ADD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}