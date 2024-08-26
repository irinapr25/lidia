// FLS (Full Logging System)
export function FLS(message) {
	setTimeout(() => {
		if (window.FLS) {
			console.debug(message);
		}
	}, 0);
}

//=======================================================
// Уникализация массива
// функция uniqArray возвращает новый массив, содержащий только уникальные элементы исходного массива.
export function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

//=======================================================
// Вспомогательные модули блокировки прокрутки и скачка
export let bodyLockStatus = true;

// добавить/удалить class="lock" к html/document.documentElement
export let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		if (supportsScrollbarGutter && scrollbarGutterValue === 'stable' && header.classList.contains('_header-show')) {
			// если у html scrollbar-gutter: stable и у header с атрибутом есть class _header-scroll или header-show, который меняет position: absolute на fixed - Я
			// иначе при закрытии выпадающего меню иконка бургера уходит вправо. Это значение убирается в scroll.js -> windowScroll
			header.style.paddingRight = lockPaddingValue;
		}
		bodyLock(delay);
	}
};

// * Я
// * если для html задан scrollbar-gutter: stable;
export const supportsScrollbarGutter = CSS.supports('scrollbar-gutter', 'stable'); // * проверяем поддержку браузером - Я

// все элементы, у которых есть атрибут data-lp (если position: fixed)
export const lockPaddingElements = document.querySelectorAll('[data-lp]');

// ширина scroll-bar
// export const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
// Объявляем переменную вне функций
export let lockPaddingValue;

// Функция для обновления значения lockPaddingValue
function updateLockPaddingValue() {
	lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
	// console.log('Значение обновлено:', lockPaddingValue); // Для проверки
}

// Обновляем значение при загрузке страницы
updateLockPaddingValue();

// Обновляем значение при изменении размера окна
window.addEventListener('resize', updateLockPaddingValue);
//=======================================================

// удалить paddingRight (ширина scroll-bar) у body и у элементов с data-lp с задержкой
export let bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		// удалять с задержкой 500ms, чтобы резко не появлялся scroll-bar
		setTimeout(() => {
			// если браузер не поддерживает scrollbar-gutter: stable или не установлено значение stable
			if (!supportsScrollbarGutter || scrollbarGutterValue !== 'stable') {
				lockPaddingElements.forEach(lockPaddingElement => {
					lockPaddingElement.style.paddingRight = '';
				});
				document.body.style.paddingRight = '';
			} else if (supportsScrollbarGutter && scrollbarGutterValue === 'stable') {
				lockPaddingElements.forEach(lockPaddingElement => {
					// lockPaddingElement.style.paddingRight = 'gutterWidth';
					// lockPaddingElement.style.paddingRight = ''; // не подходит, т.к. иконка бургера уйдет влево
					// header.style.paddingRight = '';
				});
			}
			document.documentElement.classList.remove('lock');
		}, delay);

		bodyLockStatus = false;

		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};

// добавить paddingRight (ширина scroll-bar) к body и элементам с data-lp с задержкой
export let bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		// * если свойство scrollbar-gutter: stable не поддерживается браузером - Я
		if (!supportsScrollbarGutter || scrollbarGutterValue !== 'stable') {
			lockPaddingElements.forEach(lockPaddingElement => {
				lockPaddingElement.style.paddingRight = lockPaddingValue;
			});
			document.body.style.paddingRight = lockPaddingValue;
		} else if (supportsScrollbarGutter && scrollbarGutterValue === 'stable') {
			if (header.classList.contains('_header-show')) {
				// header.style.paddingRight = lockPaddingValue;
			} /*  else {
				lockPaddingElements.forEach(lockPaddingElement => {
					lockPaddingElement.style.paddingRight = lockPaddingValue;
				});
			} */
		}
		document.documentElement.classList.add('lock');
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};

//=======================================================
// Модуль работы с меню (бургер)
export function menuInit() {
	if (iconMenu) {
		// updateLockPaddingElements();
		document.addEventListener('click', function (e) {
			if (bodyLockStatus && e.target.closest('.icon-menu')) {
				bodyLockToggle();

				document.documentElement.classList.toggle('menu-open');
				updateTabindex();

				if (document.documentElement.classList.contains('menu-open')) {
					showMenu();

					/* // Находим первую ссылку в меню и устанавливаем на нее фокус
					if (firstMenuLink) {
						firstMenuLink.focus();
					} */
				} else {
					hideMenu();
				}
			}
		});

		// Обработчик события keydown на иконку меню - Я
		iconMenu.addEventListener('keydown', function (e) {
			// если tab по иконки меню, то не закрываем меню - бегаем по пунктам меню
			if (e.key === 'Tab' && htmlElement.classList.contains('menu-open') && document.activeElement === iconMenu) {
				e.preventDefault();
				if (firstMenuLink) {
					firstMenuLink.focus();
				}
			}
		});

		// при клике на Esc закрыть выпадающее меню - Я
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && htmlElement.classList.contains('menu-open')) {
				menuClose();
				hideMenu();
				// updateTabindex();
				iconMenu.focus();
			}
		});
	}
}

