"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _consumer = require("./consumer");

var _list = _interopRequireDefault(require("./list"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Таблица-представление покупателей
var ConsumerView =
/*#__PURE__*/
function () {
  function ConsumerView($targetElement, notifyItemClick) {
    _classCallCheck(this, ConsumerView);

    this.showPerson = true; // Фильтр по Физическим лицам

    this.showOrganisation = true; // Фильтр по Юридическим лицам

    this.$targetElement = $targetElement;
    this.notifyItemClick = notifyItemClick; // Инициализация

    this.updateConsumerList = this.updateConsumerList.bind(this);
    this.filterConsumerList = this.filterConsumerList.bind(this);
    this.onUpdateConsumers = this.onUpdateConsumers.bind(this);
    this.onAddConsumer = this.onAddConsumer.bind(this);
    this.onEditConsumer = this.onEditConsumer.bind(this);
    this.onRemoveConsumer = this.onRemoveConsumer.bind(this);
    this.createOneRow = this.createOneRow.bind(this);
    this.addConsumer = this.addConsumer.bind(this);
    this.editConsumer = this.editConsumer.bind(this);
    this.removeConsumer = this.removeConsumer.bind(this);
    this.onItemClick = this.onItemClick.bind(this); // Создание объекта списка покупателей

    this.consumerList = new _list.default(this.onUpdateConsumers, this.onAddConsumer, this.onEditConsumer, this.onRemoveConsumer);
  } // Метод получения массива покупателей


  _createClass(ConsumerView, [{
    key: "updateConsumerList",
    value: function updateConsumerList() {
      this.consumerList.updateConsumers();
    } // Метод фильтрации

  }, {
    key: "filterConsumerList",
    value: function filterConsumerList(showPerson, showOrganisation) {
      this.showPerson = showPerson;
      this.showOrganisation = showOrganisation;
      this.onUpdateConsumers(this.consumerList.filterBase);
    } // Включение в таблицу нескольких $-объектов из массива consumer-объектов

  }, {
    key: "onUpdateConsumers",
    value: function onUpdateConsumers(consumers) {
      var consumerItems = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = consumers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var consumer = _step.value;

          if (consumer.kind === _consumer.ConsumerKind.Person && this.showPerson || consumer.kind === _consumer.ConsumerKind.Organisation && this.showOrganisation) {
            var $consumerItem = this.createOneRow(consumer);
            consumerItems.push($consumerItem);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.$targetElement.children('.row').remove(); // исключение прошлых строк

      if (consumerItems.length > 0) {
        this.$targetElement.append(consumerItems);
      }
    } // Метод добавления покупателя
    // вызывает соответствующий метод объекта списка покупателей

  }, {
    key: "addConsumer",
    value: function addConsumer(consumer) {
      this.consumerList.add(consumer);
    } // Обработчик события списка покупателей о добавлении покупателя
    // Происходит включение в таблицу новой строки

  }, {
    key: "onAddConsumer",
    value: function onAddConsumer(consumer) {
      // проверка на соответствие фильтру
      if (consumer.kind === _consumer.ConsumerKind.Person && this.showPerson || consumer.kind === _consumer.ConsumerKind.Organisation && this.showOrganisation) {
        var $consumerRow = this.createOneRow(consumer);
        this.$targetElement.append($consumerRow);
      }
    } // Получение строки из consumer-объекта

  }, {
    key: "createOneRow",
    value: function createOneRow(consumer) {
      var $consumerItem = $('<div />', {
        'class': 'row consumer-item',
        'data-id': consumer.id,
        'data-name': consumer.name,
        'data-kind': consumer.kind,
        'data-num': consumer.num,
        click: this.onItemClick
      });
      var $consumerItemName = $('<div />', {
        'class': 'column consumer-item-name',
        text: consumer.name
      });
      $consumerItem.append($consumerItemName);
      var $consumerItemKind = $('<div />', {
        'class': 'column column-10 consumer-item-kind',
        text: consumer.kind == _consumer.ConsumerKind.Person ? 'Ф' : 'Ю'
      });
      var $consumerItemKindTooltip = $('<span />', {
        'class': 'tooltip',
        text: consumer.kind == _consumer.ConsumerKind.Person ? 'Физическое лицо' : 'Юридическое лицо'
      });
      $consumerItemKind.append($consumerItemKindTooltip);
      $consumerItem.append($consumerItemKind);
      var $consumerItemNum = $('<div />', {
        'class': 'column column-30 consumer-item-num',
        text: consumer.num
      });
      $consumerItem.append($consumerItemNum);
      return $consumerItem;
    } // Обработчик нажатия на строку
    // Принято за истину, что у элемента строки всегда будут вложенные ячейки,
    // соответствующие полям объекта покупателя

  }, {
    key: "onItemClick",
    value: function onItemClick(ev) {
      var target = ev.target;
      var itemRow = $(target).parent(); // получение строки

      var consumer = {
        id: parseInt($(itemRow).attr('data-id')),
        name: $(itemRow).attr('data-name'),
        num: $(itemRow).attr('data-num'),
        kind: parseInt($(itemRow).attr('data-kind'))
      };
      this.notifyItemClick(consumer);
    } // Метод редактирования покупателя
    // вызывает соответствующий метод объекта списка покупателей

  }, {
    key: "editConsumer",
    value: function editConsumer(consumer) {
      this.consumerList.edit(consumer);
    } // Обработчик события списка покупателей об изменении покупателя
    // Происходит редактирование строки в таблице

  }, {
    key: "onEditConsumer",
    value: function onEditConsumer(consumer) {
      var $consumerItem = this.$targetElement.children('.consumer-item[data-id="' + consumer.id.toString() + '"]');

      if (typeof $consumerItem === 'undefined' || !$consumerItem || typeof $consumerItem.length === 'undefined' || $consumerItem.length === 0) {
        return;
      }

      if (consumer.kind === _consumer.ConsumerKind.Person && !this.showPerson || consumer.kind === _consumer.ConsumerKind.Organisation && !this.showOrganisation) {
        $consumerItem.remove(); // исключаем строку, т.к. она не входит в фильтр

        return;
      }

      $consumerItem.attr('data-name', consumer.name);
      $consumerItem.attr('data-kind', consumer.kind);
      $consumerItem.attr('data-num', consumer.num);
      var $consumerItemName = $consumerItem.children('.consumer-item-name');

      if (typeof $consumerItemName === 'undefined' || !$consumerItemName || typeof $consumerItemName.length === 'undefined' || $consumerItemName.length === 0) {
        return;
      }

      $consumerItemName.text(consumer.name);
      var $consumerItemKind = $consumerItem.children('.consumer-item-kind');

      if (typeof $consumerItemKind === 'undefined' || !$consumerItemKind || typeof $consumerItemKind.length === 'undefined' || $consumerItemKind.length === 0) {
        return;
      }

      $consumerItemKind.text(consumer.kind == _consumer.ConsumerKind.Person ? 'Ф' : 'Ю');
      var $consumerItemKindTooltip = $('<span />', {
        'class': 'tooltip',
        text: consumer.kind == _consumer.ConsumerKind.Person ? 'Физическое лицо' : 'Юридическое лицо'
      });
      $consumerItemKind.append($consumerItemKindTooltip);
      var $consumerItemNum = $consumerItem.children('.consumer-item-num');

      if (typeof $consumerItemNum === 'undefined' || !$consumerItemNum || typeof $consumerItemNum.length === 'undefined' || $consumerItemNum.length === 0) {
        return;
      }

      $consumerItemNum.text(consumer.num);
    } // Метод удаления покупателя
    // вызывает соответствующий метод объекта списка покупателей

  }, {
    key: "removeConsumer",
    value: function removeConsumer(id) {
      this.consumerList.remove(id);
    } // Обработчик события списка покупателей об удалении покупателя
    // Происходит удаление строки из таблицы

  }, {
    key: "onRemoveConsumer",
    value: function onRemoveConsumer(id) {
      var $consumer = this.$targetElement.children('.consumer-item[data-id="' + id.toString() + '"]');

      if (typeof $consumer !== 'undefined' && $consumer && typeof $consumer.length !== 'undefined' && $consumer.length > 0) {
        $consumer.remove();
      }
    }
  }]);

  return ConsumerView;
}();

var _default = ConsumerView;
exports.default = _default;