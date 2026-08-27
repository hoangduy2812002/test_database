// ========================================
// LẤY ELEMENT
// ========================================

const nameInput =
    document.getElementById(
        "name"
    );


const messageInput =
    document.getElementById(
        "message"
    );


const addButton =
    document.getElementById(
        "addButton"
    );


const reloadButton =
    document.getElementById(
        "reloadButton"
    );


const statusElement =
    document.getElementById(
        "status"
    );


const listElement =
    document.getElementById(
        "list"
    );


// ========================================
// HIỂN THỊ STATUS
// ========================================

function showStatus(
    message
) {

    statusElement.style.display =
        "block";

    statusElement.textContent =
        message;

}


// ========================================
// LẤY DANH SÁCH
// ========================================

async function loadMessages() {

    try {

        listElement.innerHTML = `
            <div class="loading">
                Đang tải...
            </div>
        `;


        const response =
            await fetch(
                "/api/data"
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Không thể lấy dữ liệu"
            );

        }


        const data =
            result.data || [];


        // ------------------------------
        // Không có dữ liệu
        // ------------------------------

        if (
            data.length === 0
        ) {

            listElement.innerHTML = `
                <div class="empty">
                    Chưa có lời chúc nào.
                </div>
            `;

            return;

        }


        // ------------------------------
        // Xóa danh sách cũ
        // ------------------------------

        listElement.innerHTML =
            "";


        // ------------------------------
        // Hiển thị dữ liệu
        // ------------------------------

        data.forEach(
            item => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "item";


                const name =
                    document.createElement(
                        "div"
                    );


                name.className =
                    "name";


                name.textContent =
                    item.name;


                const message =
                    document.createElement(
                        "div"
                    );


                message.className =
                    "message";


                message.textContent =
                    item.message;


                element.appendChild(
                    name
                );


                element.appendChild(
                    message
                );


                listElement.appendChild(
                    element
                );

            }
        );


    } catch (error) {

        console.error(
            "LOAD ERROR:",
            error
        );


        listElement.innerHTML = `
            <div class="empty">
                Lỗi:
                ${escapeHtml(
                    error.message
                )}
            </div>
        `;

    }

}


// ========================================
// THÊM LỜI CHÚC
// ========================================

async function addMessage() {

    const name =
        nameInput.value.trim();


    const message =
        messageInput.value.trim();


    // ------------------------------
    // Kiểm tra
    // ------------------------------

    if (!name) {

        alert(
            "Vui lòng nhập tên"
        );

        nameInput.focus();

        return;

    }


    if (!message) {

        alert(
            "Vui lòng nhập lời chúc"
        );

        messageInput.focus();

        return;

    }


    try {

        // ---------------------------
        // Khóa nút
        // ---------------------------

        addButton.disabled =
            true;


        addButton.textContent =
            "Đang lưu...";


        showStatus(
            "Đang lưu dữ liệu..."
        );


        // ---------------------------
        // Gửi API
        // ---------------------------

        const response =
            await fetch(
                "/api/data",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            name:
                                name,

                            message:
                                message

                        })

                }
            );


        const result =
            await response.json();


        // ---------------------------
        // Kiểm tra kết quả
        // ---------------------------

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Không thể thêm dữ liệu"
            );

        }


        // ---------------------------
        // Thành công
        // ---------------------------

        showStatus(
            "Thêm lời chúc thành công!"
        );


        // ---------------------------
        // Xóa form
        // ---------------------------

        nameInput.value =
            "";

        messageInput.value =
            "";


        // ---------------------------
        // Load lại danh sách
        // ---------------------------

        await loadMessages();


    } catch (error) {

        console.error(
            "ADD ERROR:",
            error
        );


        showStatus(
            "Lỗi: " +
            error.message
        );


    } finally {

        addButton.disabled =
            false;


        addButton.textContent =
            "Thêm lời chúc";

    }

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ========================================
// EVENT
// ========================================

addButton.addEventListener(
    "click",
    addMessage
);


reloadButton.addEventListener(
    "click",
    loadMessages
);


// ========================================
// LOAD KHI MỞ TRANG
// ========================================

loadMessages();