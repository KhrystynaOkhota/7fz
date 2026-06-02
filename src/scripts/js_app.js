var _functions = {}, winWidth, shareButton;

jQuery(function ($) {
    // Визначення типу пристрою та браузера (Modern approach)
    const isTouchScreen = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const isChrome = navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edge');

    const $html = $('html');
    const $body = $('body');
    const $window = $(window);
    const $header = $("header, .header"); // Об'єднав селектори хедера

    if (isTouchScreen) $html.addClass('touch-screen');
    if (isMac) $html.addClass('mac');
    if (isChrome) $html.addClass('chrome');

    let winScr;
    let popupTop = 0;
    let prevScroll = 0;
    let pageScrollPosition = 0;

    // ==========================================
    // ПОПАПИ
    // ==========================================
    _functions.removeScroll = function () {
        popupTop = $window.scrollTop();
        $html.css({
            "position": "fixed",
            "top": -popupTop,
            "width": "100%"
        });
    };

    _functions.addScroll = function () {
        $html.css({ "position": "static" });
        window.scroll(0, popupTop);
    };

    _functions.openPopup = function (popup, data) {
        $('.popup-content').removeClass('active');

        const $popup = $(popup);
        if (data && typeof data === 'object') {
            $popup.find('.popup-dynamic-img').toggle(!!data.img).attr('src', data.img || '');
            $popup.find('.popup-dynamic-text').toggle(!!data.text).text(data.text || '');
        } else {
            $popup.find('.popup-dynamic-img, .popup-dynamic-text').hide();
        }

        $popup.addClass('active');
        $('.popup-wrapper').addClass('active');
        _functions.removeScroll();
    };

    _functions.closePopup = function () {
        $('.popup-wrapper, .popup-content').removeClass('active');
        _functions.addScroll();
    };

    // Події для попапів
    $(document).on('click', '.open-popup', function (e) {
        e.preventDefault();
        const $this = $(this);
        const popupSelector = `.popup-content[data-rel="${$this.data('rel')}"]`;
        const popupData = { img: $this.data('img'), text: $this.data('text') };
        _functions.openPopup(popupSelector, popupData);
    });

    $(document).on('click', '.popup-wrapper .btn-close, .popup-wrapper .layer-close, .popup-wrapper .btn-back', function (e) {
        e.preventDefault();
        _functions.closePopup();
    });

    // ==========================================
    // ХЕДЕР ТА АНІМАЦІЇ ПРИ СКРОЛІ (Об'єднано в одну подію)
    // ==========================================
    const $animationElements = $('.animation');

    _functions.scrollCall = function () {
        winScr = $window.scrollTop();
        const winHeight = $window.height();
        const winWidth = $window.width();

        // 1. Скрол Хедера
        if (winScr > prevScroll) {
            $header.addClass("scrolled");
        }
        prevScroll = winScr;

        if (winScr <= 10) {
            $header.removeClass("scrolled");
            prevScroll = 0;
        }

        // 2. Анімація елементів
        const $activeAnimations = $animationElements.not('.animated');
        if ($activeAnimations.length) {
            const multiplier = winWidth < 768 ? 0.95 : 0.85;
            $activeAnimations.each(function () {
                const $th = $(this);
                if (winScr >= $th.offset().top - (winHeight * multiplier)) {
                    $th.addClass('animated');
                }
            });
        }
    };

    window.addEventListener('scroll', _functions.scrollCall, { passive: true });
    _functions.scrollCall(); // Первинний старт

    // ==========================================
    // БУРГЕР МЕНЮ
    // ==========================================
    _functions.scrollWidth = function () {
        let scrWidth = $window.outerWidth() - $body.innerWidth();
        $('body, .h-menu-toggle, .h-search-wrapp').css({ "paddingRight": `${scrWidth}px` });
    };

    $(document).on("click", ".burger", function (e) {
        $(this).toggleClass("burger--active");
        $(this).parents("header").toggleClass("is-open");

        if (!$html.hasClass("overflow-menu")) {
            pageScrollPosition = window.scrollY || document.documentElement.scrollTop;
            _functions.scrollWidth();
            $html.addClass("overflow-menu");
            $body.css({
                position: 'fixed',
                top: `-${pageScrollPosition}px`,
                left: '0',
                width: '100%'
            });
        } else {
            $html.removeClass("overflow-menu");
            $body.css({ position: '', top: '', left: '', width: '' });
            $('body, .h-menu-toggle, .h-search-wrapp').css({ "paddingRight": "" });
            window.scrollTo(0, pageScrollPosition);
        }
    });

    // ==========================================
    // ПЛАВНИЙ СКРОЛ ТА SCROLLSPY
    // ==========================================
    const navLinks = $(".menu .menu-item a"); // ПЕРЕВІРТЕ, ЧИ ЗБІГАЄТЬСЯ З ВАШИМ HTML!
    const sections = $(".scroll-section");
    let isScrollingByClick = false; // Прапорець для блокування ScrollSpy під час анімації

    const getHeaderHeight = () => $header.length ? $header.outerHeight() : 0;

    // Плавний скрол при кліку
    navLinks.on("click", function (e) {
        const targetId = $(this).attr("href");
        if (targetId === "#" || !targetId.startsWith("#")) return;

        const $targetSection = $(targetId);
        if ($targetSection.length) {
            e.preventDefault();
            
            // Включаємо блокування ScrollSpy
            isScrollingByClick = true;

            // Візуально підсвічуємо поточне посилання одразу
            navLinks.removeClass("active");
            $(this).addClass("active");

            const offsetPosition = $targetSection.offset().top - getHeaderHeight();
            
            $("html, body").animate({ scrollTop: offsetPosition }, 600, function() {
                // Після закінчення анімації (через 600мс) повертаємо ScrollSpy у роботу
                setTimeout(() => {
                    isScrollingByClick = false;
                }, 50);
            });
        }
    });

    // ScrollSpy через IntersectionObserver
    if (sections.length && navLinks.length) {
        const observerOptions = {
            root: null,
            rootMargin: `-${getHeaderHeight() + 20}px 0px -60% 0px`,
            threshold: 0
        };

        const observerCallback = (entries) => {
            // Якщо скрол викликаний кліком на меню — ігноруємо цей крок трекера
            if (isScrollingByClick) return; 

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.removeClass("active");
                    $(`.menu .menu-item a[href="#${id}"]`).addClass("active");
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.each(function() { observer.observe(this); });
    }
});