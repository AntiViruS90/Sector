// Для блока времени и даты

function updateTime() {
    const now = new Date()
    const timeString = now.toLocaleTimeString('ru-Ru');
    const dateString = now.toLocaleDateString('ru-Ru', {
        weekday: 'long', day: 'numeric', month: 'long',
    });

    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}
setInterval(updateTime, 1000)

// Для блока погоды
const API_KEY = 'd873d1e39c8e2d597fe431b3ab9aadea';
const defaultCity = 'Краснодар';
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const displayWeather = document.getElementById('display-weather');

// const searchWeather = async (city) => {

//     const res = await fetch(`https://api.weatherstack.com/current?access_key=${API_KEY}&query=${userInput.value}`);
//     const data = await res.json();

//     if (data.error) {
//         displayWeather.innerHTML = `
//             <h3>Город не найден. Попробуйте снова.</h3>
//         `;
//         return;
//     }

//     try {
//         const res = await fetch(`https://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`);
//         const data = await res.json();

//         if (data.code === "404") {
//             displayWeather.innerHTML = `
//                 <h3>Город не найден. Попробуйте снова.</h3>
//             `;
//         }
//         const weatherDescription = data.current.weather_descriptions[0];
//         const weatherDescriptionUpper = weatherDescription.toUpperCase();
        
//         displayWeather.innerHTML = `
//             <h2>${data.location.name}</h2>
//             <span class="d-flex justify-content-center">
//                 <img src="${data.current.weather_icons[0]}" alt="weather icon">
//                 <h3>${Math.round(data.current.temperature)}°C</h3>
//             </span>
            
//             <h4>${weatherDescriptionUpper}</h4>
//         `;

//     }
//     catch(error) {
//         displayWeather.innerHTML = `
//             <h3>Ошибка при получении данных. Проверьте интернет-соединение или позже попробуйте снова.</h3>
//         `;
//         console.error(error);
//     }
// };


const searchWeather = async (city = defaultCity, lat = null, lon = null) => {
    let query = `q=${city}`;

    if (lat && lon) {
        query = `lat=${lat}&lon=${lon}`;
    }
    console.log(lat);
    console.log(lon);

    const res = await fetch(`https://api.weatherstack.com/current?access_key=${API_KEY}&query=${query}`);
    const data = await res.json();

    console.log(data);

    if (data.error) {
        displayWeather.innerHTML = `
            <h3>Город не найден. Попробуйте снова.</h3>
        `;
        return;
    } else {
        const weatherDescription = data.current.weather_descriptions[0];
        const weatherDescriptionUpper = weatherDescription.toUpperCase();
        
        displayWeather.innerHTML = `
            <h2>${data.location.name}</h2>
            <span class="d-flex justify-content-center">
                <img src="${data.current.weather_icons[0]}" alt="weather icon">
                <h3>${Math.round(data.current.temperature)}°C</h3>
            </span>
            
            <h4>${weatherDescriptionUpper}</h4>
        `;
    }

};

const getWeatherByGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            searchWeather(null, latitude, longitude)
            
        }, 
        () => {
            searchWeather(defaultCity);
        }
        
    );
    } else {
        searchWeather(defaultCity)
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('city');
    if (savedCity) {
        searchWeather(savedCity);
    } else {
        getWeatherByGeolocation();
    }
});

submitBtn.addEventListener('click', () => {
    const city = userInput.value.trim();

    if (city) {
        searchWeather(city);
        localStorage.setItem('city', city);
    } else {
        displayWeather.innerHTML = `
            <h3>Пожалуйста, введите название города.</h3>
        `;
    }

    userInput = '';
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        const city = userInput.value.trim();

        if (city) {
            searchWeather(city);
            localStorage.setItem('city', city);
        } else {
            displayWeather.innerHTML = `
                <h3>Пожалуйста, введите название города.</h3>
            `;
        }
    }
    userInput = '';
});



// Для смены фоновых изображений
const backgrounds = [
    '01.jpg',
    '02.jpg',
    '03.jpg',
    '04.jpg'
]

function updateBackground() {
    const currentTime = new Date().getHours();
    let backgroundUrl = '';

    if (currentTime >= 0 && currentTime < 6) {
        backgroundUrl = backgrounds[0];
    } else if (currentTime >= 6 && currentTime < 12) {
        backgroundUrl = backgrounds[1];
    } else if (currentTime >= 12 && currentTime < 18) {
        backgroundUrl = backgrounds[2];
    } else {
        backgroundUrl = backgrounds[3];
    }
    document.body.style.backgroundImage = `url(${backgroundUrl})`;
}

updateBackground();



// Для блока задач

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

function addTask() {
    const taskText = taskInput.value.trim();
    const removeTaskBtnText = 'Удалить';
    if (taskText === '') {
        alert('Задача не может быть пустой!');
        return;
    }
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item task-item';
    taskItem.innerHTML = `
        <span><input type="checkbox" class="task-checkbox"/> ${taskText}</span>        
        <button class="delete-task btn btn-danger btn-sm">${removeTaskBtnText}</button>
    `;
    taskList.appendChild(taskItem);

    taskInput.value = '';
}

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-task')) {
        event.target.parentElement.remove();
    }
});
