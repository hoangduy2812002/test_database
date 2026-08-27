import { list } from "@vercel/blob";

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({
                success: false,
                message: "Method không được hỗ trợ"
            });
        }

        const token = process.env.BLOB_READ_WRITE_TOKEN;

        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Thiếu BLOB_READ_WRITE_TOKEN"
            });
        }

        const result = await list({
            token: token
        });

        return res.status(200).json({
            success: true,
            blobs: result.blobs
        });

    } catch (error) {
        console.error("Blob list error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}