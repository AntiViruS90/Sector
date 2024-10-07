// Для блока времени и даты

function updateTime() {
    const now = new Date()
    const timeString = now.toLocaleTimeString('ru-Ru');
    const dateString = now.toLocaleDateString('ru-Ru', {
        day: 'numeric', month: 'long', weekday: 'long',
    });

    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}
setInterval(updateTime, 1000)

// Для блока погоды
// API OpenWeather b4132d26749b6b9167f50c7dab2c04fd
const URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = '784b6aa8319e639080f53150b0d20e4d';
const defaultCity = 'Краснодар';
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const displayWeather = document.getElementById('display-weather');

const searchWeather = async (city) => {
    try {
        const res = await fetch(`https:api.openweathermap.org/data/2.5/weather?q=${userInput.value}&appid=${API_KEY}&units=metric&lang=ru`);
        const data = await res.json();

        if (data.code === "404") {
            displayWeather.innerHTML = `
                <h3>Город не найден. Попробуйте снова.</h3>
            `;
        }

        const weatherDescription = data.weather[0].description;
        const weatherDescriptionUpper = weatherDescription.toUpperCase();
        
        displayWeather.innerHTML = `
            <h2>${data.name}</h2>
            <h3>${Math.round(data.main.temp)}°C</h3>
            <h4>${weatherDescriptionUpper}</h4>
        `;
    }
    catch(error) {
        displayWeather.innerHTML = `
            <h3>Ошибка при получении данных. Проверьте интернет-соединение или позже попробуйте снова.</h3>
        `;
        console.error(error);
    }
    
};

document.addEventListener('DOMContentLoaded', () => {
    searchWeather(defaultCity);
});

submitBtn.addEventListener('click', () => {
    const city = userInput.value.trim();

    if (city) {
        searchWeather(city);
    } else {
        displayWeather.innerHTML = `
            <h3>Пожалуйста, введите название города.</h3>
        `;
    }
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        const city = userInput.value.trim();

        if (city) {
            searchWeather(city);
        } else {
            displayWeather.innerHTML = `
                <h3>Пожалуйста, введите название города.</h3>
            `;
        }
    }
})


// submitBtn.addEventListener('click', searchWeather);
// userInput.addEventListener('keydown', (e) => {
//     if (e.key === "Enter") {
//         searchWeather();
//     }
// });


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
