document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("data")
    const date = localStorage.getItem("date")
    const input_value = localStorage.getItem("inputValue")
    if (data && date && input_value) {
        updateData(JSON.parse(data))
        setDate(date)
        document.getElementById("date-input").value = input_value
    } else {
        loadData(new Date(Date.now()))
        setDate(Date.now())
        document.getElementById("date-input").valueAsNumber = Date.now()
        localStorage.setItem("inputValue", document.getElementById("date-input").value)
    }
})

document.getElementById("search-form").addEventListener("submit", () => {
    document.getElementById("content-loader").style.display = "flex"
    document.getElementById("content").style.display = "none"
    document.getElementById("content-error").style.display = "none"
    const date = new Date(document.getElementById("date-input").value)
    loadData(date)
    setDate(date)
})

document.getElementById("date-input").addEventListener("change", (e) => {
    localStorage.setItem("inputValue", e.target.value)
})

const updateData = (data) => {
    let elem
    if (data.code == 400) {
        document.getElementById("content-loader").style.display = "none"
        document.getElementById("content-error").style.display = "flex"
    } else {
        switch (data.media_type) {
            case "image":
                elem = document.getElementById("img-of-day")
                document.getElementById("img-of-day__video").classList.remove("active")
                elem.attributes.src.value = data.url
                elem.classList.add("active")
                break;
            case "video":
                elem = document.getElementById("img-of-day__video")
                document.getElementById("img-of-day").classList.remove("active")
                elem.attributes.src.value = data.url
                elem.classList.add("active")
                break;
        }
        document.getElementById("img-of-day__title").innerText = data.title
        document.getElementById("img-of-day__description").innerText = data.explanation
        document.getElementById("content-loader").style.display = "none"
        document.getElementById("content").style.display = "flex"
    }
}

const loadData = (date) => {
    window.addEventListener("offline", offlineHandler)
    document.getElementById("content-connection-error").style.display = "none"
    const strDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    fetch(`https://api.nasa.gov/planetary/apod?api_key=AxeblXxeEPDiaf1VFgWtGAyTx2CqWgxB39nO9uVe&date=${strDate}`)
        .then((response) => {
            window.removeEventListener("offline", offlineHandler)
            return response.json()
        })
        .catch(() => {
            offlineHandler()
        })
        .then((data) => {
            if (data) {
                localStorage.setItem("data", JSON.stringify(data))
                localStorage.setItem("date", strDate)
                updateData(data)
            }
        })
}

const setDate = (date) => {
    const d = new Date(date)
    document.getElementById("date").innerHTML = "Picture of <br>" + d.toLocaleString("ru", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
    })
}

const offlineHandler = () => {
    document.getElementById("content-loader").style.display = "none"
    document.getElementById("content-connection-error").style.display = "flex"
}