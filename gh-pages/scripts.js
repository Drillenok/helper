document.addEventListener('DOMContentLoaded', () => {
    const workerForm = document.getElementById('worker-form');
    const workerList = document.getElementById('worker-items');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');
    const requestList = document.getElementById('request-items');
    const userList = document.getElementById('user-items');
    const loginSection = document.getElementById('auth');
    const registerSection = document.getElementById('register');
    const requestsSection = document.getElementById('requests');
    const usersSection = document.getElementById('users');
    const otherSections = document.querySelectorAll('section:not(#auth):not(#register):not(#requests):not(#users)');
    const toggleAuthButton = document.getElementById('toggle-auth');
    const toggleRegisterButton = document.getElementById('toggle-register');
    const logoutButton = document.getElementById('logout-btn');

    // Функция для отображения работников
    function displayWorkers(workers) {
        workerList.innerHTML = '';
        workers.forEach((worker, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${worker.callsign}</td>
                <td>${worker.discord_id}</td>
                <td>${worker.position}</td>
                <td>${worker.email}</td>
                <td>${worker.reprimands}</td>
                <td>${worker.vacation}</td>
                <td>${worker.department}</td>
                <td>${worker.points}</td>
                <td>
                    <button onclick="editWorker(${worker.id})">Редактировать</button>
                    <button onclick="deleteWorker(${worker.id})">Удалить</button>
                </td>
            `;
            workerList.appendChild(tr);
        });
    }

    // Функция для загрузки данных о работниках
    async function loadWorkers() {
        try {
            const response = await fetch('https://api.github.com/repos/your-username/your-repo/contents/data/workers.json', {
                headers: {
                    'Authorization': `token ${localStorage.getItem('authToken')}`
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            const data = await response.json();
            const workers = JSON.parse(atob(data.content));
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
            const response = await fetch('https://api.github.com/repos/your-username/your-repo/contents/data/workers.json', {
                method: 'GET',
                headers: {
                    'Authorization': `token ${localStorage.getItem('authToken')}`
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }
            const data = await response.json();
            const workers = JSON.parse(atob(data.content));
            workers.push(worker);

            const updatedContent = btoa(JSON.stringify(workers, null, 2));
            const updateResponse = await fetch(data.url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update workers.json',
                    content: updatedContent,
                    sha: data.sha
                })
            });
            if (!updateResponse.ok) {
                throw new Error('Ошибка при обновлении данных');
            }
            loadWorkers();
            workerForm.reset();
        } catch (error) {
            console.error('Ошибка при добавлении работника:', error);
        }
    }

    // Функция для авторизации
    async function login(event) {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://api.github.com/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(`${data.username}:${data.password}`)}`
                }
            });
            if (!response.ok) {
                throw new Error('Неверное имя пользователя или пароль');
            }
            const result = await response.json();
            loginMessage.innerHTML = '<p style="color: green;">Успешная авторизация</p>';
            loginSection.style.display = 'none';
            registerSection.style.display = 'none';
            otherSections.forEach(section => section.classList.remove('hidden'));
            document.body.classList.remove('no-scroll');
            loadWorkers(); // Загрузка работников после успешной авторизации
            localStorage.setItem('authToken', result.token);
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            loginMessage.innerHTML = '<p style="color: red;">Неверное имя пользователя или пароль</p>';
        }
    }

    // Функция для выхода из аккаунта
    function logout() {
        localStorage.removeItem('authToken');
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
        otherSections.forEach(section => section.classList.add('hidden'));
        document.body.classList.add('no-scroll');
        logoutButton.classList.add('hidden');
        location.reload(); // Перезагрузка страницы
    }

    // Инициализация
    loginForm.addEventListener('submit', login);
    workerForm.addEventListener('submit', addWorker);

    // Функция для удаления работника (глобальная)
    window.deleteWorker = deleteWorker;
    window.editWorker = editWorker;

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

    // Переключение между регистрацией и авторизацией
    toggleAuthButton.addEventListener('click', function() {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    toggleRegisterButton.addEventListener('click', function() {
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Проверка авторизации при загрузке страницы
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        loginSection.style.display = 'none';
        registerSection.style.display = 'none';
        otherSections.forEach(section => section.classList.remove('hidden'));
        document.body.classList.remove('no-scroll');
        logoutButton.classList.remove('hidden');
        loadWorkers(); // Загрузка работников после успешной авторизации
    } else {
        // Скрытие секций и отключение прокрутки до авторизации
        document.body.classList.add('no-scroll');
        otherSections.forEach(section => section.classList.add('hidden'));
    }

    // Обработка кликов на кнопку выхода
    logoutButton.addEventListener('click', logout);
});
