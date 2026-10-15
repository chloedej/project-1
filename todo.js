const notes = [
    {
        id: 1,
        title: "Size Chart",
        description: "Media planning balances the strategic planning process. The questionnaire is more relevant than ever.",
        category: "Work",
        date: new Date(),
        archived: false,
        trashed: false
    },
    {
        id: 2,
        title: "Garden Plants",
        description: "Media planning balances the strategic planning process. This questionnaire is more relevant than ever. The niche design ...",
        category: "Personal",
        date: new Date(),
        archived: false,
        trashed: false
    },
    {
        id: 3,
        title: "Send a mail to PM",
        description: "Marketing activity determines the media business. Based on the structure of Maslow's pyramid, the organization of marketing service attracts ...",
        category: "Work",
        date: new Date(),
        archived: false,
        trashed: false
    },
    {
        id: 4,
        title: "Buy Harry Potter Book",
        description: "Remember to purchase the next book on the reading list.",
        category: "Family",
        date: new Date(),
        archived: false,
        trashed: false
    },
    {
        id: 5,
        title: "Meet at the airport",
        description: "Remember to leave early and check the flight details.",
        category: "Family",
        date: new Date(),
        archived: false,
        trashed: false
    },
    {
        id: 6,
        title: "Meeting Point",
        description: "Media planning balances the strategic planning process. The questionnaire is more relevant than ever. The niche design ...",
        category: "Work",
        date: new Date(),
        archived: false,
        trashed: false
    }
];

const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

const addNoteButton = document.getElementById("addNoteButton");
const noteDialog = document.getElementById("noteDialog");
const noteForm = document.getElementById("noteForm");

const noteTitle = document.getElementById("noteTitle");
const noteDescription = document.getElementById("noteDescription");
const noteCategory = document.getElementById("noteCategory");

const cancelButton = document.getElementById("cancelButton");
const sortButton = document.getElementById("sortButton");
const filterButton = document.getElementById("filterButton");

let selectedCategory = "All";
let currentPage = "Notes";
let newestFirst = true;
let editingId = null;

// Display notes on the page
function renderNotes() {
    const searchText = searchInput.value.toLowerCase();
}
    let filteredNotes = notes.filter(function(note) {
        const matchesSearch =
            note.title.toLowerCase().includes(searchText) ||
            note.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            note.category === selectedCategory;

        let matchesPage = true;

        if (currentPage === "Archived") {
            matchesPage = note.archived && !note.trashed;
        } else if (currentPage === "Trash") {
            matchesPage = note.trashed;
        } else {
            matchesPage = !note.archived && !note.trashed;
        }

        return matchesSearch && matchesCategory && matchesPage;
    });

    // Sort notes by date
    filteredNotes.sort(function(a, b) {
        return newestFirst
            ? b.date - a.date
            : a.date - b.date;
    });

    // Clear the old cards before displaying new ones
    notesGrid.innerHTML = "";

    // Create one card for every matching note
    filteredNotes.forEach(function(note) {
        const card = document.createElement("article");
        card.className = "note-card";

        const title = document.createElement("h2");
        title.textContent = note.title;

        const description = document.createElement("p");
        description.textContent = note.description;

        const meta = document.createElement("div");
        meta.className = "note-meta";

        const categoryLabel = document.createElement("span");
        categoryLabel.className = note.category.toLowerCase();
        categoryLabel.textContent = note.category;

        const dateLabel = document.createElement("span");
        dateLabel.textContent =
            " · " + note.date.toLocaleDateString();

        meta.append(categoryLabel, dateLabel);
        card.append(title, description, meta);
    });

