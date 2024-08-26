// Подключение функционала "Чертогов Фрилансера"
import { uniqArray, FLS } from './functions.js';
import { flsModules } from './modules.js';
import { handleGotoLinks, isScrollingFromMenu, focusTargetBlock } from './gotoblock.js';

// Наблюдатель объектов [всевидящее око]
// data-watch - можно писать значение для применения кастомного кода
// data-watch-root - родительский элемент внутри которого наблюдать за объектом
// data-watch-margin - отступ
// data-watch-threshold - процент показа объекта для срабатывания
// data-watch-once - наблюдать только один раз
// _watcher-view - класс, который добавляется при появлении объекта
// объектам наблюдения задать data-watch="navigator" для активных ссылок в header

// * Использование дебаунсинга для события resize: - Я
// Дебаунсинг позволяет уменьшить количество вызовов функции при частых событиях, таких как изменение размеров окна.
/* function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
} */

class ScrollWatcher {
	constructor(props) {
		let defaultConfig = {
			// подключаем вывод сообщений в console для наблюдателя
			logging: true,
		};

		this.config = Object.assign(defaultConfig, props);
		this.observer;
		!document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;

		// * Добавляем обработчик события resize - Я
		// Метод bind в JavaScript используется для привязки контекста вызова функции к определенному объекту.
		window.addEventListener('resize', this.updateThresholds.bind(this));

		// window.addEventListener('resize', () => this.updateThresholds());
		// Добавляем обработчик события resize с дебаунсингом
		// window.addEventListener('resize', debounce(this.updateThresholds.bind(this), 200));
	}

	// Обновляем конструктор
	scrollWatcherUpdate() {
		// Перезапускаем наблюдателя
		this.scrollWatcherRun();
	}

	// Запускаем конструктор - добавляем к html class="watcher"
	scrollWatcherRun() {
		document.documentElement.classList.add('watcher');

		// находим все блоки с data-watch - за которыми наблюдаем
		this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
	}

