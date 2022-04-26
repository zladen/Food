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
          modal = document.querySelector('.modal');
        //   modalCloseBtn = document.querySelector('[data-close]');

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
        //clearInterval(modalTimerId); // удаем автопоказа окна если пользователь сам открыл окно
    }
    
    // modalCloseBtn.addEventListener('click', closeModal);

    // закрытие окна при клике на подложку
    modal.addEventListener('click', (e) => { // вешаем обработчик событий
        if (e.target === modal || e.target.getAttribute('data-close') == '') { // проверям куда кликнул пользователь
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

    const modalTimerId = setTimeout(openModal, 50000);

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

    const getResource = async (url) => { // формаирование get запроса
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error (`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };
    // get запрос
    // getResource('http://localhost:3000/menu')
    //     .then(data => { // перебераем массив
    //         data.forEach(({img, altimg, title, descr, price}) => { //  lделаем деструктуризацию
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render(); // передаем свойства в конструктор
    //         });
    //     });

    // второй вариант динамического создание верстки
    getResource('http://localhost:3000/menu')
        .then(data => createCard(data));// вызов ф-ции

    function createCard(data) { // ф-я получает массив
        data.forEach(({img, altimg, title, descr, price}) => { // перебор массива и разбора на свойства
            const element = document.createElement('div'); // создание блока
            element.classList.add('menu__item'); // доавление класса
            element.innerHTML = ` 
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>
            
            `; // создание верстки

            document.querySelector('.menu .container').append(element); // размещение верстки на странице
        });
    }

    
    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const PostData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST", // формируем метод запроса
            headers: { // указываем заголовки
                'content-type': 'application/json'
            },
            body: data // отправляем форму
        });
        return await res.json();
    };


    function bindPostData (form) { // обработчик событий
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // отмена поведения браузера

            let statusMessage = document.createElement('img'); // блок для показа сообщения
            statusMessage.src = message.loading; // добавляем классы блоку
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // form.appendChild(statusMessage); // добавляем сообщение к форме
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form); // сбор данных с форм
            
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            PostData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data); // проверка себя
                showTanksModal(message.success);
                statusMessage.remove(); // удаление сообщения
            }).catch(() => {
                showTanksModal(message.failure);
            }).finally(() => {
                form.reset(); // очистка данных с формы
            });             
        });
    }

    function showTanksModal(message) { // новое окно 
        const prevModalDialog = document.querySelector('.modal__dialog'); // получаем елемент
        prevModalDialog.classList.add('hide'); // // добавляем класс
        openModal(); // открываем окно

        const thanksModal = document.createElement('div'); // создаем блок
        thanksModal.classList.add('modal__dialog'); // добавляем класс
        thanksModal.innerHTML = ` 
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `; // добавляем html конструкцию

        document.querySelector('.modal').append(thanksModal); // размещаем элемент на странице
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal(); // закрываем окно
        }, 4000); // сбрасываем форму
    }
    
    //НАЙТИ нормамальный git ignore
    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));

});


