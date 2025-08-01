document.addEventListener('DOMContentLoaded', function() {
    // Инициализация паралакса
    var scene = document.getElementById('intro');
    var parallaxInstance = new Parallax(scene);

    // Раскрывающиеся списки
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
            var icon = this.querySelector("i");
            icon.classList.toggle("fa-chevron-up");
            icon.classList.toggle("fa-chevron-down");
        });
    }

    // Анимация для кнопок
    var buttons = document.getElementsByClassName("collapsible");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("mouseenter", function() {
            this.style.backgroundColor = "#555";
        });
        buttons[i].addEventListener("mouseleave", function() {
            this.style.backgroundColor = "#333";
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
        var newColor = `rgba(18, 18, 18, ${Math.min(scrollPosition / 500, 1)})`;
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
    var menuIcon = document.querySelector('.menu-icon');
    var dropdownContent = document.querySelector('.dropdown-content');

    menuIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        dropdownContent.classList.toggle('show');
    });

    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            menuIcon.classList.remove('active');
            dropdownContent.classList.remove('show');
        }
    });

    // Закрытие меню при клике на пункт меню
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function() {
            menuIcon.classList.remove('active');
            dropdownContent.classList.remove('show');
        });
    });
});
