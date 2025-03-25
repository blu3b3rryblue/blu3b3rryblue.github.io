// Real-time Toronto Weather Forecast (Open-Meteo)
loadJSON();

async function loadJSON() {
  try {
    const weatherResponse = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.65107&longitude=-79.347015&daily=weathercode&timezone=America%2FToronto");
    const weatherData = await weatherResponse.json();
    const codes = weatherData.daily.weathercode;

    const iconMap = {
      0: "clear-day",
      1: "clear-day",
      2: "partly-cloudy-day",
      3: "partly-cloudy-day",
      45: "cloudy",
      48: "cloudy",
      51: "rain",
      53: "rain",
      55: "rain",
      61: "rain",
      63: "rain",
      65: "rain",
      71: "snow",
      73: "snow",
      75: "snow",
      95: "rain",
      96: "rain",
      99: "rain"
    };

    const forecastData = {
      today_icon: iconMap[codes[0]] || "cloudy",
      tomorrow_icon: iconMap[codes[1]] || "cloudy",
      day_after_t_icon: iconMap[codes[2]] || "cloudy"
    };

    populateForecast(forecastData);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

function populateForecast(data) {
  const weather_days = ["today", "tomorrow", "day after tomorrow"];
  let forecast = "";

  for (let i = 0; i < weather_days.length; i++) {
    const icon_name = Object.values(data)[i];
    const text = icon_name.replace(/-/g, " ");
    forecast += `<span class="weather_day" id="${weather_days[i]}" title="${text}">${weather_days[i]}</span><span class="weather_icon ${icon_name}"> </span><span class="weather_text">${text}</span>`;
  }

  const weatherinfo = document.querySelectorAll('.forecast');
  weatherinfo.forEach(el => {
    el.innerHTML = forecast;
  });
}

// Page size display

document.addEventListener("DOMContentLoaded", function () {
  const pageSizeEl = document.getElementById("size-value");

  if (pageSizeEl) {
    const performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
    if (performance && performance.getEntriesByType) {
      const resources = performance.getEntriesByType("resource");
      let totalSize = 0;

      resources.forEach(resource => {
        if (resource.transferSize) {
          totalSize += resource.transferSize;
        }
      });

      const htmlSize = document.documentElement.outerHTML.length;
      totalSize += htmlSize;

      const kbSize = (totalSize / 1024).toFixed(2);
      pageSizeEl.textContent = `${kbSize}KB`;
    } else {
      pageSizeEl.textContent = "Unavailable";
    }
  }
});
