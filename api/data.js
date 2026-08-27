import {
    get,
    put
} from "@vercel/blob";


// ========================================
// TÊN FILE DUY NHẤT TRONG BLOB
// ========================================

const FILE_NAME = "messages.json";


// ========================================
// ĐỌC FILE messages.json
// ========================================

async function getData() {

    try {

        const result =
            await get(
                FILE_NAME,
                {
                    access: "private"
                }
            );


        if (!result) {

            return [];

        }


        const text =
            await new Response(
                result.stream
            ).text();


        if (!text) {

            return [];

        }


        const data =
            JSON.parse(text);


        if (!Array.isArray(data)) {

            return [];

        }


        return data;


    } catch (error) {

        /*
         * Nếu messages.json chưa tồn tại
         * thì coi như database đang rỗng.
         */

        console.log(
            "Chưa có messages.json"
        );


        return [];

    }

}


// ========================================
// GHI LẠI FILE messages.json
// ========================================

async function saveData(data) {

    const result =
        await put(

            FILE_NAME,

            JSON.stringify(
                data,
                null,
                4
            ),

            {
                access: "private",

                contentType:
                    "application/json"
            }

        );


    return result;

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

                success: true,

                data: data

            });

        }


        // =================================
        // POST
        // =================================

        if (req.method === "POST") {

            const {
                name,
                message
            } = req.body || {};


            // -----------------------------
            // Kiểm tra dữ liệu
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
            // Đọc dữ liệu cũ
            // -----------------------------

            const data =
                await getData();


            // -----------------------------
            // Thêm dữ liệu mới
            // -----------------------------

            const newData = {

                name:
                    name.trim(),

                message:
                    message.trim()

            };


            data.push(
                newData
            );


            // -----------------------------
            // Lưu lại Blob
            // -----------------------------

            await saveData(
                data
            );


            // -----------------------------
            // Trả kết quả
            // -----------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Thêm thành công",

                data:
                    newData,

                total:
                    data.length

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
            "API ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}