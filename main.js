const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
}

function findBook(IdBook) {
    for (ItemBook of books) {
        if (ItemBook.id === IdBook) {
            return ItemBook;
        }
    }
    return null;
}

function findBookIndex(IdBook) {
    for (const index in books) {
        if (books[index].id === IdBook) {
            return index;
        }
    }

    return -1;
}

function makeBook(bookObject) {
    const { id, title, author, year, isComplete } = bookObject;

    const JudulBuku = document.createElement("h3");
    JudulBuku.innerText = bookObject.title;

    const PenulisBuku = document.createElement("p");
    PenulisBuku.innerText = "Penulis: " + bookObject.author;

    const TahunTerbit = document.createElement("p");
    TahunTerbit.innerText = "Tahun: " + bookObject.year;

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(JudulBuku, PenulisBuku, TahunTerbit);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("green");
        undoButton.textContent = "Belum selesai dibaca";

        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.textContent = "Hapus buku";

        trashButton.addEventListener("click", function () {
            const konfirmasiDialog = confirm("Anda yakin menghapus buku ini dari Bookshelf Apps?");
            if (konfirmasiDialog) {
                removeBookFromCompleted(bookObject.id);
            }
        });

        const containerButton = document.createElement("div");
        containerButton.classList.add("action");
        containerButton.append(undoButton, trashButton);
        container.append(containerButton);
    } else {
        const undoButton = document.createElement("button");
        undoButton.classList.add("green");
        undoButton.textContent = "Selesai dibaca";

        undoButton.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.textContent = "Hapus buku";

        trashButton.addEventListener("click", function () {
            const konfirmasiDialog = confirm("Anda yakin menghapus buku ini dari Bookshelf Apps?");
            if (konfirmasiDialog) {
                removeBookFromUncompleted(bookObject.id);
            }
        });

        const containerButton = document.createElement("div");
        containerButton.classList.add("action");
        containerButton.append(undoButton, trashButton);
        container.append(containerButton);
    }

    return container;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() /* boolean */ {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
    const namaBuku = document.getElementById("inputBookTitle").value;
    const namaPenulis = document.getElementById("inputBookAuthor").value;
    const tahunTerbit = document.getElementById("inputBookYear").value;
    const selesaiDibaca = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, namaBuku, namaPenulis, tahunTerbit, selesaiDibaca);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(IdBook) {
    const BookTarget = findBook(IdBook);

    if (BookTarget == null) return;

    BookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(IdBook) {
    const BookTarget = findBookIndex(IdBook);

    if (BookTarget === -1) return;

    books.splice(BookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromUncompleted(IdBook) {
    const BookTarget = findBookIndex(IdBook);

    if (BookTarget === -1) return;

    books.splice(BookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(IdBook) {
    const BookTarget = findBook(IdBook);
    if (BookTarget == null) return;

    BookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";
    const listCompleted = document.getElementById("completeBookshelfList");
    listCompleted.innerHTML = "";

    for (const ItemBook of books) {
        const bookElement = makeBook(ItemBook);
        if (!ItemBook.isComplete) {
            uncompletedBookList.append(bookElement);
        } else {
            listCompleted.append(bookElement);
        }
    }
});