// добавить class="menu-open" к html-document.documentElement
export function menuOpen() {
	bodyLock();
	htmlElement.classList.add('menu-open');
}

// удалить class="menu-open" у html/document.documentElement
export function menuClose() {
	bodyUnlock();
	htmlElement.classList.remove('menu-open');
}

/* TABINDEX  - Я */
export const htmlElement = document.documentElement;
export const menuList = document.querySelector('.menu__list');
export const menuLinks = document.querySelectorAll('.menu__link');
export const iconMenu = document.querySelector('.icon-menu');
export const firstMenuLink = menuLinks[0];

/* export function hideMenu() {
	iconMenu.setAttribute('aria-expanded', 'false');
	// menuList.setAttribute('aria-hidden', 'true');
	menuLinks.forEach(link => {
		link.setAttribute('tabindex', '-1');
	});
} */
export function hideMenu() {
	if (iconMenu) {
		iconMenu.setAttribute('aria-expanded', 'false');
		menuList.setAttribute('aria-hidden', 'true');
	}
	if (menuLinks) {
		menuLinks.forEach(link => {
			link.setAttribute('tabindex', '-1');
		});
	}
}

/* export function showMenu() {
	iconMenu.setAttribute('aria-expanded', 'true');

	// menuList.setAttribute('aria-hidden', 'false');
	menuLinks.forEach(link => {
		link.setAttribute('tabindex', '0');
	});
} */
export function showMenu() {
	if (iconMenu) {
		iconMenu.setAttribute('aria-expanded', 'true');
		menuList.setAttribute('aria-hidden', 'false');
	}
	if (menuLinks) {
		menuLinks.forEach(link => {
			link.setAttribute('tabindex', '0');
		});
	}
}

export function updateTabindex() {
	if (window.innerWidth <= 767.98) {
		hideMenu();
	} else {
		showMenu();
	}
}

/* updateTabindex();
window.addEventListener('resize', updateTabindex); */
if (menuLinks.length > 0) {
	updateTabindex();
}
window.addEventListener('resize', updateTabindex);
//=======================================================
// получение зарезервированного значения под полосу прокрутки при html scrollbar-gutter: stable - Я
function getReservedScrollbarGutterForHtml() {
	// Создаем временный элемент для измерения
	const outer = document.createElement('div');
	const inner = document.createElement('div');

	// Устанавливаем стили для внешнего элемента
	outer.style.visibility = 'hidden'; // Скрываем элемент
	outer.style.overflow = 'scroll'; // Добавляем скроллбар
	outer.style.width = '100px'; // Устанавливаем фиксированную ширину
	outer.style.height = '100px'; // Устанавливаем фиксированную высоту
	outer.style.position = 'fixed'; // Скрываем элемент за пределами экрана
	outer.style.top = '0';
	outer.style.left = '0';

	// Устанавливаем стили для внутреннего элемента
	inner.style.width = '100%';
	inner.style.height = '200px'; // Высота больше, чтобы появился скроллбар

	// Добавляем внутренний элемент в внешний
	outer.appendChild(inner);
	document.documentElement.appendChild(outer); // Добавляем к <html>, а не <body>

	// Получаем ширину полосы прокрутки
	const scrollbarGutterWidth = outer.offsetWidth - inner.offsetWidth;
	// console.debug('outer.offsetWidth', outer.offsetWidth); // 100
	// console.debug('inner.offsetWidth', inner.offsetWidth); // 83

	// Удаляем временные элементы из DOM
	document.documentElement.removeChild(outer);

	return scrollbarGutterWidth;
}

// Использование функции
export const gutterWidth = getReservedScrollbarGutterForHtml();
// console.debug(`Ширина зарезервированного пространства для полосы прокрутки на уровне <html>: ${gutterWidth}px`);
//=======================================================
// Получаем вычисленные стили элемента html - Я
const computedStyle = window.getComputedStyle(htmlElement);

// Проверяем значение свойства scrollbar-gutter - Я
export const scrollbarGutterValue = computedStyle.getPropertyValue('scrollbar-gutter');
