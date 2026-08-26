const API =
    "/api/data";



// ========================================
// LẤY DATA
// ========================================

async function getData() {

    const response =
        await fetch(API);


    const result =
        await response.json();


    if (!response.ok ||
        !result.success) {

        throw new Error(
            result.message ||
            "Không thể lấy dữ liệu"
        );

    }


    return result.data;

}



// ========================================
// LƯU DATA
// ========================================

async function saveData(data) {

    const response =
        await fetch(

            API,

            {

                method:
                    "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(data)

            }

        );


    const result =
        await response.json();


    if (!response.ok ||
        !result.success) {

        throw new Error(
            result.message ||
            "Không thể lưu dữ liệu"
        );

    }


    return result;

}



// ========================================
// HIỂN THỊ DANH SÁCH
// ========================================

async function render() {

    const list =
        document.getElementById(
            "list"
        );


    list.innerHTML =
        "<p>Đang tải...</p>";


    try {

        const data =
            await getData();


        list.innerHTML =
            "";


        if (!data.length) {

            list.innerHTML =
                "<p>Chưa có dữ liệu.</p>";

            return;

        }


        data.forEach(
            (item, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "item";


                div.innerHTML = `

                    <div class="date">
                        ${escapeHTML(
                            String(
                                item.date
                            )
                        )}
                    </div>

                    <div class="name">
                        ${escapeHTML(
                            String(
                                item.name
                            )
                        )}
                    </div>

                    <div class="message">
                        ${escapeHTML(
                            String(
                                item.message
                            )
                        )}
                    </div>

                    <button
                        onclick="
                            editMessage(${index})
                        "
                    >
                        Sửa
                    </button>

                    <button
                        onclick="
                            deleteMessage(${index})
                        "
                    >
                        Xóa
                    </button>

                `;


                list.appendChild(div);

            }
        );


    } catch (error) {

        list.innerHTML = `

            <p style="color:red">

                Lỗi:
                ${escapeHTML(
                    error.message
                )}

            </p>

        `;

    }

}



// ========================================
// THÊM
// ========================================

async function addMessage() {

    const nameInput =
        document.getElementById(
            "name"
        );


    const messageInput =
        document.getElementById(
            "message"
        );


    const name =
        nameInput.value.trim();


    const message =
        messageInput.value.trim();


    if (!name ||
        !message) {

        alert(
            "Vui lòng nhập đầy đủ!"
        );

        return;

    }


    try {

        const data =
            await getData();


        const now =
            new Date();


        const item = {

            date:
                now.toLocaleTimeString(
                    "vi-VN"
                )
                +
                " "
                +
                now.toLocaleDateString(
                    "vi-VN"
                ),

            name:
                name,

            message:
                message

        };


        data.unshift(item);


        await saveData(data);


        nameInput.value =
            "";

        messageInput.value =
            "";


        await render();


        alert(
            "Đã thêm thành công!"
        );


    } catch (error) {

        alert(
            "Lỗi: " +
            error.message
        );

    }

}



// ========================================
// SỬA
// ========================================

async function editMessage(index) {

    try {

        const data =
            await getData();


        const item =
            data[index];


        if (!item) {

            return;

        }


        const name =
            prompt(
                "Tên:",
                item.name
            );


        if (name === null) {

            return;

        }


        const message =
            prompt(
                "Lời chúc:",
                item.message
            );


        if (message === null) {

            return;

        }


        data[index] = {

            ...item,

            name:
                name,

            message:
                message

        };


        await saveData(data);


        await render();


        alert(
            "Đã sửa thành công!"
        );


    } catch (error) {

        alert(
            "Lỗi: " +
            error.message
        );

    }

}



// ========================================
// XÓA
// ========================================

async function deleteMessage(index) {

    if (
        !confirm(
            "Bạn có chắc muốn xóa?"
        )
    ) {

        return;

    }


    try {

        const data =
            await getData();


        data.splice(
            index,
            1
        );


        await saveData(data);


        await render();


        alert(
            "Đã xóa thành công!"
        );


    } catch (error) {

        alert(
            "Lỗi: " +
            error.message
        );

    }

}



// ========================================
// CHỐNG HTML INJECTION
// ========================================

function escapeHTML(value) {

    return value

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



// ========================================
// CHẠY
// ========================================

render();