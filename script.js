const API = "/api/data";



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
// HIỂN THỊ
// ========================================

async function render() {

    const list =
        document.getElementById(
            "list"
        );


    try {

        const data =
            await getData();


        list.innerHTML = "";


        if (data.length === 0) {

            list.innerHTML = `
                <p>
                    Chưa có lời chúc nào.
                </p>
            `;

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
                            String(item.date)
                        )}
                    </div>


                    <div class="name">
                        ${escapeHTML(
                            String(item.name)
                        )}
                    </div>


                    <div class="message">
                        ${escapeHTML(
                            String(item.message)
                        )}
                    </div>


                    <button
                        class="edit"
                        onclick="
                            editMessage(${index})
                        "
                    >
                        Sửa
                    </button>


                    <button
                        class="delete"
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
                "Tên người gửi:",
                item.name
            );


        if (name === null) {

            return;

        }


        const message =
            prompt(
                "Nội dung:",
                item.message
            );


        if (message === null) {

            return;

        }


        data[index].name =
            name;


        data[index].message =
            message;


        await saveData(data);


        await render();


        alert(
            "Đã sửa thành công!"
        );


    } catch (error) {

        alert(
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
            error.message
        );

    }

}



// ========================================
// ESCAPE HTML
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
// CHẠY KHI MỞ WEBSITE
// ========================================

render();