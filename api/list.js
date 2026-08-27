import { list } from "@vercel/blob";

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({
                success: false,
                message: "Method không được hỗ trợ"
            });
        }

        const result = await list();

        return res.status(200).json({
            success: true,
            blobs: result.blobs
        });

    } catch (error) {

        console.error("LIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}