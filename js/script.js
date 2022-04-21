'use strict';
// Tabs
// Оборачиваем весь контент DOMContentLoader
// Получаем элементы
window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    // склеиваем все табы

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active'); // удаляем класс активности
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade'); // Показываем табы
        tabsContent[i].classList.remove('hide'); 
        tabs[i].classList.add('tabheader__item_active'); // lдобавляем класс активности

    }

    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer
    const deadline = '2022-04-17';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 *24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <=0) {
                clearInterval(timeInterval);
            }
        }
              
    }
    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'), // получаем элемент по дата атрибутам
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');

    modalTrigger.forEach(btn => { 
        btn.addEventListener('click', openModal);  
    });  

    function closeModal() {
        modal.classList.add('hide'); // скрываем окно
        modal.classList.remove('show'); // удаляем класс показа окна
        // modal.classList.toggle('show'); // тоже самое только через тогле
        document.body.style.overflow = ''; // восстанавливаем скрол после закрытия окна 

    }

    function openModal() {
        modal.classList.add('show'); // показываем окно
        modal.classList.remove('hide'); // удаляем класс
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId); // удаем автопоказа окна если пользователь сам открыл окно
    }
    
    modalCloseBtn.addEventListener('click', closeModal);

    // закрытие окна при клике на подложку
    modal.addEventListener('click', (e) => { // вешаем обработчик событий
        if (e.target === modal) { // проверям куда кликнул пользователь
            // modal.classList.add('hide'); // скрываем окно
            // modal.classList.remove('show'); // удаляем класс показа окна
            // document.body.style.overflow = ''; // восстанавливаем скрол после закрытия окна 
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => { // вешаем обработчик событий на весь докум
        if (e.code === "Escape" && modal.classList.contains('show')) { // отлавливаем нажатие esc
            closeModal(); // вызываем ф-ю закрытия окна
        }

    });

    //const modalTimerId = setTimeout(openModal, 10000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        '.menu .container'
    ).render();

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });

    forms.forEach(item => {
        postData(item);
    });


    function postData (form) { // обработчик событий
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // отмена поведения браузера

            let statusMessage = document.createElement('div'); // блок для показа сообщения
            statusMessage.classList.add('status'); // добавляем классы блоку
            statusMessage.textContent = message.loading;
            form.appendChild(statusMessage); // добавляем сообщение к форме

            const request = new XMLHttpRequest(); // формирование запроса
            request.open('POST', 'server.php');
            request.setRequestHeader('content-type', 'application/json; charset=utf-8'); // заголовки отправлять не нужно
            const formData = new FormData(form); // сбор данных с форм

            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json); // отправляем запрос
             
            request.addEventListener('load', () => { // отслеживаем событие отправки данных
                if (request.status === 200) { // проверка статуса запроса
                    console.log(request.response); // проверка себя
                    statusMessage.textContent = message.success; // сообщение для пользователя что все ок
                    form.reset(); // очистка данных с формы
                    setTimeout(() => {
                        statusMessage.remove(); // удаление сообщения
                    }, 2000);

                } else {
                    statusMessage.textContent = message.failure;
                }

            });

        });
    }

});


