console.log("script.js is running"); 

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

// battery data
const batteryurl = "http://99.239.99.228:8080/api/stats.json"
// const batteryurl = "/api2/stats.json"

fetchBatteryStats();

async function fetchBatteryStats() {
  try {
    const res  = await fetch(batteryurl);
    const data = await res.json();
    setupBatteryMeter(data);
  } catch (err) {
    console.error("Error fetching battery stats:", err);
  }
}

function pushData(arr) {
    // returns a list of dt/dd pairs from a two-dimensional array
    let stats = [];
    for (i = 0; i < arr.length; i++) {
        stats.push("<dt>" + arr[i][0] + "</dt><dd>" + arr[i][1] + "</dd>");
    }
    return stats;
}

function setupBatteryMeter(data) {
  console.log("1. setupBatteryMeter called");
  console.log("2. data received:", data);

  //id=server
  let general_stats = [
    ["technology", data.technology],
    ["health", data.health],
    ["status", data.status],
    ["temperature", data.temperature],
    ["voltage", data.voltage],
    ["current", data.current],
    ["percentage", data.percentage],
    ["uptime", data.uptime]
  ]

  let dl = document.getElementById('server');
  dl.innerHTML = pushData(general_stats).join("");
}

//mobile menu toggle
const mobilemenu = document.getElementById('m-btn');
mobilemenu.addEventListener('click', function() {
    console.log('togglemenu');
    document.getElementById('menu-list').classList.toggle("show");
});


const comments = document.querySelectorAll('.comment');
if ( comments.length > 0 ){
    //update comment count
    document.getElementById('comment-count').innerText = comments.length;
}


const dither_icons = document.querySelectorAll('.dither-toggle');
dither_icons.forEach(icon => {
	icon.addEventListener('click', function() {
	    let figure = icon.closest('.figure-controls').previousElementSibling;
	    let img = figure.querySelector('img');

	    if( figure.getAttribute('data-imgstate') == "dither"){
	    	figure.setAttribute('data-imgstate', 'undither');	    	
	    	let original = img.getAttribute('data-original');
	    	img.src = original;
	    }else{
	    	figure.setAttribute('data-imgstate', 'dither');
	    	let dither= img.getAttribute('data-dither');
	    	img.src = dither;
	    }    
	});
});

// Per-image click-to-load
document.querySelectorAll('.load-img-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const wrapper = this.parentElement;

    // <img data-src>
    const img = wrapper.querySelector('img[data-src]');
    if (img) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }

    // background-image for featured.html + default.html
    if (wrapper.dataset.bg) {
      wrapper.style.backgroundImage = wrapper.dataset.bg;
      wrapper.removeAttribute('data-bg');
    }

    // Remove size
    const hint = wrapper.nextElementSibling;
    if (hint && hint.classList.contains('img-size-hint')) {
      hint.remove();
    }

    this.remove();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Calculate total page size (HTML + assets)
  let totalBytes = 0;

  performance.getEntriesByType("resource").forEach(entry => {
    if (entry.transferSize) {
      totalBytes += entry.transferSize;
    }
  });

  const navEntry = performance.getEntriesByType("navigation")[0];
  if (navEntry && navEntry.transferSize) {
    totalBytes += navEntry.transferSize;
  }

  const sizeInKB = (totalBytes / 1024).toFixed(2);
  const sizeValue = document.getElementById("size-value");
  if (sizeValue) {
    sizeValue.textContent = `${sizeInKB} KB`;
  }
});
