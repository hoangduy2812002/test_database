
// ========================================
// CẤU HÌNH API
// ========================================

const API = {
    LIST: "/api/list",
    ADD: "/api/add"
};


// ========================================
// DOM
// ========================================

const nameInput =
    document.getElementById("name");

const messageInput =
    document.getElementById("message");

const addButton =
    document.getElementById("addButton");

const reloadButton =
    document.getElementById("reloadButton");

const statusElement =
    document.getElementById("status");

const listElement =
    document.getElementById("list");


// ========================================
// HIỂN THỊ THÔNG BÁO
// ========================================

function showStatus(message) {

    statusElement.style.display = "block";

    statusElement.textContent = message;
}


// ========================================
// THÊM LỜI CHÚC
// ========================================

async function addMessage() {

    const name =
        nameInput.value.trim();

    const message =
        messageInput.value.trim();


    // Kiểm tra tên

    if (!name) {

        alert("Vui lòng nhập tên");

        nameInput.focus();

        return;
    }


    // Kiểm tra lời chúc

    if (!message) {

        alert("Vui lòng nhập lời chúc");

        messageInput.focus();

        return;
    }


    try {

        // Khóa nút

        addButton.disabled = true;

        addButton.textContent =
            "Đang thêm...";


        showStatus(
            "Đang lưu dữ liệu..."
        );


        const response =
            await fetch(
                API.ADD,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        message: message

                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Không thể thêm dữ liệu"
            );
        }


        // Thành công

        showStatus(
            "Thêm lời chúc thành công!"
        );


        // Xóa form

        nameInput.value = "";

        messageInput.value = "";


        // Load lại danh sách

        await loadMessages();


    } catch (error) {

        console.error(error);


        showStatus(
            "Lỗi: " +
            error.message
        );


    } finally {

        addButton.disabled = false;

        addButton.textContent =
            "Thêm lời chúc";
    }
}


// ========================================
// LẤY DANH SÁCH
// ========================================

async function loadMessages() {

    listElement.innerHTML =
        "Đang tải...";


    try {

        const response =
            await fetch(
                API.LIST
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Không thể lấy danh sách"
            );
        }


        const blobs =
            result.blobs || [];


        // Không có dữ liệu

        if (blobs.length === 0) {

            listElement.innerHTML = `
                <div class="empty">
                    Chưa có lời chúc nào.
                </div>
            `;

            return;
        }


        listElement.innerHTML = "";


        // Đọc từng Blob

        for (const blob of blobs) {

            try {

                const data =
                    await readBlob(
                        blob.pathname
                    );


                createMessageElement(
                    data
                );


            } catch (error) {

                console.error(
                    "Không thể đọc:",
                    blob.pathname,
                    error
                );

            }

        }


        // Nếu không đọc được dữ liệu

        if (!listElement.children.length) {

            listElement.innerHTML = `
                <div class="empty">
                    Không thể đọc dữ liệu.
                </div>
            `;
        }


    } catch (error) {

        console.error(error);


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
// ĐỌC MỘT BLOB
// ========================================

async function readBlob(name) {

    const response =
        await fetch(
            "/api/read?name=" +
            encodeURIComponent(name)
        );


    const result =
        await response.json();


    if (!response.ok) {

        throw new Error(
            result.message ||
            "Không thể đọc Blob"
        );
    }


    return result.data;
}


// ========================================
// TẠO ELEMENT HIỂN THỊ
// ========================================

function createMessageElement(data) {

    const item =
        document.createElement("div");


    item.className =
        "item";


    const name =
        document.createElement("div");

    name.className =
        "name";


    name.textContent =
        data.name || "";


    const message =
        document.createElement("div");

    message.className =
        "message";


    message.textContent =
        data.message || "";


    item.appendChild(name);

    item.appendChild(message);


    listElement.appendChild(item);
}


// ========================================
// CHỐNG HTML INJECTION
// ========================================

function escapeHtml(value) {

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
