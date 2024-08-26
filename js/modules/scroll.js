// Подключение функционала "Чертогов Фрилансера"
import { lockPaddingElements, scrollbarGutterValue, supportsScrollbarGutter } from '../modules/functions.js';
// import * as flsFunctions from '../modules/functions.js';
import { flsModules } from '../modules/modules.js';
// Модуль прокрутки к блоку
import { handleGotoLinks, isScrollingFromMenu } from '../modules/gotoblock.js';
// Переменная контроля добавления события window scroll.
let addWindowScrollEvent = false;

//====================================================================================================================================================================================================================================================================================================
// Плавная навигация по странице
export function pageNavigation() {
	// data-goto - указать ID блока #
	// data-goto-header - учитывать header
	// data-goto-top - не докрутить на указанный размер
	// data-goto-speed - скорость (только если используется доп плагин)

	// Работаем при клике на пункт
	// document.addEventListener('click', pageNavigationAction);

	// Если подключен scrollWatcher, подсвечиваем текущий пункт меню
	document.addEventListener('watcherCallback', pageNavigationAction);

	// Основная функция
	function pageNavigationAction(e) {
		if (e.type === 'watcherCallback' && e.detail && e.type !== 'click') {
			// console.debug('e.detail.entry.time', e.detail.entry.time);
			const entry = e.detail.entry;
			//console.debug('entry', entry); // IntersectionObserverEntry {time: 268.6000003814697, rootBounds: DOMRectReadOnly, boundingClientRect: DOMRectReadOnly, intersectionRect: DOMRectReadOnly, isIntersecting: false, …}
			const targetElement = entry.target;
			// console.debug('targetElement:', targetElement);

			// Обработка пунктов навигации, если указано значение navigator подсвечиваем текущий пункт меню
			if (targetElement.dataset.watch === 'navigator') {
				const navigatorActiveItem = document.querySelector(`[data-goto]._navigator-active`);
				// console.debug('navigatorActiveItem', navigatorActiveItem);

				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
					navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
					// console.debug('navigatorCurrentItem:', navigatorCurrentItem);
				} else if (targetElement.classList.length) {
					for (let index = 0; index < targetElement.classList.length; index++) {
						const element = targetElement.classList[index];
						if (document.querySelector(`[data-goto=".${element}"]`)) {
							navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
							break;
						}
					}
				}

				if (entry.isIntersecting) {
					// Видим объект
					// navigatorActiveItem ? navigatorActiveItem.classList.remove('_navigator-active') : null;
					// const activeItems = document.querySelectorAll('._navigator-active');
					// activeItems.length > 1 ? chooseOne(activeItems) : null

					// добавляем class="_navigator-active" к пункту меню
					navigatorCurrentItem ? navigatorCurrentItem.classList.add('_navigator-active') : null;
				} else if (!entry.isIntersecting) {
					// Не видим объект
					// удаляем class="_navigator-active" у пункта меню
					navigatorCurrentItem ? navigatorCurrentItem.classList.remove('_navigator-active') : null;
				}
			}
		}
	}
}

//=======================================================
// * Функция вычисления высоты шапки и добавления значения в data-scroll="" - Я, чтобы шапка показывалась когда прокрутится ниже блока hero-header
/* export const header = document.querySelector('.header');
export const heroBlock = document.querySelector('.hero'); */

export function updateDataScroll() {
	const header = document.querySelector('.header');
	const heroBlock = document.querySelector('.hero');
	const headerHeight = header.getBoundingClientRect().height;
	const heroBlockHeight = heroBlock.getBoundingClientRect().height;
	if (heroBlock && header) {
		// console.debug('Высота Header:', headerHeight.toFixed(2));
		// console.debug('Высота Hero:', heroBlockHeight.toFixed(2));
		// console.debug('Высота Hero - Header - 6:', (heroBlockHeight - headerHeight - 6).toFixed(2));
		header.setAttribute('data-scroll', (heroBlockHeight - headerHeight - 6).toFixed(2)); // -6 - чтобы при скроле к FEATURES шапка показалась
	}
}
// * Изначально установить значение высоты при которой появится шапка, в data-scroll='' - вызов в script.js
// updateDataScroll(); // - Я
window.onload = function () {
	// updateDataScroll(); // * потому что высота hero при первичной загрузке выше чем при перезагрузке, но тогда не работает в headerScroll - Я
};

// * Обновлять значение при изменении размера окна - Я
window.addEventListener('resize', updateDataScroll);

// Работа с шапкой при скроле
export function headerScroll() {
	updateDataScroll(); // * Я

	addWindowScrollEvent = true;
	const header = document.querySelector('header.header');
	const headerShow = header.hasAttribute('data-scroll-show');
	const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
	// const startPoint = header.dataset.scroll ? header.dataset.scroll : 1; // здесь не правильное значение из data-scroll
	let scrollDirection = 0;
	let timer;
	// console.debug('startPoint', startPoint);

	document.addEventListener('windowScroll', function (e) {
		const startPoint = header.dataset.scroll ? header.dataset.scroll : 1; // иначе не правильное значение из data-scroll

		const scrollTop = window.scrollY;
		console.debug('scrollTop', scrollTop);
		console.debug('startPoint', startPoint);

		clearTimeout(timer);

		// * удалить padding-right у header, который добавили в functions.js bodyLock - Я
		// if (supportsScrollbarGutter && scrollbarGutterValue === 'stable' && !header.classList.contains('_header-show')) {
		if (supportsScrollbarGutter && scrollbarGutterValue === 'stable') {
			if (!header.classList.contains('_header-show')) {
				header.style.paddingRight = '';
			}
		}

		if (scrollTop >= startPoint) {
			!header.classList.contains('_header-scroll') ? header.classList.add('_header-scroll') : null;

			if (headerShow) {
				if (scrollTop > scrollDirection) {
					// downscroll code
					header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
				} else {
					// upscroll code
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}
				timer = setTimeout(() => {
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}, headerShowTimer);

				// * Я
				// if (!header.classList.contains('_header-show')) {
				// 	lockPaddingElements.forEach(lockPaddingElement => {
				// 		lockPaddingElement.style.paddingRight = '';
				// 	});
				// }
			}
		} else {
			header.classList.contains('_header-scroll') ? header.classList.remove('_header-scroll') : null;
			if (headerShow) {
				header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
			}
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
// * Обновлять значение при изменении размера окна - Я
window.addEventListener('resize', headerScroll);

// При подключении модуля обработчик события запустится автоматически
setTimeout(() => {
	if (addWindowScrollEvent) {
		let windowScroll = new Event('windowScroll');
		window.addEventListener('scroll', function (e) {
			document.dispatchEvent(windowScroll);
		});
	}
}, 0);
