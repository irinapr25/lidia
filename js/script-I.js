'use strict';

import * as functions from './modules/functions-I.js';
// import { addClassToElement, removeClassFromElements, handleMenuLinkClick } from './modules/class-action.js';
import { addClassToElement, removeClassFromElements } from './modules/class-action-I.js';
import { header, updateHeaderHeight, headerScroll } from './modules/scroll-I.js';

// Функции работы скроллом
import * as flsScroll from './modules/scroll-I.js';

document.addEventListener('DOMContentLoaded', function () {
	/* Активная ссылка */
	// Получаем все ссылки меню
	const menuLinks = document.querySelectorAll('.menu__link');
	// Определяем класс для активного состояния
	const activeClass = '--active';
	// console.debug(menuLinks);

	// Проверяем, что ссылки меню были найдены
	if (menuLinks) {
		menuLinks.forEach(link => {
			// Для каждой ссылки меню добавляем обработчик клика
			link.addEventListener('click', function (e) {
				// handleMenuLinkClick(e, menuLinks, activeClass);
				//e.preventDefault(); // отменяем переход по ссылке с перезагрузкой страницы

				// ссылка меню, по которой был клик
				const clickedLink = e.target.closest('.menu__link');

				if (clickedLink) {
					// удаляем активный класс у всех ссылок
					removeClassFromElements(menuLinks, activeClass);

					// добавляем активный класс ссылке, по которой был клик
					addClassToElement(clickedLink, activeClass);

					// закрываем выпадающее меню, если оно было открыто, убираем блокировку страницы
					if (document.documentElement.classList.contains('menu-open')) {
						// закрываем меню, убираем блокировку
						functions.menuClose();
					}
				}
			});
		});
	}

	/* Обработка клика вне меню и burger icon */
	document.addEventListener('click', function (e) {
		// иконка бургера
		const iconMenu = document.querySelector('.icon-menu');
		// ссылка меню, по которой был клик
		const clickedLink = e.target.closest('.menu__link');

		// Проверяем, был ли клик выполнен вне ссылки меню, вне burger icon и вне span внутри элемента iconMenu
		if (!clickedLink && e.target !== iconMenu && !iconMenu.contains(e.target)) {
			// if (!iconMenu && !iconMenu.contains(e.target)) {
			// если выпадающее меню открыто
			if (document.documentElement.classList.contains('menu-open')) {
				// закрываем меню, убираем блокировку
				functions.menuClose();
			}
		}
	});

	// Работа с шапкой при скроле - будет выполнена сразу при загрузке скрипта
	headerScroll();
	// функция headerScroll() будет вызываться каждый раз при изменении размера окна - Я
	window.addEventListener('resize', headerScroll);

	/* Модуль для работы с меню (Бургер) */
	functions.menuInit();

	//=======================================================
	/* Плавная навигация по странице */
	flsScroll.pageNavigation();

	//=======================================================
	/* 	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				console.debug(entry);
				if (entry.isIntersecting) {
					document.querySelectorAll('.menu__link').forEach(link => {
						let id = link.getAttribute('href').replace('#', '');
						// console.debug(id);
						if (id === entry.target.id) {
							link.classList.add('--active');
						} else {
							link.classList.remove('--active');
						}
					});
				}
			});
		},
		{
			// root: null,
			threshold: [0.25, 0.9],
		}
	);

	document.querySelectorAll('.section').forEach(section => {
		observer.observe(section);
	}); */

	//=======================================================
	// const header = document.querySelector('.header');
	// const headerHeight = header.getBoundingClientRect().height;
	let headerHeight;
	if (header) {
		headerHeight = header.getBoundingClientRect().height;
		console.debug(`высота шапки ${headerHeight}px`);
	}

	let observers = []; /* else {

	/* function createObserver(target, thresholds) {
		let options = {
			root: null,
			//rootMargin: `${headerHeight}px`, // Учитываем высоту шапки
			threshold: thresholds,
		}; */

	// let observer = new IntersectionObserver((entries, observer) => {
	// 	entries.forEach(entry => {
	// 		console.debug(entry);
	// 		if (entry.isIntersecting) {
	// 			console.log(`${entry.target.classList[0]} виден на ${entry.intersectionRatio * 100}%`);
	// 			document.querySelectorAll('.menu__link').forEach(link => {
	// 				let id = link.getAttribute('href').replace('#', '');
	// 				if (id === entry.target.id) {
	// 					link.classList.add('--active');
	// 				} else {
	// 					link.classList.remove('--active');
	// 				}
	// 			});
	// 		}

	// 			let id = entry.target.id;
	// 			document.querySelectorAll('.menu__link').forEach(link => {
	// 				if (link.getAttribute('href').replace('#', '') != id) {
	// 					link.classList.remove('--active');
	// 				}
	// 			});
	// 		} */
	/* 	});
		}, options);

		observer.observe(target);
		observers.push(observer);
	}
 */
	/* 	// Функция для обновления значений thresholds при resize
	function updateThresholds() {
		// Удаляем предыдущих наблюдателей
		observers.forEach(observer => observer.disconnect());
		observers = [];

		// Получить высоту окна
		let windowHeight = window.innerHeight;
		console.log(`высота окна ${windowHeight}px`);

		// Найти все элементы с классом 'section'
		document.querySelectorAll('.section').forEach(target => {
			// Получить высоту элемента
			// let targetHeight = target.offsetHeight;
			// console.debug(`высота элемента ${target.classList[0]} ${targetHeight}px`);

			// Установить пороговые значения в зависимости от высоты элемента
		// let thresholds;
		// 	if (targetHeight / 2 > windowHeight) {
		// 		//thresholds = [0, 0.1, 0.2]; // Пороговые значения для длинного элемента
		// 		thresholds = [0.1, 0.2];
		// 	} else if (targetHeight <= windowHeight) {
		// 		thresholds = [0.8];
		// 	} else {
		// 		thresholds = [0.4, 0.8]; // Пороговые значения для обычного элемента
		// 	} 

			let thresholds;
			if (target.clientHeight > 2) {
				thresholds = window.innerHeight / 2 / (target.clientHeight - 1);
				if (thresholds > 1) {
					thresholds = 1;
				}
			} else {
				thresholds = 1;
			}
			console.debug(`thresholds ${target.classList[0]} ${thresholds}`);

			// Создать и настроить IntersectionObserver для каждого элемента
			// createObserver(target, thresholds);
		});
	}
	// Инициализация при загрузке страницы
	updateThresholds();
	// Обновление thresholds при resize окна
	window.addEventListener('resize', () => {
		console.debug('resized');
		// Обновляем высоту шапки
		headerHeight = header.getBoundingClientRect().height;
		// headerHeight();
		console.debug(`новая высота шапки ${headerHeight}px`);

		// Вызываем функцию обновления thresholds
		updateThresholds();
	}); */
});
