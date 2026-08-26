import {
    put,
    list,
    get
} from "@vercel/blob";


const FILE_NAME =
    "wedding-messages.json";


const STORE_ID =
    process.env.BLOB_STORE_ID;



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


    const result =
        await list({

            prefix:
                FILE_NAME,

            storeId:
                STORE_ID

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


    /*
     * Private Blob:
     * Không fetch file.downloadUrl
     * trực tiếp.
     */

    const result =
        await get(

            FILE_NAME,

            {

                access:
                    "private",

                storeId:
                    STORE_ID

            }

        );


    if (!result) {

        return [];

    }


    const text =
        await result.stream
            .getReader();


    const decoder =
        new TextDecoder();


    let content = "";


    while (true) {

        const {
            done,
            value
        } =
            await text.read();


        if (done) {

            break;

        }


        content +=
            decoder.decode(
                value,
                {
                    stream:
                        true
                }
            );

    }


    content +=
        decoder.decode();


    const data =
        JSON.parse(content);


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

}



// ========================================
// API
// ========================================

export default async function handler(
    req,
    res
) {

    try {


        // =================================
        // GET
        // =================================

        if (req.method === "GET") {

            const data =
                await getData();


            return res.status(200).json({

                success:
                    true,

                data

            });

        }



        // =================================
        // PUT
        // =================================

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