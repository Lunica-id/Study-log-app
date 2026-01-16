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

    loadStorage();
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
        const genre = interestRecord.find(g => g.id === genreId);
        if (!genre) return;

        genreTitle.textContent = genre.name;

        entryList.querySelectorAll(".entry-item:not(#add-item)").forEach(el => el.remove());

        genre.details.forEach(detail => {
            const li = document.createElement("li");
            li.className = "entry-item";

            if(detail.type == "youtube") {
                li.innerHTML = `
                    <iframe 
                        class="entry-thumbnail" 
                        width="368" 
                        height="207" 
                        src="https://www.youtube.com/embed/${detail.source}" 
                        title="YouTube video player" 
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    ></iframe>
                    <div class="entry-info">
                        <a
                            href="https://www.youtube.com/watch?v=${detail.source}"
                            target="_blank"
                            class="entry-title"
                        >${detail.title}</a>
                    </div>
                    <p class="entry-date">${detail.date}</p>
                    <p class="entry-memo">${detail.memo}</p>
                    <div class="entry-ellipsis"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                `;
            } else {
                li.innerHTML = `
                    <div class="favicon">
                        <img src="https://www.google.com/s2/favicons?domain=${detail.source}">
                    </div>
                    <div class="entry-info">
                        <a 
                            href="${detail.source}" 
                            target="_blank" 
                            class="entry-title"
                        >${detail.title}</a>
                    </div>
                    <p class="entry-date">${detail.date}</p>
                    <p class="entry-memo">${detail.memo}</p>
                    <div class="entry-ellipsis"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                `
            }
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
        saveStorage();
        document.getElementById("genre-name").value = "";
        document.getElementById("date").value = "";
        renderGenreList();
    }

    function handleDetailSubmit(e) {
        e.preventDefault();

        const source = document.getElementById("detail-source").value.trim();
        const title = document.getElementById("detail-title").value;
        const date = document.getElementById("detail-date").value || getTodayString();
        const memo = document.getElementById("detail-memo").value;

        if(!source) {
        alert('input Website or Video at least');
        return;
        }

        const genre = interestRecord.find(g => g.id === selectedGenreId);
        if (!genre) return;

        const youtubeId = extractYouTubeId(source);
        const detailData = {
            type: youtubeId ? "youtube" : "link",
            source: youtubeId ?? source,
            title,
            date,
            memo
        };

        if (editingDetailId !== null) {
            const detail = genre.details.find(d => d.id === editingDetailId);
            Object.assign(detail, detailData);
            editingDetailId = null;
        } else {
            genre.details.push({
                id: Date.now(),
                ...detailData
            });
        }
        editDetailModal.classList.add("hidden");
        saveStorage();
        document.getElementById("detail-source").value = "";
        document.getElementById("detail-title").value = "";
        document.getElementById("detail-date").value = "";
        document.getElementById("detail-memo").value = "";
        renderGenreDetail(selectedGenreId);
    }

    function saveStorage() {
        localStorage.setItem("interestRecord", JSON.stringify(interestRecord));
    }

    function loadStorage() {
        const saved = localStorage.getItem("interestRecord");
        if (saved) {
            interestRecord = JSON.parse(saved);
            renderGenreList();
        }
    }

    function getTodayString() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
    }

    function extractYouTubeId (url) {
    const regex = [
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ]

    for (const pattern of regex) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
    }
})
