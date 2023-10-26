document.addEventListener("DOMContentLoaded", () => {
  const findResultsButton = document.getElementById("find-results");
  const cityNameInput = document.getElementById("5day");

  findResultsButton.addEventListener("click", () => {
    const cityName = cityNameInput.value;
    // Redirect to the search results page with the city name as a query parameter
    window.location.href = `search-results.html?city=${cityName}`;
  });
});

function fetchWeatherForecast(cityName) {
  const apiKey = '5ecdd58a667d9ab9801a998a6ab6d228';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherForecast(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayWeatherForecast(data) {
  const forecastDataElement = document.getElementById("forecast-data");

  // Extract and display the 5-day forecast data, one box per day
  const forecastList = data.list;
  forecastDataElement.innerHTML = ""; // Clear any previous data

  const days = {}; // Create an object to group forecasts by day

  forecastList.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toDateString(); // Get the day

    // Create a new day if it doesn't exist in the object
    if (!days[day]) {
      days[day] = [];
    }

    // Add this forecast to the day
    days[day].push(forecast);
  });

  // Display the current date in a bigger box above the 5 Day Forecast
  const currentDate = new Date();
  const currentDay = currentDate.toDateString();
  const currentForecast = days[currentDay][0]; // Use the first forecast for the current day

  const currentTemperature = currentForecast.main.temp;
  const currentDescription = currentForecast.weather[0].description;
  const currentWeatherIcon = currentForecast.weather[0].icon;

  const currentForecastBox = document.createElement("div");
  currentForecastBox.classList.add("current-forecast-box");
  currentForecastBox.innerHTML = `
    <div class="current-date">${currentDay}</div>
    <div class="current-icon">
      <img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png" alt="Weather Icon">
    </div>
    <div class="current-temperature">Temperature: ${Math.round(currentTemperature - 273.15)}°C</div>
    <div class="current-description">Description: ${currentDescription}</div>
  `;

  forecastDataElement.appendChild(currentForecastBox);

  // Loop through the days (excluding the current day) and create a box for each day
  for (const day in days) {
    if (Object.hasOwnProperty.call(days, day) && day !== currentDay) {
      const forecastsForDay = days[day];
      const firstForecast = forecastsForDay[0]; // Use the first forecast for the day

      const temperature = firstForecast.main.temp;
      const description = firstForecast.weather[0].description;
      const weatherIcon = firstForecast.weather[0].icon;

      // Create a box for the day with the required information
      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-box");
      forecastItem.innerHTML = `
        <div class="date">${day}</div>
        <div class="icon">
          <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
        </div>
        <div class="temperature">Temperature: ${Math.round(temperature - 273.15)}°C</div>
        <div class="description">Description: ${description}</div>
      `;

      forecastDataElement.appendChild(forecastItem);
    }
  }
}

// Call fetchWeatherForecast with the cityName from the URL
const urlParams = new URLSearchParams(window.location.search);
const cityName = urlParams.get("city");

if (cityName) {
  fetchWeatherForecast(cityName);
}
