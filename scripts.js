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
});
