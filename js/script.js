import * as flsFunctions from './modules/functions.js';

/* 
	Наблюдатель за объектами с атрибутом data-watch
	Документация: https://template.fls.guru/template-docs/modul-nabljudatel-za-poyavleniem-elementa-pri-skrolle.html 
*/
import './modules/watcher.js';

/* Функции работы скроллом */
import * as flsScroll from './modules/scroll.js';

/* Модуль "Попапы" */
import './modules/popup.js';

document.addEventListener('DOMContentLoaded', function () {
	// Включить/выключить FLS (Full Logging System) (в работе)
	window['FLS'] = true;

	// Модуль для работы с меню (Бургер)
	// Обработка клика вне меню и burger icon - Я
	document.addEventListener('click', function (e) {
		// иконка бургер
		const iconMenu = document.querySelector('.icon-menu');
		// ссылка меню, по которой был клик
		const clickedLink = e.target.closest('.menu__link');
		// само выпадающее меню
		const menuList = e.target.closest('.menu__list');

		// Проверяем, был ли клик выполнен вне ссылки меню, вне burger icon и вне span внутри элемента iconMenu
		if (!clickedLink && e.target !== iconMenu && !iconMenu.contains(e.target) && !menuList) {
			// если выпадающее меню открыто
			if (document.documentElement.classList.contains('menu-open')) {
				// закрываем меню, убираем блокировку
				flsFunctions.menuClose();
				// tabindex на menu__link и aria-expanded на iconMenu
				flsFunctions.hideMenu();
			}
		}
	});

	flsFunctions.menuInit();

	/* 
		Плавная навигация по странице
		Документация: https://template.fls.guru/template-docs/modul-plavnoj-navigacii-po-stranice.html 
	*/
	flsScroll.pageNavigation();

	/* 
		Функционал добавления классов к хедеру при прокрутке _header-scroll _header-show
		Документация: https://template.fls.guru/template-docs/modul-dobavleniya-klassov-k-shapke-pri-prokrutke-stranicy.html 
	*/

	//flsScroll.updateDataScroll(); // * Изначально установить значение высоты прокрутки, при которой появится шапка, в data-scroll='' - Я
	flsScroll.headerScroll();

	//=======================================================
	document.addEventListener('click', function (e) {
		// console.debug(e.target);
	});
	document.addEventListener('focusin', e => {
		// console.log(`Элемент ${e.target.className} получил фокус`);
	});
});