	// Конструктор наблюдателей
	scrollWatcherConstructor(items) {
		// console.debug('items', items);
		if (items.length) {
			// объекты с data-watch
			this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);

			// console.debug(`Высота окна ${window.innerHeight}`);

			// Уникализируем параметры
			let uniqParams = uniqArray(
				Array.from(items).map(function (item) {
					console.debug(item.id, item.offsetHeight);
					// Вычисление автоматического Threshold для объектов с data-watch="navigator"
					if (item.dataset.watch === 'navigator' && !item.dataset.watchThreshold) {
						let valueOfThreshold;
						// console.debug(`Высота блока ${item.classList[1]} ${item.clientHeight}`);

						if (item.clientHeight > 2) {
							valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
							if (valueOfThreshold > 1) {
								valueOfThreshold = 1;
							}
						} else {
							valueOfThreshold = 1;
						}
						// объектам наблюдения добавляем data-watch-threshold="valueOfThreshold" округленное до 2 цифр после запятой
						item.setAttribute('data-watch-threshold', valueOfThreshold.toFixed(2));
					}

					// возвращаем массив, проверив заданы ли другие параметры data-watch для объектов наблюдения
					return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
				})
			);

			// console.debug(`uniqParams - ${uniqParams}`); // (4) ['null|0px|0.78', 'null|0px|0.49', 'null|0px|0.67', 'null|0px|0.76']

			// Получаем группы объектов с одинаковыми параметрами,
			// создаем настройки, инициализируем наблюдатель
			uniqParams.forEach(uniqParam => {
				// создаем массив с параметрами для каждого объекта
				let uniqParamArray = uniqParam.split('|');
				// console.debug(`uniqParamArray - ${uniqParamArray}`);

				let paramsWatch = {
					root: uniqParamArray[0],
					margin: uniqParamArray[1],
					threshold: uniqParamArray[2],
				};

				let groupItems = Array.from(items).filter(function (item) {
					let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
					let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
					let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
					if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
						return item;
					}
				});

				let configWatcher = this.getScrollWatcherConfig(paramsWatch);

				// Инициализация наблюдателя со своими настройками
				this.scrollWatcherInit(groupItems, configWatcher);
			});
		} else {
			this.scrollWatcherLogging('Сплю, нет объектов для слежения. ZzzZZzz');
		}
	}

	//=======================================================
	// * Обновляем значение Threshold при изменении размера окна - Я
	updateThresholds() {
		const items = document.querySelectorAll('[data-watch="navigator"]');
		items.forEach(item => {
			if (!item.dataset.watchThreshold || item.dataset.watchThreshold) {
				let valueOfThreshold;
				// console.debug(`Обновление высоты блока ${item.classList[1]} ${item.clientHeight}`);

				if (item.clientHeight > 2) {
					valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
					if (valueOfThreshold > 1) {
						valueOfThreshold = 1;
					}
				} else {
					valueOfThreshold = 1;
				}
				item.setAttribute('data-watch-threshold', valueOfThreshold.toFixed(2));
			}
		});

		this.scrollWatcherUpdate();
		// Обновляем наблюдатель только для измененных элементов
		/* this.observer.disconnect();
		this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]')); */
	}

	//=======================================================
	// Функция создания настроек
	getScrollWatcherConfig(paramsWatch) {
		// Создаем настройки
		let configWatcher = {};

		// Родитель, в котором ведется наблюдение
		if (document.querySelector(paramsWatch.root)) {
			configWatcher.root = document.querySelector(paramsWatch.root);
		} else if (paramsWatch.root !== 'null') {
			this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
		}

		// Отступ срабатывания
		configWatcher.rootMargin = paramsWatch.margin;
		if (paramsWatch.margin.indexOf('px') < 0 && paramsWatch.margin.indexOf('%') < 0) {
			this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
			return;
		}

		// Точки срабатывания
		if (paramsWatch.threshold === 'prx') {
			// Режим параллакса
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1.0; i += 0.005) {
				paramsWatch.threshold.push(i);
			}
		} else {
			paramsWatch.threshold = paramsWatch.threshold.split(',');
		}
		configWatcher.threshold = paramsWatch.threshold;
		return configWatcher;
	}

	// Функция создания нового наблюдателя со своими настройками
	scrollWatcherCreate(configWatcher) {
		// console.debug(configWatcher); // {rootMargin: '0px', threshold: Array(1)->threshold: ['0.78']}

		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}

	// Функция инициализации наблюдателя со своими настройками
	scrollWatcherInit(items, configWatcher) {
		// Создание нового наблюдателя со своими настройками
		this.scrollWatcherCreate(configWatcher);
		// Передача наблюдателю элементов
		items.forEach(item => this.observer.observe(item));
	}

	// Функция обработки базовых действий точек срабатывания
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) {
			// Видим объект
			// Добавляем класс _watcher-view
			!targetElement.classList.contains('_watcher-view') ? targetElement.classList.add('_watcher-view') : null;
			this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
		} else {
			// Не видим объект
			// Убираем класс _watcher-view
			targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
			this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
		}
	}

	// Функция отключения слежения за объектом
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
		this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
	}

	// Функция вывода в консоль
	scrollWatcherLogging(message) {
		this.config.logging ? FLS(`[Наблюдатель]: ${message}`) : null;
	}

	// Функция обработки наблюдения
	/* scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		// Обработка базовых действий точек срабатывания
		this.scrollWatcherIntersecting(entry, targetElement);
		// Если есть атрибут data-watch-once убираем слежку
		targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
		// Создаем свое событие обратной связи
		document.dispatchEvent(
			new CustomEvent('watcherCallback', {
				detail: {
					entry: entry,
				},
			})
		);

		// // Выбираем нужные объекты
		// if (targetElement.dataset.watch === 'some value') {
		// 	// пишем уникальную специфику
		// }
		// if (entry.isIntersecting) {
		// 	// Видим объект
		// } else {
		// 	// Не видим объект
		// }
		
	} */

	// * Функция обработки наблюдения - Я
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;

		// Проверяем, изменился ли статус видимости объекта
		const wasVisible = targetElement.classList.contains('_watcher-view');
		const isVisible = entry.isIntersecting;

		// Если статус изменился, обрабатываем изменение
		if (isVisible !== wasVisible) {
			if (isVisible) {
				// Видим объект
				targetElement.classList.add('_watcher-view');
				this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);

				// * Я
				// console.debug('isScrollingFromMenu', 'false');
				if (!isScrollingFromMenu) {
					// console.debug('targetElement:', targetElement);
					//focusTargetBlock(targetElement); // резкий перескок в блок
					// targetElement.setAttribute('tabindex', '-1');
					// !targetElement.focus(); // резкий перескок в блок

					if (targetElement.classList.contains('hero')) {
						//focusTargetBlock(document.querySelector('.header'));
					}
				}
			} else {
				// Не видим объект
				targetElement.classList.remove('_watcher-view');
				this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
				targetElement.removeAttribute('tabindex'); // * Я
			}
		}

		// Если есть атрибут data-watch-once, и объект виден, перестаем следить
		if (targetElement.hasAttribute('data-watch-once') && isVisible) {
			this.scrollWatcherOff(targetElement, observer);
		}

		// Создаем событие обратной связи
		document.dispatchEvent(
			new CustomEvent('watcherCallback', {
				detail: {
					entry: entry,
				},
			})
		);
	}
}
// Запускаем и добавляем в объект модулей
flsModules.watcher = new ScrollWatcher({});
