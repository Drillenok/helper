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

    // Инициализация паралакса
    var scene = document.getElementById('intro');
    var parallaxInstance = new Parallax(scene);

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

    // Функция для отображения запросов на доступ
    function displayRequests(requests) {
        requestList.innerHTML = '';
        requests.forEach((request, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${request.username}</td>
                <td>${request.password}</td>
                <td>${request.callsign}</td>
                <td>
                    <button class="accept" onclick="acceptRequest(${request.id})">Принять</button>
                    <button onclick="rejectRequest(${request.id})">Отклонить</button>
                </td>
            `;
            requestList.appendChild(tr);
        });
    }

    // Функция для отображения пользователей
    function displayUsers(users) {
        userList.innerHTML = '';
        users.forEach((user, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.callsign}</td>
                <td>
                    <button onclick="editUserUsername(${user.id})">Редактировать логин</button>
                    <button onclick="editUserPassword(${user.id})">Редактировать пароль</button>
                    <button onclick="deleteUser(${user.id})">Удалить доступ</button>
                </td>
            `;
            userList.appendChild(tr);
        });
    }

    // Функция для загрузки данных из MySQL
    async function loadWorkers() {
        try {
            const response = await fetch('http://localhost:5000/workers');
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            const workers = await response.json();
            console.log('Полученные данные работников:', workers); // Добавлено для отладки
            displayWorkers(workers);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    // Функция для загрузки запросов на доступ
    async function loadRequests(user) {
        try {
            const response = await fetch(`http://localhost:5000/requests?user=${user}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            const requests = await response.json();
            console.log('Полученные данные запросов:', requests); // Добавлено для отладки
            displayRequests(requests);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    // Функция для загрузки пользователей
    async function loadUsers(user) {
        try {
            const response = await fetch(`http://localhost:5000/users?user=${user}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            const users = await response.json();
            console.log('Полученные данные пользователей:', users); // Добавлено для отладки
            displayUsers(users);
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
            if (!response.ok) {
                throw new Error('Ошибка при добавлении работника');
            }
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
            if (!response.ok) {
                throw new Error('Ошибка при удалении работника');
            }
            const result = await response.json();
            loadWorkers();
        } catch (error) {
            console.error('Ошибка при удалении работника:', error);
        }
    }

    // Функция для редактирования работника
    async function editWorker(worker_id) {
        try {
            const response = await fetch(`http://localhost:5000/workers/${worker_id}`);
            if (!response.ok) {
                throw new Error('Ошибка при получении данных работника');
            }
            const worker = await response.json();
            fillForm(worker);
        } catch (error) {
            console.error('Ошибка при получении данных работника:', error);
        }
    }

    // Функция для заполнения формы данными работника
    function fillForm(worker) {
        document.getElementById('callsign').value = worker.callsign;
        document.getElementById('discord-id').value = worker.discord_id;
        document.getElementById('position').value = worker.position;
        document.getElementById('email').value = worker.email;
        document.getElementById('reprimands').value = worker.reprimands;
        document.getElementById('vacation').value = worker.vacation;
        document.getElementById('department').value = worker.department;
        document.getElementById('points').value = worker.points;
        workerForm.dataset.workerId = worker.id;
    }

    // Функция для обновления работника
    async function updateWorker(event) {
        event.preventDefault();
        const formData = new FormData(workerForm);
        const worker = Object.fromEntries(formData.entries());
        const worker_id = workerForm.dataset.workerId;

        try {
            const response = await fetch(`http://localhost:5000/workers/${worker_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(worker)
            });
            if (!response.ok) {
                throw new Error('Ошибка при обновлении работника');
            }
            const result = await response.json();
            loadWorkers();
            workerForm.reset();
            delete workerForm.dataset.workerId;
        } catch (error) {
            console.error('Ошибка при обновлении работника:', error);
        }
    }

    // Функция для регистрации
    async function register(event) {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Ошибка при регистрации');
            }
            const result = await response.json();
            registerMessage.innerHTML = '<p style="color: green;">Ожидайте одобрения от создателя</p>';
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            registerMessage.innerHTML = '<p style="color: red;">Ошибка при регистрации</p>';
        }
    }

// Функция для авторизации
async function login(event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
        if (result.user.username === 'Drill') {
            loadRequests(result.user.username); // Загрузка запросов для пользователя Drill
            loadUsers(result.user.username); // Загрузка пользователей для пользователя Drill
            requestsSection.classList.remove('hidden');
            usersSection.classList.remove('hidden');
        }
        if (data['remember-me']) {
            localStorage.setItem('authToken', result.token);
        }
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
    }

    // Функция для принятия запроса
    async function acceptRequest(request_id) {
        try {
            const response = await fetch(`http://localhost:5000/requests/${request_id}/accept`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Ошибка при принятии запроса');
            }
            const result = await response.json();
            loadRequests('Drill');
        } catch (error) {
            console.error('Ошибка при принятии запроса:', error);
        }
    }

    // Функция для отклонения запроса
    async function rejectRequest(request_id) {
        try {
            const response = await fetch(`http://localhost:5000/requests/${request_id}/reject`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Ошибка при отклонении запроса');
            }
            const result = await response.json();
            loadRequests('Drill');
        } catch (error) {
            console.error('Ошибка при отклонении запроса:', error);
        }
    }

    // Функция для редактирования логина пользователя
    async function editUserUsername(user_id) {
        const newUsername = prompt('Введите новый логин:');
        if (newUsername) {
            try {
                const response = await fetch(`http://localhost:5000/users/${user_id}/username`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: newUsername })
                });
                if (!response.ok) {
                    throw new Error('Ошибка при обновлении логина');
                }
                const result = await response.json();
                loadUsers('Drill');
            } catch (error) {
                console.error('Ошибка при обновлении логина:', error);
            }
        }
    }

    // Функция для редактирования пароля пользователя
    async function editUserPassword(user_id) {
        const newPassword = prompt('Введите новый пароль:');
        if (newPassword) {
            try {
                const response = await fetch(`http://localhost:5000/users/${user_id}/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password: newPassword })
                });
                if (!response.ok) {
                    throw new Error('Ошибка при обновлении пароля');
                }
                const result = await response.json();
                loadUsers('Drill');
            } catch (error) {
                console.error('Ошибка при обновлении пароля:', error);
            }
        }
    }

    // Функция для удаления пользователя
    async function deleteUser(user_id) {
        try {
            const response = await fetch(`http://localhost:5000/users/${user_id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Ошибка при удалении пользователя');
            }
            const result = await response.json();
            loadUsers('Drill');
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    }

    // Инициализация
    loginForm.addEventListener('submit', login);
    registerForm.addEventListener('submit', register);
    workerForm.addEventListener('submit', (event) => {
        if (workerForm.dataset.workerId) {
            updateWorker(event);
        } else {
            addWorker(event);
        }
    });

    // Функция для удаления работника (глобальная)
    window.deleteWorker = deleteWorker;
    window.editWorker = editWorker;
    window.acceptRequest = acceptRequest;
    window.rejectRequest = rejectRequest;
    window.editUserUsername = editUserUsername;
    window.editUserPassword = editUserPassword;
    window.deleteUser = deleteUser;

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
        if (authToken === 'Drill') {
            loadRequests('Drill'); // Загрузка запросов для пользователя Drill
            loadUsers('Drill'); // Загрузка пользователей для пользователя Drill
            requestsSection.classList.remove('hidden');
            usersSection.classList.remove('hidden');
        }
    } else {
        // Скрытие секций и отключение прокрутки до авторизации
        document.body.classList.add('no-scroll');
        otherSections.forEach(section => section.classList.add('hidden'));
    }

    // Обработка кликов на кнопку выхода
    logoutButton.addEventListener('click', logout);
});
