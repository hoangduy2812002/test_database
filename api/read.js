import { list } from "@vercel/blob";

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


        const result = await list();


        const blob = result.blobs.find(
            item => item.pathname === name
        );


        if (!blob) {

            return res.status(404).json({
                success: false,
                message: "Không tìm thấy file"
            });

        }


        const response = await fetch(
            blob.downloadUrl
        );


        if (!response.ok) {

            throw new Error(
                `Không thể đọc Blob: ${response.status}`
            );

        }


        const data =
            await response.json();


        return res.status(200).json({
            success: true,
            data
        });


    } catch (error) {

        console.error("READ ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}