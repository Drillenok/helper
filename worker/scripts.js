document.addEventListener('DOMContentLoaded', () => {
    const workerForm = document.getElementById('worker-form');
    const workerList = document.getElementById('worker-items');

    // Инициализация паралакса
    var scene = document.getElementById('intro');
    var parallaxInstance = new Parallax(scene);

    // Функция для отображения работников
    function displayWorkers(workers) {
        workerList.innerHTML = '';
        workers.forEach((worker, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${worker.callsign} - ${worker.position}</span>
                <button onclick="deleteWorker(${worker.id})">Удалить</button>
            `;
            workerList.appendChild(li);
        });
    }

    // Функция для загрузки данных из MySQL
    async function loadWorkers() {
        try {
            const response = await fetch('http://localhost:5000/workers');
            const workers = await response.json();
            displayWorkers(workers);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    // Функция для добавления работника
    async function addWorker(event) {
        event.preventDefault();
        const formData = new FormData(workerForm);
        const worker = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:5000/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(worker)
            });
            const result = await response.json();
            loadWorkers();
            workerForm.reset();
        } catch (error) {
            console.error('Ошибка при добавлении работника:', error);
        }
    }

    // Функция для удаления работника
    async function deleteWorker(worker_id) {
        try {
            const response = await fetch(`http://localhost:5000/workers/${worker_id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            loadWorkers();
        } catch (error) {
            console.error('Ошибка при удалении работника:', error);
        }
    }

    // Инициализация
    loadWorkers();
    workerForm.addEventListener('submit', addWorker);

    // Функция для удаления работника (глобальная)
    window.deleteWorker = deleteWorker;

    // Функция для авторизации
    async function authenticate() {
        try {
            const response = await fetch('https://drillenok.github.io/worker/auth.json');
            if (!response.ok) {
                throw new Error('Файл auth.json не найден');
            }
            const authData = await response.json();
            const username = prompt('Введите имя пользователя:');
            const password = prompt('Введите пароль:');
            const user = authData.find(user => user.username === username && user.password === password);
            if (user) {
                loadWorkers();
            } else {
                alert('Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
        }
    }

    // Инициализация
    authenticate();
    workerForm.addEventListener('submit', addWorker);

    // Функция для удаления работника (глобальная)
    window.deleteWorker = deleteWorker;

    // Анимация для кнопок
    var buttons = document.getElementsByClassName("collapsible");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("mouseenter", function() {
            this.style.backgroundColor = "#40444b";
        });
        buttons[i].addEventListener("mouseleave", function() {
            this.style.backgroundColor = "#36393f";
        });
    }

    // Анимация заголовков при прокрутке
    var headers = document.querySelectorAll("h1, h2");
    function checkScroll() {
        headers.forEach(header => {
            var rect = header.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                header.classList.add("animate");
            }
        });
    }
    window.addEventListener("scroll", checkScroll);
    checkScroll();

    // Анимация фона
    var body = document.body;
    body.style.transition = "background-color 0.5s";
    window.addEventListener("scroll", function() {
        var scrollPosition = window.scrollY;
        var newColor = `rgba(47, 49, 54, ${Math.min(scrollPosition / 500, 1)})`;
        body.style.backgroundColor = newColor;
    });

    // Плавная прокрутка при навигации
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = this.getAttribute('href');
            if (target.startsWith('#')) {
                document.querySelector(target).scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                window.location.href = target;
            }
        });
    });

    // Анимация появления элементов при прокрутке
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            } else {
                reveals[i].classList.remove("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);
    reveal();

    // Подсветка активного раздела в навигации
    function highlightNav() {
        var sections = document.querySelectorAll("section");
        var navLinks = document.querySelectorAll("nav a");
        var current = "";

        sections.forEach(section => {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", highlightNav);

    // Обработка кликов на гамбургер-меню
    var dropdownBtn = document.querySelector('.dropbtn');
    var dropdownContent = document.querySelector('.dropdown-content');

    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropbtn')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });
});
