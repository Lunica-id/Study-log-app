document.addEventListener("DOMContentLoaded", () => {
    const genreList = document.getElementById("genre-list");
    const addGridBtn = document.getElementById("add-grid");
    const addItemBtn = document.getElementById("add-item");
    const genreDetailList = document.getElementById("genre-detail");
    const closeDetailBtn = document.getElementById("close-detail-btn");
    const editGenreModal = document.getElementById("edit-genre-modal");
    const genreCancelBtn = document.getElementById("genre-cancel-btn");
    const editDetailModal = document.getElementById("edit-detail-modal");

    addGridBtn.addEventListener ("click", () => {
        editGenreModal.classList.remove("hidden");
    });
    addItemBtn.addEventListener("click", () => {
        editDetailModal.classList.remove("hidden");
    });
    genreCancelBtn.addEventListener("click", () => {
        editGenreModal.classList.add("hidden");
    })




})
