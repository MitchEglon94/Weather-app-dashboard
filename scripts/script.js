// DATE AND TIME DISPLAY
const dateTime = document.getElementById("date");
function tick() {
  const newDate = new Date();
  dateTime.textContent = `${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()}`;
}
tick();
setInterval(tick, 1000);

// OBTAIN GEOLOCATION

let lat, lon;

async function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position, error) => {
      console.log(position);
      resolve(position);
      reject(error);
    });
  });
}

try {
  const position = await getPosition();
  lat = position.coords.latitude;
  lon = position.coords.longitude;
} catch (err) {
  console.log(err);
}

const API_key = `28a7ee7e99b07e3916c770e8a6e351e4
`;
const reverseGeoLookup = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_key}`;
const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;
const dailyEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;

const location = document.getElementById("location");
const temperature = document.getElementById("temp");
const description = document.getElementById("description");
const minMax = document.getElementById("min-max");
const hourly = document.getElementById("hourly");

try {
  const response = await fetch(weatherEndpoint);
  if (!response.ok) throw response;
  const data = await response.json();
  console.log(data);
  renderData(data);
} catch (err) {
  console.log(err);
}

function renderData(data) {
  const {
    name,
    main: { temp, temp_max, temp_min, feels_like, humidity, pressure },
    weather: {
      0: { main },
    },
  } = data;
  location.textContent = name;
  temperature.textContent = `${Math.round(temp)}C`;
  description.textContent = main;
  minMax.innerHTML = `<span>L:${Math.round(
    temp_min
  )}</span><span> H:${Math.round(temp_max)}</span>`;
}
