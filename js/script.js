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

});