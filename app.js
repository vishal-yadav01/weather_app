const API_KEY = '88GHGSEUAQZLHWQYM23XJ6NGT';
const inputBox = document.getElementById('inputBox');
const search = document.getElementById('search');
const res = document.getElementById('res');
const refresh = document.getElementById('refresh');
const dataDiv = document.getElementById('data');

let loading = false;
let holder = null;
let data = null;

// Fetch weather data
const weatherFetch = async (location) => {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}&unitGroup=metric`;
    loading = true;
    holder = location;
    showLoader(loading);

    const response = await fetch(url);
    const result = await response.json();

    if (result) {
      loading = false;
      showLoader(loading);
      data = result;
      refresh.style.display = 'block';
      displayCurrentWeather(data);
      displayPastWeather(data);
      displayFutureWeather(data);
    }
  } catch (error) {
    loading = false;
    showLoader(loading);
    res.innerHTML = 'Error fetching data. Please try again.';
    console.error(error);
  }
};

// Search button click
search.addEventListener('click', async () => {
  res.innerHTML = '';
  const location = inputBox.value.trim();

  if (!location) {
    res.innerHTML = 'Please enter a location';
    return;
  }

  if (holder === location) {
    return; // Avoid re-fetching same location
  }

  await weatherFetch(location);
});

// Input field
inputBox.addEventListener('input', () => {
  res.innerHTML = '';
  refresh.style.display = 'none';
});

// Loader
const showLoader = (loading) => {
  res.innerHTML = loading ? 'Loading...' : '';
};

// Refresh button
refresh.addEventListener('click', () => {
  const location = inputBox.value.trim();
  if (location) {
    weatherFetch(location);
  } else {
    refresh.style.display = 'none';
  }
});

// Display current weather
const displayCurrentWeather = (data) => {
  if (!data || !data.currentConditions) {
    res.innerHTML = 'No data found';
    return;
  }

  const current = data.currentConditions;
  dataDiv.innerHTML = `
    <h3>${data.resolvedAddress}</h3>
    <p>Temperature: ${current.temp} °C</p>
    <p>Wind Speed: ${current.windspeed} km/h</p>
    <p>Conditions: ${current.conditions}</p>
    <p>Rain Chance: ${current.precipprob || 0}%</p>
  `;
};

// Display past 24 hours
const displayPastWeather = (data) => {
  if (!data.days || !data.days[0]) return;

  const past = data.days[0].hours.slice(-24); // last 24 hours
  document.getElementById('pastWeather').innerHTML = past
    .map(
      (hour) => `
    <div class="forecast-item">
      <p>${hour.datetime}</p>
      <p>${hour.temp} °C</p>
      <p>${hour.conditions}</p>
    </div>
  `
    )
    .join('');
};

// Display next 24 hours
const displayFutureWeather = (data) => {
  if (!data.days || !data.days[1]) return;

  const future = data.days[1].hours.slice(0, 24);
  document.getElementById('futureWeather').innerHTML = future
    .map(
      (hour) => `
    <div class="forecast-item">
      <p>${hour.datetime}</p>
      <p>${hour.temp} °C</p>
      <p>${hour.conditions}</p>
    </div>
  `
    )
    .join('');
};
