import {
    put,
    list,
    get
} from "@vercel/blob";


// ========================================
// CẤU HÌNH
// ========================================

const DIRECTORY = "messages/";


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
        // LẤY DANH SÁCH
        // =================================

        if (req.method === "GET") {

            const result =
                await list({
                    prefix: DIRECTORY
                });


            const data = [];


            // Đọc từng Blob

            for (
                const blob
                of result.blobs
            ) {

                try {

                    const file =
                        await get(
                            blob.pathname,
                            {
                                access:
                                    "private"
                            }
                        );


                    if (!file) {
                        continue;
                    }


                    const text =
                        await new Response(
                            file.stream
                        ).text();


                    const item =
                        JSON.parse(text);


                    data.push({

                        name:
                            item.name,

                        message:
                            item.message,

                        createdAt:
                            item.createdAt || null

                    });


                } catch (error) {

                    console.error(
                        "READ BLOB ERROR:",
                        blob.pathname,
                        error
                    );

                }

            }


            // Mới nhất trước

            data.reverse();


            return res.status(200).json({

                success: true,

                data:
                    data

            });

        }


        // =================================
        // POST
        // THÊM LỜI CHÚC
        // =================================

        if (req.method === "POST") {

            const {
                name,
                message
            } =
                req.body || {};


            // -----------------------------
            // Kiểm tra name
            // -----------------------------

            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Tên không được để trống"

                });

            }


            // -----------------------------
            // Kiểm tra message
            // -----------------------------

            if (
                typeof message !== "string" ||
                !message.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Lời chúc không được để trống"

                });

            }


            // -----------------------------
            // Tạo ID duy nhất
            // -----------------------------

            const id =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 10)}`;


            const fileName =
                `${DIRECTORY}${id}.json`;


            // -----------------------------
            // Dữ liệu
            // -----------------------------

            const data = {

                name:
                    name.trim(),

                message:
                    message.trim(),

                createdAt:
                    new Date().toISOString()

            };


            // -----------------------------
            // Tạo Blob mới
            // -----------------------------

            const blob =
                await put(

                    fileName,

                    JSON.stringify(
                        data,
                        null,
                        4
                    ),

                    {

                        access:
                            "private",

                        contentType:
                            "application/json"

                    }

                );


            return res.status(201).json({

                success: true,

                message:
                    "Thêm thành công",

                data:
                    data,

                pathname:
                    blob.pathname

            });

        }


        // =================================
        // METHOD KHÔNG HỖ TRỢ
        // =================================

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