const form = document.getElementById("form")

const formTitle = document.getElementById("title")
const formAuth = document.getElementById("author")
const formPages = document.getElementById("pages")
const formRead = document.getElementById("read")
const lib = document.getElementById("books")
const submit = document.getElementById("submit")

const localStorageAvaialble = storageAvailable("localStorage")

let library = [];

if(localStorageAvaialble) {
    if(localStorage.getItem("library")) {
        let tempLib = JSON.parse(localStorage.getItem("library"))
        tempLib.forEach(element => {
            addToLibrary(element.title, element.author, element.pages, element.read)
        })
    }
}

function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read

    this.info = function() {
        return this.title + "\t\t" + this.author + "\t\t" + this.pages
    }
}

Book.prototype.toggleRead = function() {
    this.read = !this.read
}

function addToLibrary(title, author, pages, read) {
    let toAdd = new Book(title, author, pages, read)
    library.push(toAdd)

    let row = document.createElement("tr")
    row.setAttribute("data-index", library.length-1)
    row.setAttribute("class", "book")

    row.appendChild(createRowElem(title))
    row.appendChild(createRowElem(author))
    row.appendChild(createRowElem(pages))

    let readElem = createRowElem("")
    row.appendChild(readElem)

    let button = document.createElement("input")
    button.setAttribute("type", "button")
    
    button.setAttribute("value", toAdd.read ? "Read" : "Not read")
    
    button.addEventListener("click", () => {
        library[parseInt(row.getAttribute("data-index"))].toggleRead()
        button.setAttribute("value", toAdd.read ? "Read" : "Not read")
    })

    readElem.appendChild(button)

    let removeElem = createRowElem("")
    row.appendChild(removeElem)

    let removeButton = document.createElement("input")
    removeButton.setAttribute("type", "button")
    removeButton.setAttribute("value", "Remove this book")

    removeButton.addEventListener("click", () => {
        //take book out of library array
        library.splice(parseInt(row.getAttribute("data-index")), 1)
        //take book out of table
        lib.removeChild(row)
        //fix data-index attribute
        let bookEntries = lib.getElementsByClassName("book")

        for(let i = 0; i < bookEntries.length; i++) {
            bookEntries[i].setAttribute("data-index", i)
        }
    })

    //figure out how to pass the id of the button's parent to the function
    
    removeElem.appendChild(removeButton)
    lib.appendChild(row)

    populateStorage()
}

function createRowElem(text) {
    let toRet = document.createElement("td")
    toRet.textContent = text
    return toRet
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function populateStorage() {
    localStorage.setItem("library", JSON.stringify(library))
}

document.getElementById("newbook").addEventListener("click", function() {
    form.style.display = "block"
})

formRead.addEventListener("click", function() {
    readButton = document.getElementById("read")
    if(readButton.value == "Not Yet!") {
    readButton.value = "Yes!" 
    } else {
    readButton.value = "Not Yet!"
    }
})

submit.addEventListener("click", function() {
    let hasRead = formRead.value == "Yes!";
    addToLibrary(formTitle.value, formAuth.value, formPages.value, hasRead)
    form.style.display = "none"
})