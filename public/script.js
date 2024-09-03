const apiKey = "115cbf624d524785d7fbf9d81cde845d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const ipApiUrl = "https://api.ipify.org?format=json";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const historyList = document.getElementById("history-list");
const historySection = document.querySelector(".history");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");


async function getUserIp() {
    try {
        const response = await fetch(ipApiUrl);
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Failed to get IP address:", error);
        return null;
    }
}


function getLocalHistory() {
    const history = localStorage.getItem('weatherHistory');
    return history ? JSON.parse(history) : [];
}

function saveLocalHistory(history) {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
}

function updateHistory() {
    const history = getLocalHistory();
    historyList.innerHTML = "";
    history.forEach((city) => {
        const li = document.createElement("li");
        li.textContent = city;
        li.addEventListener("click", () => {
            searchBox.value = city;
            checkWeather(city);
        });
        historyList.appendChild(li);
    });
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
        errorSection.style.display = "block";
        weatherSection.style.display = "none";
        historySection.style.display = "block";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main === "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main === "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main === "Mist") {
            weatherIcon.src = "images/mist.png";
        }

        weatherSection.style.display = "block";
        errorSection.style.display = "none";
        historySection.style.display = "none";

        const history = getLocalHistory();
        if (!history.includes(city)) {
            history.push(city);
            saveLocalHistory(history);
        }
        updateHistory();
    }
}

searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    checkWeather(city);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const city = searchBox.value;
        checkWeather(city);
    }
});

updateHistory();
