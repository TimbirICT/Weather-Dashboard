// Define your OpenWeatherMap API URL
const apiKey = '5ecdd58a667d9ab9801a998a6ab6d228';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// Add an event listener to the form submission
const form = document.getElementById('forecast'); // Updated ID
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get the city name entered by the user
  const cityName = document.getElementById('5day').value; // Updated ID and class

  // Make an AJAX request to fetch weather data
  fetch(`${apiUrl}?q=${cityName}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the data (e.g., display the 5-day forecast)
      console.log(data);
      // You can implement a function to display the forecast data on your webpage
      displayForecast(data);
    })
    .catch((error) => {
      // Handle errors (e.g., city not found)
      console.error(error);
    });
});

function displayForecast(data) {
  // Implement logic to display the 5-day forecast data on your webpage
  // You can access data.list for the forecast information
  // Use the new class name "weather-search" for input and update the container ID as needed
}
