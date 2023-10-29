document.addEventListener("DOMContentLoaded", () => {
  const cityNameInput = document.getElementById("5day");

  const previousSearchesElement = document.getElementById("previous-searches");

  const addSearchToPrevious = (search) => {
      let previousSearches = JSON.parse(localStorage.getItem("previous-searches")) || [];

      if (!previousSearches.includes(search)) {
          if (previousSearches.length >= 4) {
              previousSearches.shift();
          }
          previousSearches.push(search);
          localStorage.setItem("previous-searches", JSON.stringify(previousSearches));
      }
  };

  const findResultsButton = document.getElementById("find-results");
  findResultsButton.addEventListener("click", (e) => {
      e.preventDefault(); // This ensures that the form won't try to submit and refresh the page.

      const cityName = cityNameInput.value;
      console.log("Button clicked, attempting to redirect...");
      window.location.href = `search-results.html?city=${cityName}`; // Redirect to the correct page
  });

  function updatePreviousSearchButtons() {
      const previousSearches = JSON.parse(localStorage.getItem("previous-searches")) || [];
      for (let i = previousSearches.length - 1; i >= Math.max(0, previousSearches.length - 4); i--) {
          const search = previousSearches[i];
          const button = document.createElement("button");
          button.classList.add("btn", "custom-btn", "previous-search");
          button.textContent = search;
          button.addEventListener("click", () => {
              cityNameInput.value = search;
              fetchWeatherForecast(search);
          });
          previousSearchesElement.appendChild(button);
      }
  }

  if (previousSearchesElement) {
      updatePreviousSearchButtons();
  }

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
      const forecastList = data.list;
      forecastDataElement.innerHTML = "";
      const days = {};

      forecastList.forEach((forecast) => {
          const date = new Date(forecast.dt * 1000);
          const day = date.toDateString();
          if (!days[day]) {
              days[day] = [];
          }
          days[day].push(forecast);
      });

      const currentDate = new Date();
      const currentDay = currentDate.toDateString();

      if (days[currentDay]) { // Check if data exists for the current day
          const currentForecast = days[currentDay][0];
          const currentTemperature = currentForecast.main.temp;
          const currentDescription = currentForecast.weather[0].description;
          const currentWeatherIcon = currentForecast.weather[0].icon;
          const currentWindSpeed = currentForecast.wind.speed;
          const currentHumidity = currentForecast.main.humidity;

          const currentForecastBox = document.createElement("div");
          currentForecastBox.classList.add("current-forecast-box");
          const todayOrDate = currentDay === new Date().toDateString() ? "Today" : currentDay;
          currentForecastBox.innerHTML = `
              <div class="current-date">${todayOrDate}</div>
              <div class="current-icon">
                  <img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png" alt="Weather Icon">
              </div>
              <div class="current-temperature">Temperature: ${Math.round(currentTemperature - 273.15)}°C</div>
              <div class="current-description">Description: ${currentDescription}</div>
              <div class="current-wind-speed">Wind Speed: ${currentWindSpeed} m/s</div>
              <div class="current-humidity">Humidity: ${currentHumidity}%</div>
          `;
          forecastDataElement.appendChild(currentForecastBox);
      }

      for (const day in days) {
          if (Object.hasOwnProperty.call(days, day) && day !== currentDay) {
              const forecastsForDay = days[day];
              const firstForecast = forecastsForDay[0];
              const temperature = firstForecast.main.temp;
              const description = firstForecast.weather[0].description;
              const weatherIcon = firstForecast.weather[0].icon;
              const windSpeed = firstForecast.wind.speed;
              const humidity = firstForecast.main.humidity;

              const forecastItem = document.createElement("div");
              forecastItem.classList.add("forecast-box");
              forecastItem.innerHTML = `
                  <div class="date">${day}</div>
                  <div class="icon">
                      <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
                  </div>
                  <div class="temperature">Temperature: ${Math.round(temperature - 273.15)}°C</div>
                  <div class="description">Description: ${description}</div>
                  <div class="wind-speed">Wind Speed: ${windSpeed} m/s</div>
                  <div class="humidity">Humidity: ${humidity}%</div>
              `;
              forecastDataElement.appendChild(forecastItem);
          }
      }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const cityName = urlParams.get("city");

  if (cityName) {
      fetchWeatherForecast(cityName);
  }
});
