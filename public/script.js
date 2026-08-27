// ========================================
// DOM
// ========================================

const nameInput =
    document.getElementById(
        "name"
    );


const messageInput =
    document.getElementById(
        "message"
    );


const saveButton =
    document.getElementById(
        "saveButton"
    );


const cancelButton =
    document.getElementById(
        "cancelButton"
    );


const reloadButton =
    document.getElementById(
        "reloadButton"
    );


const formTitle =
    document.getElementById(
        "formTitle"
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
// BIẾN SỬA
// ========================================

// null = đang thêm
// messages/xxx.json = đang sửa

let editingId = null;


// ========================================
// HIỂN THỊ STATUS
// ========================================

function showStatus(
    text
) {

    statusElement.style.display =
        "block";

    statusElement.textContent =
        text;

}


// ========================================
// TẢI DANH SÁCH
// ========================================

async function loadMessages() {

    try {

        listElement.innerHTML =
            "Đang tải...";


        const response =
            await fetch(
                "/api/data"
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Không thể tải dữ liệu"
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


        listElement.innerHTML =
            "";


        // ------------------------------
        // Hiển thị từng lời chúc
        // ------------------------------

        data.forEach(
            item => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "item";


                // =========================
                // NAME
                // =========================

                const name =
                    document.createElement(
                        "div"
                    );


                name.className =
                    "name";


                name.textContent =
                    item.name;


                // =========================
                // MESSAGE
                // =========================

                const message =
                    document.createElement(
                        "div"
                    );


                message.className =
                    "message";


                message.textContent =
                    item.message;


                // =========================
                // DATE
                // =========================

                const date =
                    document.createElement(
                        "div"
                    );


                date.className =
                    "date";


                if (
                    item.createdAt
                ) {

                    date.textContent =
                        new Date(
                            item.createdAt
                        ).toLocaleString(
                            "vi-VN"
                        );

                }


                // =========================
                // EDIT
                // =========================

                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.className =
                    "edit-button";


                editButton.textContent =
                    "Sửa";


                editButton.addEventListener(
                    "click",
                    () => {

                        startEdit(
                            item
                        );

                    }
                );


                // =========================
                // DELETE
                // =========================

                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.className =
                    "delete-button";


                deleteButton.textContent =
                    "Xóa";


                deleteButton.addEventListener(
                    "click",
                    () => {

                        deleteMessage(
                            item.id
                        );

                    }
                );


                // =========================
                // APPEND
                // =========================

                element.appendChild(
                    name
                );


                element.appendChild(
                    message
                );


                element.appendChild(
                    date
                );


                element.appendChild(
                    editButton
                );


                element.appendChild(
                    deleteButton
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


        listElement.innerHTML =
            "";


        const errorElement =
            document.createElement(
                "div"
            );


        errorElement.className =
            "empty";


        errorElement.textContent =
            "Lỗi: " +
            error.message;


        listElement.appendChild(
            errorElement
        );

    }

}


// ========================================
// BẮT ĐẦU SỬA
// ========================================

function startEdit(
    item
) {

    // Lưu ID Blob

    editingId =
        item.id;


    // Đưa dữ liệu lên form

    nameInput.value =
        item.name;


    messageInput.value =
        item.message;


    // Đổi giao diện

    formTitle.textContent =
        "Sửa lời chúc";


    saveButton.textContent =
        "Lưu thay đổi";


    cancelButton.style.display =
        "inline-block";


    statusElement.style.display =
        "none";


    // Cuộn lên form

    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });


    nameInput.focus();

}


// ========================================
// HỦY SỬA
// ========================================

function cancelEdit() {

    editingId =
        null;


    nameInput.value =
        "";


    messageInput.value =
        "";


    formTitle.textContent =
        "Thêm lời chúc";


    saveButton.textContent =
        "Thêm lời chúc";


    cancelButton.style.display =
        "none";


    statusElement.style.display =
        "none";

}


// ========================================
// LƯU
// ========================================

async function saveMessage() {

    const name =
        nameInput.value.trim();


    const message =
        messageInput.value.trim();


    // ------------------------------
    // Kiểm tra tên
    // ------------------------------

    if (!name) {

        alert(
            "Vui lòng nhập tên"
        );

        nameInput.focus();

        return;

    }


    // ------------------------------
    // Kiểm tra message
    // ------------------------------

    if (!message) {

        alert(
            "Vui lòng nhập lời chúc"
        );

        messageInput.focus();

        return;

    }


    try {

        saveButton.disabled =
            true;


        // =================================
        // SỬA
        // =================================

        if (editingId) {

            saveButton.textContent =
                "Đang lưu...";


            const response =
                await fetch(
                    "/api/data",
                    {

                        method:
                            "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                id:
                                    editingId,

                                name:
                                    name,

                                message:
                                    message

                            })

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Không thể sửa"
                );

            }


            alert(
                "Sửa thành công!"
            );


            cancelEdit();


            await loadMessages();


            return;

        }


        // =================================
        // THÊM
        // =================================

        saveButton.textContent =
            "Đang thêm...";


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


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Không thể thêm"
            );

        }


        // Xóa form

        nameInput.value =
            "";


        messageInput.value =
            "";


        showStatus(
            "Thêm thành công!"
        );


        // Tải lại danh sách

        await loadMessages();


    } catch (error) {

        console.error(
            "SAVE ERROR:",
            error
        );


        showStatus(
            "Lỗi: " +
            error.message
        );


    } finally {

        saveButton.disabled =
            false;


        if (editingId) {

            saveButton.textContent =
                "Lưu thay đổi";

        } else {

            saveButton.textContent =
                "Thêm lời chúc";

        }

    }

}


// ========================================
// XÓA
// ========================================

async function deleteMessage(
    id
) {

    const confirmed =
        confirm(
            "Bạn có chắc muốn xóa lời chúc này?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/data",
                {

                    method:
                        "DELETE",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            id:
                                id

                        })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Không thể xóa"
            );

        }


        alert(
            "Xóa thành công!"
        );


        // Nếu đang sửa item vừa xóa

        if (
            editingId === id
        ) {

            cancelEdit();

        }


        // Tải lại

        await loadMessages();


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        alert(
            "Lỗi: " +
            error.message
        );

    }

}


// ========================================
// EVENT
// ========================================

saveButton.addEventListener(
    "click",
    saveMessage
);


cancelButton.addEventListener(
    "click",
    cancelEdit
);


reloadButton.addEventListener(
    "click",
    loadMessages
);


// ========================================
// LOAD KHI MỞ TRANG
// ========================================

loadMessages();