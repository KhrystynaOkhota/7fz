var _functions = {}, winWidth, shareButton;

jQuery(function ($) {
    var isTouchScreen = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
    if (isTouchScreen)
        $('html').addClass('touch-screen');
    var winScr, winHeight, is_Mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0,
        is_IE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d+/.test(navigator.userAgent),
        is_Chrome = navigator.userAgent.indexOf('Chrome') >= 0 && navigator.userAgent.indexOf('Edge') < 0;
    winWidth = $(window).width();
    winHeight = $(window).height();
    if (is_Mac) {
        jQuery('html').addClass('mac');
    }
    if (is_IE) {
        jQuery('html').addClass('ie');
    }
    if (is_Chrome) {
        jQuery('html').addClass('chrome');
    }

    //popup
    let popupTop = 0;
    _functions.removeScroll = function () {
        popupTop = $(window).scrollTop();
        jQuery('html').css({
            "position": "fixed",
            "top": -$(window).scrollTop(),
            "width": "100%"
        });
    }
    _functions.addScroll = function () {

        jQuery('html').css({
            "position": "static"
        });
        window.scroll(0, popupTop);
    }

    _functions.openPopup = function (popup) {

        jQuery('.popup-content').removeClass('active');

        // $('.popup-content').removeClass('animate-away').addClass('animate-in');

        jQuery(popup + ', .popup-wrapper').addClass('active');
        _functions.removeScroll();
    };

    _functions.closePopup = function () {
        jQuery('.popup-wrapper, .popup-content').removeClass('active');
        _functions.addScroll();
    };

    $(document).on('click', '.open-popup', function (e) {
        e.preventDefault();
        _functions.openPopup('.popup-content[data-rel="' + $(this).data('rel') + '"]');
    });

    $(document).on('click', '.popup-wrapper .btn-close, .popup-wrapper .layer-close, .popup-wrapper .btn-back', function (e) {
        e.preventDefault();
        _functions.closePopup();
    });



    $(window).scroll(function () {
        _functions.scrollCall();
    });

    var prev_scroll = 0;
    _functions.scrollCall = function () {
        winScr = $(window).scrollTop();
        if (winScr > prev_scroll) {
            $("header").addClass("scrolled");
        } else {
        }
        prev_scroll = winScr;

        if (winScr <= 10) {
            $("header").removeClass("scrolled");
            prev_scroll = 0;
        }
    };
    _functions.scrollCall();

    setTimeout(_functions.scrollCall, 0);




    /* Function on page scroll */
    $(window).on('scroll', function () {
        //header-hidden _functions.scrollCall();
    });

    /* _functions.scrollCall = function () {
         winScr = $(window).scrollTop();
         if (winScr > 10) {
             jQuery('header').addClass('scrolled');
         } else {
             jQuery('header').removeClass('scrolled');
         }
     }*/
    /*_functions.scrollCall();*/
    // Підписка на скрол
    window.addEventListener('scroll', _functions.scrollCall, { passive: true });

    // Виклик одразу при завантаженні, щоб перевірити положення хедера
    window.addEventListener('load', () => {
        // _functions.scrollCall();
    });



});

function scrollAnime() {
    if (jQuery('.animation').length) {
        jQuery('.animation').not('.animated').each(function () {
            var th = jQuery(this);
            if (jQuery(window).width() < 768) {
                if (jQuery(window).scrollTop() >= th.offset().top - (jQuery(window).height() * 0.95)) {
                    th.addClass('animated');
                }
            } else {
                if (jQuery(window).scrollTop() >= th.offset().top - (jQuery(window).height() * 0.85)) {
                    th.addClass('animated');
                }
            }
        });
    }
}

scrollAnime();
jQuery(window).on('scroll', function () {
    scrollAnime();
});

// =============================
// BURGER
// =============================
jQuery(function () {


    _functions.scrollWidth = function () {
        let scrWidth = jQuery(window).outerWidth() - jQuery('body').innerWidth();
        jQuery('body,  .h-menu-toggle, .h-search-wrapp').css({
            "paddingRight": `${scrWidth}px`
        });
    }
    

    let pageScrollPosition = 0;

    $(document).on("click", ".burger", function (e) {
        const $html = $("html");
        const $body = $("body");

        $(this).toggleClass("burger--active");
        $(this).parents("header").toggleClass("is-open");

        if (!$html.hasClass("overflow-menu")) {
            // МЕНЮ ВІДКРИВАЄТЬСЯ:
            // 1. Запам'ятовуємо поточну позицію скролу
            pageScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

            // 2. Додаємо клас блокування
            $html.addClass("overflow-menu");

            // 3. Фіксуємо body на поточній висоті, щоб воно не стрибало вгору
            $body.css({
                position: 'fixed',
                top: `-${pageScrollPosition}px`,
                left: '0',
                width: '100%'
            });
        } else {
            // МЕНЮ ЗАКРИВАЄТЬСЯ:
            // 1. Прибираємо клас блокування
            $html.removeClass("overflow-menu");

            // 2. Скидаємо фіксацію з body
            $body.css({
                position: '',
                top: '',
                left: '',
                width: ''
            });

            // 3. Миттєво повертаємо користувача на ту саму висоту, де він був
            window.scrollTo(0, pageScrollPosition);
        }
    });

});


document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".menu .menu-item a");
    const sections = document.querySelectorAll(".scroll-section");
    const header = document.querySelector(".header");

    // Функція для розрахунку висоти хедера (якщо він фіксований/sticky)
    const getHeaderHeight = () => header ? header.offsetHeight : 0;

    // ==========================================
    // 1. ПЛАВНИЙ СКРОЛ ПРИ КЛІКУ НА МЕНЮ
    // ==========================================
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute("href");
            if (targetId === "#" || !targetId.startsWith("#")) return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = getHeaderHeight();
                // Розраховуємо точну позицію елемента з урахуванням відступу під шапку
                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ==========================================
    // 2. SCROLLSPY (АКТИВАЦІЯ ПУНКТІВ ПРИ СКРОЛІ)
    // ==========================================
    // Налаштування для відстеження перетину екрана
    const observerOptions = {
        root: null, // відносно viewport
        // Зміщуємо зону тригеру: реагує, коли секція займає верхню частину екрана
        rootMargin: `-${getHeaderHeight() + 20}px 0px -60% 0px`,
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            // Якщо секція зайшла в активну зону екрана
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
});