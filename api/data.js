import { put, list } from "@vercel/blob";

const FILE_NAME = "wedding-messages.json";


// ========================================
// LẤY DATA HIỆN TẠI
// ========================================

async function getCurrentData() {

    const result = await list({
        prefix: FILE_NAME,
        storeId: process.env.BLOB_STORE_ID
    });

    if (!result.blobs.length) {
        return [];
    }

    const blob = result.blobs.find(
        item => item.pathname === FILE_NAME
    );

    if (!blob) {
        return [];
    }

    // Private blob cần được đọc bằng authenticated
    // Blob SDK/API, không fetch blob.url trực tiếp.
}



// ========================================
// API
// ========================================

export default async function handler(req, res) {

    try {

        // ================================
        // GET
        // ================================

        if (req.method === "GET") {

            const data =
                await getCurrentData();


            return res.status(200).json({

                success: true,

                data

            });

        }



        // ================================
        // PUT
        // ================================

        if (req.method === "PUT") {

            const data =
                req.body;


            if (!Array.isArray(data)) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Data phải là array"

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

                    access:
                        "public",

                    contentType:
                        "application/json",

                    addRandomSuffix:
                        false,

                    allowOverwrite:
                        true,

                    storeId:
                        process.env.BLOB_STORE_ID

                }

            );


            return res.status(200).json({

                success: true,

                data,

                url: blob.url

            });

        }



        return res.status(405).json({

            success: false,

            message:
                "Method không được hỗ trợ"

        });


    } catch (error) {

        console.error(
            "BLOB ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}