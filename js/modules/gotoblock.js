// Подключение функционала "Чертогов Фрилансера"
import { menuClose, FLS, hideMenu, iconMenu } from '../modules/functions.js';
// Подключение дополнения для увеличения возможностей
// Документация: https://github.com/cferdinandi/smooth-scroll
// import SmoothScroll from 'smooth-scroll';
//==============================================================================================================================================================================================================================================================================================================================

// Модуль плавной прокрутки к блоку
/* export let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);

	// console.debug('targetBlock:', targetBlock);
	if (targetBlockElement) {
		let headerItem = '';
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = 'header.header';
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains('_header-scroll')) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add('_header-scroll');
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove('_header-scroll'); // ? зачем удалять
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else {
				headerItemHeight = headerElement.offsetHeight;
			}
		}
		let options = {
			speedAsDuration: true,
			speed: speed,
			header: headerItem,
			offset: offsetTop,
			easing: 'easeOutQuad',
		};
		// Закрываем меню, если оно открыто
		document.documentElement.classList.contains('menu-open') ? menuClose() : null;

		if (typeof SmoothScroll !== 'undefined') {
			// Прокрутка с использованием дополнения
			new SmoothScroll().animateScroll(targetBlockElement, '', options);
		} else {
			// Прокрутка стандартными средствами
			let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
			targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
			targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
			window.scrollTo({
				top: targetBlockElementPosition,
				behavior: 'smooth',
			});
		}
		FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
	} else {
		FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
	}
}; */
//=======================================================
// * Я
// установить tabindex -1 для блока к которому прокрутили из nav
// Событие blur срабатывает, когда элемент теряет фокус. Например, если элемент в фокусе и пользователь нажимает на другой элемент или на пустое место на странице, элемент теряет фокус, и срабатывает событие blur.
/* export function focusTargetBlock(block) {
	block.setAttribute('tabindex', '-1');
	block.focus();
	block.addEventListener(
		'blur',
		() => {
			block.removeAttribute('tabindex');
		},
		{ once: true }
	);
} */

// * установить tabindex -1 для блока к которому прокрутили из nav - Я
export function focusTargetBlock(block) {
	block.setAttribute('tabindex', '-1');
	// * при клике на Tab фокус на блоке - Я - не работает
	/* 	document.documentElement.addEventListener('keydown', function (e) {
		if (e.key === 'Tab') {
			e.preventDefault();
			block.focus();
		}
	}); */
	block.focus();
	block.addEventListener(
		'focusout',
		() => {
			block.removeAttribute('tabindex');
		},
		{ once: true }
	);
}

export let isScrollingFromMenu = false;

export function handleGotoLinks() {
	const gotoLinks = document.querySelectorAll('[data-goto]');
	const header = document.querySelector('.header');

	gotoLinks.forEach(gotoLink => {
		const targetId = gotoLink.getAttribute('data-goto');
		// console.debug('targetId:', targetId);
		const targetBlock = document.querySelector(targetId);

		// console.debug(targetId, targetBlock.getBoundingClientRect().top);

		gotoLink.addEventListener('click', function (e) {
			e.preventDefault();
			if (targetBlock) {
				// setTimeout(() => {
				isScrollingFromMenu = true;
				if (header) {
					const headerHeight = header.offsetHeight;
					// console.debug('headerHeight:', headerHeight);
					// Сохраняем текущую позицию прокрутки
					const currentScrollY = window.scrollY;
					// console.debug('currentScrollY', currentScrollY);

					const targetPosition = targetBlock.getBoundingClientRect().top + currentScrollY - headerHeight;

					// console.debug('targetPosition', targetPosition);

					if (document.documentElement.classList.contains('menu-open')) {
						// Закрываем меню, если оно открыто
						menuClose();
						// tabindex на menu__link и aria-expanded на iconMenu
						hideMenu();
					}

					// Устанавливаем фокус на целевом блоке
					focusTargetBlock(targetBlock);

					// Восстанавливаем позицию прокрутки после установки фокуса иначе не работает плавная прокрутка
					window.scrollTo({
						top: currentScrollY,
						behavior: 'auto',
					});

					// Плавная прокрутка до целевого блока только при условии, что пользователь не предпочитает уменьшенное движение
					if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
						// console.debug('targetPosition', targetPosition);
						window.scrollTo({
							top: targetPosition,
							behavior: 'smooth',
						});
					} else {
						// Если эффект анимации отключен использовать обычную прокрутку без плавности
						window.scrollTo(0, targetPosition);
					}

					// * Устанавливаем isScrollingFromMenu в false после завершения прокрутки - Я
					setTimeout(() => {
						isScrollingFromMenu = false;
					}, 100); // Используем таймер для задержки сброса, чтобы прокрутка завершилась
				} else {
					// если нет header
					targetBlock.scrollIntoView({ behavior: 'smooth' });
				}
				//}, 100); // Добавляем задержку
			}
		});

		// Добавляем обработчик события keydown на все ссылки внутри меню - Я
		gotoLink.addEventListener('keydown', function (e) {
			if (e.key !== 'Tab' && e.key !== 'Enter' && document.documentElement.classList.contains('menu-open')) {
				menuClose();
				hideMenu();
				iconMenu.focus();
				// document.documentElement.classList.remove('lock');
			}
		});
	});

	// Получаем ссылку на логотипы в header и footer
	const logoLinks = document.querySelectorAll('.logo');
	logoLinks.forEach(logo => {
		isScrollingFromMenu = false;
		// Добавляем обработчик события клика на логотип
		logo.addEventListener('click', function (e) {
			console.debug('click logo');
			e.preventDefault(); // Отменяем стандартное поведение ссылки

			// Плавно прокручиваем страницу вверх
			if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
			} else {
				window.scrollTo({
					top: 0,
					behavior: 'auto',
				});
			}

			// Устанавливаем фокус на заголовке (header)
			/*  header.setAttribute('tabindex', '-1');
			header.focus(); */
			focusTargetBlock(header);
		});
	});
}
handleGotoLinks();
