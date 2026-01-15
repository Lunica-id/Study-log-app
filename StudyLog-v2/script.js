document.addEventListener("DOMContentLoaded", () => {
    const genreListSection = document.getElementById("genre-list");
    const genreWrapper = genreListSection.querySelector(".wrapper");
    const addGridBtn = document.getElementById("add-grid");
    const addItemBtn = document.getElementById("add-item");
    const detailSection = document.getElementById("genre-detail");
    const genreTitle = detailSection.querySelector(".genre-title");
    const entryList = detailSection.querySelector(".entry-list");
    const closeDetailBtn = document.getElementById("close-detail-btn");
    const editGenreModal = document.getElementById("edit-genre-modal");
    const genreCancelBtn = document.getElementById("genre-cancel-btn");
    const genreSubmitBtn = document.getElementById("genre-submit-btn");
    const editDetailModal = document.getElementById("edit-detail-modal");
    const detailCancelBtn = document.getElementById("detail-cancel-btn");
    const detailSubmitBtn = document.getElementById("detail-submit-btn");

    let interestRecord = [];
    let selectedGenreId = null;
    let editGenreId = null;
    let editingDetailId = null;

    addGridBtn.addEventListener ("click", () => {
        editGenreModal.classList.remove("hidden");
    });
    genreCancelBtn.addEventListener("click", () => {
        editGenreModal.classList.add("hidden");
    });
    genreSubmitBtn.addEventListener("click", handleGenreSubmit);
    closeDetailBtn.addEventListener("click", () => {
        detailSection.classList.add("hidden");
        genreListSection.classList.remove("hidden");
    });
    addItemBtn.addEventListener("click", () => {
        editingDetailId = null;
        editDetailModal.classList.remove("hidden");
    });
    detailCancelBtn.addEventListener("click", () => {
        editDetailModal.classList.add("hidden");
    });
    detailSubmitBtn.addEventListener("click", handleDetailSubmit);


    function renderGenreList() {
        genreWrapper.querySelectorAll(".genre-grid:not(#add-grid)").forEach(el => el.remove());

        interestRecord.forEach(genre => {
            const div = document.createElement("div");
            div.className = "genre-grid sweep-hover";
            div.dataset.genreId = genre.id;

            div.innerHTML = `
                <h3>${genre.name}</h3>
                <p>${genre.date}<p>
            `;

            div.addEventListener("click", () => {
                renderGenreDetail(genre.id);
            });

            genreWrapper.appendChild(div);
        })
    }

    function renderGenreDetail(genreId) {
        selectedGenreId = genreId;
        const genre = genreListSection.find(g => g.id === genreId);
        if (!genre) return;

        genreTitle.textContent = genre.name;

        entryList.querySelectorAll(".entry-item:not(#add-item)").forEach(el => el.remove());

        genre.details.forEach(detail => {
            const li = document.createElement("li");
            li.className = "entry-item";

            li.innerHTML = `
                <div class="entry-info">
                    <a href="${detail.url} target="_blank" class="entry.title"></a>
                </div>
                <p class="entry-date">${detail.date}</p>
                <p class="entry-memo">${detail.memo}</p>
                <div class="entry-ellipsis"><i class="fa-solid fa-ellipsis-vertical"></i></div>
            `;

            entryList.appendChild(li);
        });

        genreListSection.classList.add("hidden");
        detailSection.classList.remove("hidden");
    }

    function handleGenreSubmit (e) {
        e.preventDefault();

        const name = document.getElementById("genre-name").value.trim();
        const date = document.getElementById("date").value || getTodayString();

        if (!name) {
            alert("Please fill in genre name");
            return;
        }

        if (editGenreId !== null) {
            const genre = interestRecord[editGenreId]
            genre.name = name;
            genre.date = date;
            editGenreId = null;
        } else {
            const newGenre = {
                id: Date.now(),
                name,
                date,
                overallMemo: "",
                details: []
            };
            interestRecord.push(newGenre);
        }
        editGenreModal.classList.add("hidden");
        // name = "";
        // date = "";
        renderGenreList();
    }

    function handleDetailSubmit(e) {
        e.preventDefault();


        const url = document.getElementById("detail-url").value.trim();
        const date = document.getElementById("detail-date").value || getTodayString();
        const memo = document.getElementById("detail-memo").value;

        if(!url) {
        alert('input Website or Video at least');
        return;
        }

        const genre = interestRecord.find(g => g.id === selectedGenreId);
        if (!genre) return;
        console.log("handle detail submit");

        if (editingDetailId !== null) {
            const detail = genre.details.find(d => d.id === editingDetailId);
            if (detail) {
                detail.url = url;
                detail.date = date;
                detail.memo = memo;
            }
            editingDetailId = null;
        } else {
            const newDetail = {
                id: Date.now(),
                url,
                date,
                memo
            };
            genre.details.push(newDetail);
        }
        console.log(interestRecord);
        editDetailModal.classList.add("hidden");
        url = "";
        date = "";
        memo = "";
        renderGenreDetail(selectedGenreId);
    }
})

function getTodayString() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
