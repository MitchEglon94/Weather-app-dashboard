// DATE AND TIME DISPLAY
const date = document.getElementById("date");
const time = document.getElementById("time");
function tick() {
  const newDate = new Date();
  date.textContent = `${newDate.toLocaleDateString()}`;
  time.textContent = `${newDate.toLocaleTimeString()}`;
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

const API_key = `28a7ee7e99b07e3916c770e8a6e351e4`;
const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;
const dailyEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;

const location = document.getElementById("location");
// const temperature = document.getElementById("temp");
// const description = document.getElementById("description");
// const minMax = document.getElementById("min-max");
const hourly = document.getElementById("hourly");
const tempCard = document.getElementById("temp-card");

try {
  const response = await fetch(weatherEndpoint);
  const dailyResponse = await fetch(dailyEndpoint);
  if (!response.ok) throw response;
  const data = await response.json();
  const dailyData = await dailyResponse.json();
  console.log(data);
  renderData(data, dailyData);
} catch (err) {
  console.log(err);
}

function renderData(data, daily) {
  const {
    wind: { deg, speed },
    visibility,
    sys: { sunrise, sunset },

    name,
    main: { temp, temp_max, temp_min, feels_like, humidity, pressure },
    weather: {
      0: { main },
    },
  } = data;
  const { list } = daily;

  // RENDER CURRENT WEATHER DATA TO DISPLAY
  const frag = document.createDocumentFragment();
  const div = document.createElement("div");
  div.innerHTML = ` <h2 id="temp" class="feature-card-title">${Math.round(
    temp
  )}&degC</h2>
  <p id="description" class="description-text">${main}</p>
  <p  id="min-max"><span>L:${Math.round(temp_min)}</span><span> H:${Math.round(
    temp_max
  )}</span></p>`;
  location.textContent = name;
  frag.appendChild(div);
  tempCard.replaceChildren(frag);

  // RENDER 24 HOUR FORECAST INFO TO DISPLAY
  const dailyFrag = document.createDocumentFragment();
  list.forEach((e, i) => {
    const {
      dt_txt,
      main: { temp },
      weather: {
        0: { description },
      },
    } = e;
    if (i < 8) {
      const info = document.createElement("div");
      info.classList.add("hourly-info");
      const timeString = dt_txt;
      const onlyTime = timeString.match(/\d\d:\d\d/g);
      info.innerHTML = `<p class="description-text">${onlyTime}</p>
      <p>${Math.round(temp)}&degC</p>
      <p class="description-text">${description}</p>
      `;
      dailyFrag.appendChild(info);
    }
  });
  hourly.classList.remove("onload");
  hourly.replaceChildren(dailyFrag);

  //RENDER WIND INFO
  const windDisplay = document.getElementById("wind");
  wind.innerHTML = `<h3>Wind</h3>
  <p>Speed: ${speed}km/h direction: ${deg}&deg</p>`;

  //RENDER AIR PRESSURE
  const pressureDisplay = document.getElementById("air-pressure");
  pressureDisplay.innerHTML = `<h3>Air Pressure</h3>
  <p>${pressure} hPa</p>
  `;
  //RENDER FEELS LIKE TEMP
  const feelslikeDisplay = document.getElementById("feels-like");
  feelslikeDisplay.innerHTML = `<h3>Feels like</h3>
    <p>${Math.round(feels_like)}&degC</p>
    `;
  //RENDER HUMIDITY
  const humidityDisplay = document.getElementById("humidity");
  humidityDisplay.innerHTML = `<h3>Humidity</h3>
    <p>${humidity}%</p>
    `;
  //RENDER DAYLIGHT HOURS
  const sunsetDisplay = document.getElementById("sunset-daylight");
  sunsetDisplay.innerHTML = `<h3>Daylight Hours</h3>
    <p>Sunrise: ${new Date(sunrise).toLocaleTimeString()}</p> 
    <p>Sunset: ${new Date(sunset).toLocaleTimeString()}</p>`;
  // //RENDER UV INDEX
  // const humidityDisplay = document.getElementById("humidity");
  // humidityDisplay.innerHTML = `<h3>Humidity</h3>
  //   <p>${humidity}%</p>
  //   `;
  //   //RENDER RAINFALL
  //   const humidityDisplay = document.getElementById("humidity");
  //   humidityDisplay.innerHTML = `<h3>Humidity</h3>
  //     <p>${humidity}%</p>
  //     `;
  //RENDER VISIBILITY
  const visibilityDisplay = document.getElementById("visibility");
  visibilityDisplay.innerHTML = `<h3>Visibility</h3>
      <p>${visibility / 1000}km</p>
      `;
}
