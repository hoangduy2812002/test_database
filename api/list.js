import { list } from "@vercel/blob";

export default async function handler(req, res) {
    try {
        const token = process.env.BLOB_READ_WRITE_TOKEN;

        console.log(
            "BLOB TOKEN:",
            token ? "ĐÃ CÓ TOKEN" : "KHÔNG CÓ TOKEN"
        );

        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Thiếu BLOB_READ_WRITE_TOKEN"
            });
        }

        const result = await list({
            token
        });

        return res.status(200).json({
            success: true,
            blobs: result.blobs
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}