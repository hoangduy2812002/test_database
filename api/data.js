import { put, list } from "@vercel/blob";

const FILE_NAME = "wedding-messages.json";

const STORE_ID = process.env.BLOB_STORE_ID;


// ========================================
// KIỂM TRA STORE
// ========================================

function checkStore() {

    if (!STORE_ID) {

        throw new Error(
            "BLOB_STORE_ID chưa được cấu hình"
        );

    }

}


// ========================================
// TÌM FILE
// ========================================

async function findFile() {

    checkStore();


    const result = await list({

        prefix: FILE_NAME,

        storeId: STORE_ID

    });


    const blobs =
        result?.blobs || [];


    return blobs.find(
        blob =>
            blob.pathname === FILE_NAME
    );

}


// ========================================
// ĐỌC DATA
// ========================================

async function getData() {

    const file =
        await findFile();


    if (!file) {

        return [];

    }


    const response =
        await fetch(
            file.downloadUrl
        );


    if (!response.ok) {

        throw new Error(
            `Không thể đọc Blob: ${response.status}`
        );

    }


    const data =
        await response.json();


    if (!Array.isArray(data)) {

        throw new Error(
            "Dữ liệu Blob không phải array"
        );

    }


    return data;

}


// ========================================
// GHI DATA
// ========================================

async function saveData(data) {

    checkStore();


    const blob =
        await put(

            FILE_NAME,

            JSON.stringify(
                data,
                null,
                2
            ),

            {

                access:
                    "private",

                contentType:
                    "application/json",

                addRandomSuffix:
                    false,

                allowOverwrite:
                    true,

                storeId:
                    STORE_ID

            }

        );


    return blob;

}


// ========================================
// API
// ========================================

export default async function handler(
    req,
    res
) {

    try {


        // ================================
        // GET
        // ================================

        if (req.method === "GET") {

            const data =
                await getData();


            return res.status(200).json({

                success:
                    true,

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

                    success:
                        false,

                    message:
                        "Data phải là array"

                });

            }


            await saveData(data);


            return res.status(200).json({

                success:
                    true,

                data

            });

        }



        return res.status(405).json({

            success:
                false,

            message:
                "Method không được hỗ trợ"

        });


    } catch (error) {

        console.error(
            "BLOB ERROR:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                error.message

        });

    }

}