import {
    put,
    list,
    get,
    del
} from "@vercel/blob";


// ========================================
// CẤU HÌNH
// ========================================

const DIRECTORY = "messages/";


// ========================================
// ĐỌC MỘT BLOB
// ========================================

async function readBlob(pathname) {

    const result = await get(
        pathname,
        {
            access: "private"
        }
    );


    if (!result) {
        return null;
    }


    const text =
        await new Response(
            result.stream
        ).text();


    return JSON.parse(text);
}


// ========================================
// LẤY DANH SÁCH
// ========================================

async function getMessages() {

    const result = await list({

        prefix:
            DIRECTORY

    });


    const data = [];


    for (
        const blob
        of result.blobs
    ) {

        try {

            const item =
                await readBlob(
                    blob.pathname
                );


            if (!item) {
                continue;
            }


            data.push({

                // Đây chính là ID
                // dùng để sửa và xóa
                id:
                    blob.pathname,

                name:
                    item.name,

                message:
                    item.message,

                createdAt:
                    item.createdAt || null

            });


        } catch (error) {

            console.error(
                "READ ERROR:",
                blob.pathname,
                error
            );

        }

    }


    // Mới nhất lên đầu

    data.reverse();


    return data;
}


// ========================================
// THÊM
// ========================================

async function addMessage(
    name,
    message
) {

    // Tạo tên file duy nhất

    const id =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;


    const pathname =
        `${DIRECTORY}${id}.json`;


    // Dữ liệu lưu

    const data = {

        name:
            name.trim(),

        message:
            message.trim(),

        createdAt:
            new Date().toISOString()

    };


    // Tạo Blob mới

    const blob =
        await put(

            pathname,

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


    return {

        id:
            blob.pathname,

        ...data

    };
}


// ========================================
// SỬA
// ========================================

async function updateMessage(
    id,
    name,
    message
) {

    // ------------------------------------
    // Kiểm tra ID
    // ------------------------------------

    if (
        typeof id !== "string" ||
        !id.startsWith(DIRECTORY) ||
        !id.endsWith(".json")
    ) {

        throw new Error(
            "ID không hợp lệ"
        );

    }


    // ------------------------------------
    // Đọc Blob cũ
    // ------------------------------------

    const oldData =
        await readBlob(id);


    if (!oldData) {

        throw new Error(
            "Không tìm thấy dữ liệu"
        );

    }


    // ------------------------------------
    // Tạo dữ liệu mới
    // ------------------------------------

    const newData = {

        name:
            name.trim(),

        message:
            message.trim(),

        // Giữ ngày tạo ban đầu
        createdAt:
            oldData.createdAt ||
            new Date().toISOString()

    };


    // ------------------------------------
    // Ghi đè Blob cũ
    // ------------------------------------

    await put(

        id,

        JSON.stringify(
            newData,
            null,
            4
        ),

        {

            access:
                "private",

            contentType:
                "application/json",

            allowOverwrite:
                true

        }

    );


    return {

        id:
            id,

        ...newData

    };
}


// ========================================
// XÓA
// ========================================

async function deleteMessage(id) {

    // ------------------------------------
    // Kiểm tra ID
    // ------------------------------------

    if (
        typeof id !== "string" ||
        !id.startsWith(DIRECTORY) ||
        !id.endsWith(".json")
    ) {

        throw new Error(
            "ID không hợp lệ"
        );

    }


    // ------------------------------------
    // Xóa Blob
    // ------------------------------------

    await del(id);

}


// ========================================
// API HANDLER
// ========================================

export default async function handler(
    req,
    res
) {

    try {

        // =================================
        // GET
        // =================================

        if (
            req.method === "GET"
        ) {

            const data =
                await getMessages();


            return res.status(200).json({

                success:
                    true,

                data:
                    data

            });

        }


        // =================================
        // POST
        // =================================

        if (
            req.method === "POST"
        ) {

            const {
                name,
                message
            } =
                req.body || {};


            // Kiểm tra tên

            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Tên không được để trống"

                });

            }


            // Kiểm tra lời chúc

            if (
                typeof message !== "string" ||
                !message.trim()
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Lời chúc không được để trống"

                });

            }


            const data =
                await addMessage(
                    name,
                    message
                );


            return res.status(201).json({

                success:
                    true,

                message:
                    "Thêm thành công",

                data:
                    data

            });

        }


        // =================================
        // PUT
        // =================================

        if (
            req.method === "PUT"
        ) {

            const {
                id,
                name,
                message
            } =
                req.body || {};


            // Kiểm tra ID

            if (
                typeof id !== "string"
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Thiếu ID"

                });

            }


            // Kiểm tra tên

            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Tên không được để trống"

                });

            }


            // Kiểm tra lời chúc

            if (
                typeof message !== "string" ||
                !message.trim()
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Lời chúc không được để trống"

                });

            }


            const data =
                await updateMessage(

                    id,

                    name,

                    message

                );


            return res.status(200).json({

                success:
                    true,

                message:
                    "Sửa thành công",

                data:
                    data

            });

        }


        // =================================
        // DELETE
        // =================================

        if (
            req.method === "DELETE"
        ) {

            const {
                id
            } =
                req.body || {};


            if (
                typeof id !== "string"
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Thiếu ID"

                });

            }


            await deleteMessage(id);


            return res.status(200).json({

                success:
                    true,

                message:
                    "Xóa thành công"

            });

        }


        // =================================
        // METHOD KHÔNG HỖ TRỢ
        // =================================

        return res.status(405).json({

            success:
                false,

            message:
                "Method không được hỗ trợ"

        });


    } catch (error) {

        console.error(
            "API ERROR:",
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