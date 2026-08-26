import { put, list } from "@vercel/blob";

const FILE_NAME = "wedding-messages.json";


// ========================================
// LẤY FILE JSON HIỆN TẠI
// ========================================

async function getCurrentData() {

    const result = await list({
        prefix: FILE_NAME,
        limit: 1
    });


    if (!result.blobs.length) {

        return {
            data: [],
            url: null
        };

    }


    const blob = result.blobs[0];


    const response = await fetch(blob.url);


    if (!response.ok) {

        throw new Error(
            "Không thể đọc dữ liệu từ Blob"
        );

    }


    const data = await response.json();


    return {
        data,
        url: blob.url
    };

}



// ========================================
// API
// ========================================

export default async function handler(req, res) {

    try {

        // =================================
        // GET
        // Xem danh sách
        // =================================

        if (req.method === "GET") {

            const result = await getCurrentData();


            return res.status(200).json({
                success: true,
                data: result.data
            });

        }



        // =================================
        // PUT
        // Ghi đè toàn bộ dữ liệu
        // =================================

        if (req.method === "PUT") {

            const data = req.body;


            if (!Array.isArray(data)) {

                return res.status(400).json({
                    success: false,
                    message: "Data phải là một array"
                });

            }


            const blob = await put(

                FILE_NAME,

                JSON.stringify(
                    data,
                    null,
                    2
                ),

                {
                    access: "public",

                    contentType:
                        "application/json",

                    addRandomSuffix: false,

                    allowOverwrite: true
                }

            );


            return res.status(200).json({

                success: true,

                message:
                    "Đã ghi đè dữ liệu",

                url: blob.url,

                data

            });

        }



        // =================================
        // Method không hỗ trợ
        // =================================

        return res.status(405).json({

            success: false,

            message:
                "Method không được hỗ trợ"

        });


    } catch (error) {

        console.error(error);


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}