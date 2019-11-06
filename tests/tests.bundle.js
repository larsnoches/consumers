(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsumerKind = void 0;
var ConsumerKind;
exports.ConsumerKind = ConsumerKind;

(function (ConsumerKind) {
  ConsumerKind[ConsumerKind["Person"] = 1] = "Person";
  ConsumerKind[ConsumerKind["Organisation"] = 2] = "Organisation";
})(ConsumerKind || (exports.ConsumerKind = ConsumerKind = {}));
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _consumer = require("./consumer");

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var ConsumerModalForm =
/*#__PURE__*/
function () {
  function ConsumerModalForm(targetElement, notifySubmit, notifyCancel, notifyRemove) {
    _classCallCheck(this, ConsumerModalForm);

    this.$modalElement = null; // элемент, созданный после методов openNewConsumer или openEditConsumer

    this.consumer = null; // объект покупателя

    this.$targetElement = targetElement;
    this.notifySubmit = notifySubmit;
    this.notifyCancel = notifyCancel;
    this.notifyRemove = notifyRemove; // Инициализация

    this.createTemplate = this.createTemplate.bind(this);
    this.createNameControl = this.createNameControl.bind(this);
    this.createNumControl = this.createNumControl.bind(this);
    this.createKindControl = this.createKindControl.bind(this);
    this.createAddButtonsBar = this.createAddButtonsBar.bind(this);
    this.createEditButtonsBar = this.createEditButtonsBar.bind(this);
    this.openNewConsumer = this.openNewConsumer.bind(this);
    this.openEditConsumer = this.openEditConsumer.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onCancelBtnClick = this.onCancelBtnClick.bind(this);
    this.onRemoveBtnClick = this.onRemoveBtnClick.bind(this);
  } // Метод создания общего шаблона модальной формы


  _createClass(ConsumerModalForm, [{
    key: "createTemplate",
    value: function createTemplate(headerText) {
      var elements = []; // темный фон

      var $modal = $('<div />', {
        'class': 'modal'
      });
      elements.push($modal); // рамка формы

      var $modalContent = $('<div />', {
        'class': 'modal-content'
      });
      elements.push($modalContent); // кнопка закрытия

      var $modalCloseButton = $('<span />', {
        'class': 'modal-close-button',
        html: '&times;',
        click: this.onCancelBtnClick
      });
      elements.push($modalCloseButton); // заголовок формы

      var $modalHeader = $('<h2 />', {
        'class': 'modal-header',
        text: headerText
      });
      elements.push($modalHeader); // форма, настройка валидации

      var $modalForm = $('<form />', {
        'id': 'modal-form'
      });
      $modalForm.validate({
        rules: {
          name: {
            required: true,
            maxlength: 255
          },
          num: {
            required: true,
            minlength: 13,
            maxlength: 13,
            digits: true
          }
        },
        messages: {
          name: {
            required: 'Имя нужно заполнить',
            maxlength: 'Число символов не должно превышать 255'
          },
          num: {
            required: 'Номер нужно заполнить',
            minlength: 'Номер должен состоять из 13 символов',
            maxlength: 'Номер должен состоять из 13 символов',
            digits: 'Это могут быть только цифры'
          }
        },
        errorClass: 'wrong',
        errorElement: 'em',
        submitHandler: this.onSubmitForm
      });
      elements.push($modalForm); // подготовка места для будущих строк - элементов формы

      var $modalFormColumn = $('<div />', {
        'class': 'column noguts'
      });
      elements.push($modalFormColumn);
      var $modalFormControlRow = $('<div />', {
        'class': 'row'
      });
      elements.push($modalFormControlRow);
      var $modalFormControlColumn = $('<div />', {
        'class': 'column'
      });
      elements.push($modalFormControlColumn);
      return elements;
    } // Метод создания элемента формы - Имя покупателя

  }, {
    key: "createNameControl",
    value: function createNameControl($modalFormControlRow, $modalFormControlColumn, value) {
      var $mfControlRowName = $modalFormControlRow.clone(true);
      var $mfControlColumnName = $modalFormControlColumn.clone(true);
      var $nameLabel = $('<label />', {
        'class': 'form-control',
        'for': 'name',
        text: 'Имя покупателя'
      });
      var $nameInput = $('<input />', {
        'class': 'form-control',
        'id': 'name',
        'name': 'name',
        'type': 'text',
        'value': value
      });
      $mfControlColumnName.append($nameLabel, $nameInput);
      $mfControlRowName.append($mfControlColumnName);
      return $mfControlRowName;
    } // Метод создания элемента формы - Номер покупателя

  }, {
    key: "createNumControl",
    value: function createNumControl($modalFormControlRow, $modalFormControlColumn, value) {
      var $mfControlRowNum = $modalFormControlRow.clone(true);
      var $mfControlColumnNum = $modalFormControlColumn.clone(true);
      var $numLabel = $('<label />', {
        'class': 'form-control',
        'for': 'num',
        text: 'Номер покупателя'
      });
      var $numInput = $('<input />', {
        'class': 'form-control',
        'id': 'num',
        'name': 'num',
        'type': 'text',
        'value': value
      });
      $mfControlColumnNum.append($numLabel, $numInput);
      $mfControlRowNum.append($mfControlColumnNum);
      return $mfControlRowNum;
    } // Метод создания элемента формы - Тип покупателя
    // выполняется перебор типов покупателей
    // принято за истину, что типов всего два

  }, {
    key: "createKindControl",
    value: function createKindControl($modalFormControlRow, $modalFormControlColumn, value) {
      var $mfControlRowKind = $modalFormControlRow.clone(true);
      var $mfControlColumnKind = $modalFormControlColumn.clone(true);
      var $kindLabel = $('<label />', {
        'class': 'form-control',
        'for': 'kind',
        text: 'Тип'
      });
      var $kindSelect = $('<select />', {
        'class': 'form-control',
        'id': 'kind',
        'name': 'kind'
      });
      var kinds = Object.keys(_consumer.ConsumerKind).filter(function (key) {
        return !isNaN(Number(_consumer.ConsumerKind[key]));
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = kinds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var kind = _step.value;
          var $kindOption = $('<option />', {
            'value': _consumer.ConsumerKind[kind],
            text: kind === 'Person' ? 'Физическое лицо' : 'Юридическое лицо'
          });

          if (value == _consumer.ConsumerKind[kind]) {
            $kindOption.attr('selected', 'selected');
          }

          $kindSelect.append($kindOption);
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

      $mfControlColumnKind.append($kindLabel, $kindSelect);
      $mfControlRowKind.append($mfControlColumnKind);
      return $mfControlRowKind;
    } // Метод создания элемента с кнопками Отмена и Добавить

  }, {
    key: "createAddButtonsBar",
    value: function createAddButtonsBar($modalFormControlRow, $modalFormControlColumn) {
      var $mfControlRowButtons = $modalFormControlRow.clone(true);
      var $mfControlColumnCancelBtn = $modalFormControlColumn.clone(true);
      var $mfControlColumnSubmitBtn = $modalFormControlColumn.clone(true);
      var $cancelBtn = $('<button />', {
        'class': 'button button-blue form-button',
        text: 'Отмена',
        click: this.onCancelBtnClick
      });
      $mfControlColumnCancelBtn.append($cancelBtn);
      var $submitBtn = $('<button />', {
        'class': 'button form-button',
        'type': 'submit',
        text: 'Добавить'
      });
      $mfControlColumnSubmitBtn.append($submitBtn);
      $mfControlRowButtons.append($mfControlColumnCancelBtn, $mfControlColumnSubmitBtn);
      return $mfControlRowButtons;
    } // Метод создания и открытия модального окна добавления нового покупателя

  }, {
    key: "openNewConsumer",
    value: function openNewConsumer() {
      // Генерация общего шаблона формы
      var _this$createTemplate = this.createTemplate('Новый покупатель'),
          _this$createTemplate2 = _slicedToArray(_this$createTemplate, 8),
          $modal = _this$createTemplate2[0],
          $modalContent = _this$createTemplate2[1],
          $modalCloseButton = _this$createTemplate2[2],
          $modalHeader = _this$createTemplate2[3],
          $modalForm = _this$createTemplate2[4],
          $modalFormColumn = _this$createTemplate2[5],
          _$modalFormControlRow = _this$createTemplate2[6],
          _$modalFormControlColumn = _this$createTemplate2[7]; // Элемент формы - Имя покупателя


      var $nameControl = this.createNameControl(_$modalFormControlRow, _$modalFormControlColumn); // Элемент формы - Номер покупателя

      var $numControl = this.createNumControl(_$modalFormControlRow, _$modalFormControlColumn); // Элемент формы - Тип покупателя

      var $kindControl = this.createKindControl(_$modalFormControlRow, _$modalFormControlColumn); // Элементы формы - Кнопки отмены и отправки

      var $buttonsBar = this.createAddButtonsBar(_$modalFormControlRow, _$modalFormControlColumn); // Включение строк в общий шаблон

      $modalFormColumn.append($nameControl, $numControl, $kindControl, $buttonsBar).appendTo($modalForm);
      $modalContent.append($modalCloseButton, $modalHeader, $modalForm);
      $modal.append($modalContent);
      this.$modalElement = $modal;
      this.$targetElement.append($modal);
    } // Метод создания элемента с кнопками Удалить и Сохранить

  }, {
    key: "createEditButtonsBar",
    value: function createEditButtonsBar($modalFormControlRow, $modalFormControlColumn) {
      var $mfControlRowButtons = $modalFormControlRow.clone(true);
      var $mfControlColumnRemoveBtn = $modalFormControlColumn.clone(true);
      var $mfControlColumnSubmitBtn = $modalFormControlColumn.clone(true);
      var $removeBtn = $('<button />', {
        'class': 'button button-blue form-button',
        text: 'Удалить',
        click: this.onRemoveBtnClick
      });
      $mfControlColumnRemoveBtn.append($removeBtn);
      var $submitBtn = $('<button />', {
        'class': 'button form-button',
        'type': 'submit',
        text: 'Сохранить'
      });
      $mfControlColumnSubmitBtn.append($submitBtn);
      $mfControlRowButtons.append($mfControlColumnRemoveBtn, $mfControlColumnSubmitBtn);
      return $mfControlRowButtons;
    } // Метод создания и открытия модального окна редактирования покупателя

  }, {
    key: "openEditConsumer",
    value: function openEditConsumer(consumer) {
      // Генерация общего шаблона формы
      var _this$createTemplate3 = this.createTemplate('Редактирование'),
          _this$createTemplate4 = _slicedToArray(_this$createTemplate3, 8),
          $modal = _this$createTemplate4[0],
          $modalContent = _this$createTemplate4[1],
          $modalCloseButton = _this$createTemplate4[2],
          $modalHeader = _this$createTemplate4[3],
          $modalForm = _this$createTemplate4[4],
          $modalFormColumn = _this$createTemplate4[5],
          _$modalFormControlRow = _this$createTemplate4[6],
          _$modalFormControlColumn = _this$createTemplate4[7];

      var $idControl = $('<input />', {
        'id': 'id',
        'name': 'id',
        'type': 'hidden',
        'value': consumer.id
      }); // Элемент формы - Имя покупателя

      var $nameControl = this.createNameControl(_$modalFormControlRow, _$modalFormControlColumn, consumer.name); // Элемент формы - Номер покупателя

      var $numControl = this.createNumControl(_$modalFormControlRow, _$modalFormControlColumn, consumer.num); // Элемент формы - Тип покупателя

      var $kindControl = this.createKindControl(_$modalFormControlRow, _$modalFormControlColumn, consumer.kind); // Элементы формы - Кнопки отмены и отправки

      var $buttonsBar = this.createEditButtonsBar(_$modalFormControlRow, _$modalFormControlColumn); // Включение строк в общий шаблон

      $modalFormColumn.append($idControl, $nameControl, $numControl, $kindControl, $buttonsBar).appendTo($modalForm);
      $modalContent.append($modalCloseButton, $modalHeader, $modalForm);
      $modal.append($modalContent);
      this.$modalElement = $modal;
      this.$targetElement.append($modal);
      this.consumer = consumer;
    } // Обработчик нажатия кнопки Добавить/Изменить
    // Происходит вызов callback функции

  }, {
    key: "onSubmitForm",
    value: function onSubmitForm(form, ev) {
      ev.preventDefault();
      var data = $(form).serializeArray().reduce(function (a, b) {
        if (b.name !== 'num') {
          a[b.name] = !isNaN(Number(b.value)) ? parseInt(b.value) : b.value;
        } else {
          a[b.name] = b.value;
        }

        return a;
      }, {});
      this.$modalElement.remove();
      this.notifySubmit(data);
    } // Обработчик нажатия кнопки удаления
    // Происходит вызов callback функции

  }, {
    key: "onRemoveBtnClick",
    value: function onRemoveBtnClick(ev) {
      ev.preventDefault();
      this.$modalElement.remove();
      this.notifyRemove(this.consumer.id);
    } // Обработчик нажатия кнопки отмены
    // Происходит вызов callback функции

  }, {
    key: "onCancelBtnClick",
    value: function onCancelBtnClick(ev) {
      ev.preventDefault();
      this.consumer = null;
      this.$modalElement.remove();
      this.notifyCancel();
    }
  }]);

  return ConsumerModalForm;
}();

var _default = ConsumerModalForm;
exports.default = _default;
},{"./consumer":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _consumer = require("./consumer");

var _urls = require("./urls");

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
} // Список объектов покупателей


var ConsumerList =
/*#__PURE__*/
function () {
  function ConsumerList(notifyUpdate, notifyAdd, notifyEdit, notifyRemove) {
    _classCallCheck(this, ConsumerList);

    this.consumers = []; // Массив покупателей

    this.xhr = new XMLHttpRequest(); // Объект сетевого взаимодействия

    this.notifyUpdate = notifyUpdate;
    this.notifyAdd = notifyAdd;
    this.notifyEdit = notifyEdit;
    this.notifyRemove = notifyRemove; // Инициализация

    this.updateConsumers = this.updateConsumers.bind(this);
    this.onLoadConsumers = this.onLoadConsumers.bind(this);
    this.notifyAboutUpdateConsumers = this.notifyAboutUpdateConsumers.bind(this);
    this.add = this.add.bind(this);
    this.onLoadConsumerAdd = this.onLoadConsumerAdd.bind(this);
    this.notifyAboutAdd = this.notifyAboutAdd.bind(this);
    this.edit = this.edit.bind(this);
    this.onLoadConsumerEdit = this.onLoadConsumerEdit.bind(this);
    this.notifyAboutEdit = this.notifyAboutEdit.bind(this);
    this.remove = this.remove.bind(this);
    this.onLoadConsumerRemove = this.onLoadConsumerRemove.bind(this);
    this.notifyAboutRemove = this.notifyAboutRemove.bind(this);
  } // Метод получения массива покупателей


  _createClass(ConsumerList, [{
    key: "updateConsumers",
    value: function updateConsumers() {
      if (!_urls.CONSUMERS_URL) {
        // не заполнен url, используем синтетические данные
        var consumers = [];
        var names = ['Thomas Jeffrey Hanks', 'Sir Philip Anthony Hopkins', 'Timothy Peter Dalton', 'Robert Anthony De Niro', 'Kurt Russell'];
        var nums = ['1284154332210', '1283154562210', '1283154562210', '1283199022210', '1288985783210'];

        for (var i = 0; i < 5; i++) {
          var cons = {
            id: i,
            kind: i % 2 === 0 ? _consumer.ConsumerKind.Person : _consumer.ConsumerKind.Organisation,
            name: names[i],
            num: nums[i]
          };
          consumers.push(cons);
        }

        consumers.sort(function (a, b) {
          if (a.name > b.name) {
            return 1;
          } else if (a.name < b.name) {
            return -1;
          }

          return 0;
        });
        this.consumers = [].concat(consumers);
        this.notifyAboutUpdateConsumers();
        return;
      }

      if (this.xhr.readyState > 0 || this.xhr.readyState < 4) {
        this.xhr.abort();
      }

      this.xhr.open('get', _urls.CONSUMERS_URL, true);
      this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      this.xhr.addEventListener('load', this.onLoadConsumers);
      this.xhr.send();
    } // Обработка успешного ответа сервера на запрос получения массива покупателей

  }, {
    key: "onLoadConsumers",
    value: function onLoadConsumers(ev) {
      var data = this.xhr.responseText;

      if (!data || typeof data === 'undefined') {
        return;
      }

      var consumers = JSON.parse(data);

      if (!consumers || typeof consumers === 'undefined') {
        return;
      }

      consumers = consumers.map(function (currentValue) {
        if (typeof currentValue.kind === 'string') {
          currentValue.kind = parseInt(currentValue.kind);
        }

        return currentValue;
      });
      consumers.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }

        return 0;
      });
      this.consumers = _toConsumableArray(consumers);
      this.notifyAboutUpdateConsumers();
    } // Вызов callback функции оповещения получения массива покупателей

  }, {
    key: "notifyAboutUpdateConsumers",
    value: function notifyAboutUpdateConsumers() {
      this.notifyUpdate(this.consumers);
    } // Метод добавления покупателя, принимает новый объект без id

  }, {
    key: "add",
    value: function add(consumer) {
      if (!_urls.CREATE_CONSUMER_URL) {
        // не заполнен url, переходим сразу к добавлению
        consumer.id = this.count + 1;
        this.consumers.push(consumer);
        this.notifyAboutAdd(consumer);
        return;
      }

      if (this.xhr.readyState > 0 || this.xhr.readyState < 4) {
        this.xhr.abort();
      }

      this.xhr.open('post', _urls.CREATE_CONSUMER_URL, true);
      this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      this.xhr.addEventListener('load', this.onLoadConsumerAdd);
      this.xhr.send(JSON.stringify(consumer));
    } // Обработка успешного ответа сервера на запрос добавления покупателя

  }, {
    key: "onLoadConsumerAdd",
    value: function onLoadConsumerAdd(ev) {
      var data = this.xhr.responseText;

      if (!data || typeof data === 'undefined') {
        return;
      }

      var consumer = JSON.parse(data);

      if (!consumer || typeof consumer === 'undefined') {
        return;
      }

      if (consumer.id && typeof consumer.id !== 'undefined' && consumer.id > 0) {
        if (typeof consumer.kind === 'string') {
          consumer.kind = parseInt(consumer.kind);
        }

        this.consumers.push(consumer);
        this.notifyAboutAdd(consumer);
      }
    } // Вызов callback функции оповещения добавления покупателя

  }, {
    key: "notifyAboutAdd",
    value: function notifyAboutAdd(consumer) {
      this.notifyAdd(consumer);
    } // Метод изменения покупателя, принимает измененный объект

  }, {
    key: "edit",
    value: function edit(consumer) {
      if (!_urls.EDIT_CONSUMER_URL) {
        // не заполнен url, переходим сразу к изменению
        var index = -1;

        for (var i = 0; i < this.consumers.length; i++) {
          if (this.consumers[i].id === consumer.id) {
            index = i;
            break;
          }
        }

        if (index > -1) {
          this.consumers.splice(index, 1, consumer);
          this.notifyAboutEdit(consumer);
        }

        return;
      }

      var found = this.consumers.some(function (currentConsumer, index, arr) {
        if (currentConsumer.id === consumer.id) {
          return true;
        }

        return false;
      });

      if (!found) {
        return;
      }

      if (this.xhr.readyState > 0 || this.xhr.readyState < 4) {
        this.xhr.abort();
      }

      this.xhr.open('post', _urls.EDIT_CONSUMER_URL, true);
      this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      this.xhr.addEventListener('load', this.onLoadConsumerEdit);
      this.xhr.send(JSON.stringify(consumer));
    } // Обработка успешного ответа сервера на запрос изменения покупателя

  }, {
    key: "onLoadConsumerEdit",
    value: function onLoadConsumerEdit(ev) {
      var data = this.xhr.responseText;

      if (!data || typeof data === 'undefined') {
        return;
      }

      var consumer = JSON.parse(data);

      if (!consumer || typeof consumer === 'undefined') {
        return;
      }

      if (consumer.id && typeof consumer.id !== 'undefined' && consumer.id > 0) {
        if (typeof consumer.kind === 'string') {
          consumer.kind = parseInt(consumer.kind);
        }

        var index = -1;

        for (var i = 0; i < this.consumers.length; i++) {
          if (this.consumers[i].id === consumer.id) {
            index = i;
            break;
          }
        }

        if (index > -1) {
          this.consumers.splice(index, 1, consumer);
          this.notifyAboutEdit(consumer);
        }
      }
    } // Вызов callback функции оповещения изменения

  }, {
    key: "notifyAboutEdit",
    value: function notifyAboutEdit(consumer) {
      this.notifyEdit(consumer);
    } // Удаление покупателя, принимает параметр id

  }, {
    key: "remove",
    value: function remove(id) {
      if (!_urls.REMOVE_CONSUMER_URL) {
        // не заполнен url, переходим сразу к удалению
        var index = -1;

        for (var i = 0; i < this.consumers.length; i++) {
          if (this.consumers[i].id === id) {
            index = i;
            break;
          }
        }

        if (index > -1) {
          this.consumers.splice(index, 1);
          this.notifyAboutRemove(id);
        }

        return;
      }

      var found = this.consumers.some(function (currentConsumer, index, arr) {
        if (currentConsumer.id === id) {
          return true;
        }

        return false;
      });

      if (!found) {
        return;
      }

      if (this.xhr.readyState > 0 || this.xhr.readyState < 4) {
        this.xhr.abort();
      }

      this.xhr.open('post', _urls.REMOVE_CONSUMER_URL, true);
      this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      this.xhr.addEventListener('load', this.onLoadConsumerRemove);
      var consumerForDelete = {
        id: id
      };
      this.xhr.send(JSON.stringify(consumerForDelete));
    } // Обработка успешного ответа сервера на запрос удаления покупателя

  }, {
    key: "onLoadConsumerRemove",
    value: function onLoadConsumerRemove(ev) {
      var data = this.xhr.responseText;

      if (!data || typeof data === 'undefined') {
        return;
      }

      var consumer = JSON.parse(data);

      if (!consumer || typeof consumer === 'undefined') {
        return;
      }

      if (consumer.id && typeof consumer.id !== 'undefined' && consumer.id > 0) {
        var index = -1;

        for (var i = 0; i < this.consumers.length; i++) {
          if (this.consumers[i].id === consumer.id) {
            index = i;
            break;
          }
        }

        if (index > -1) {
          this.consumers.splice(index, 1);
          this.notifyAboutRemove(consumer.id);
        }
      }
    } // Вызов callback функции оповещения удаления

  }, {
    key: "notifyAboutRemove",
    value: function notifyAboutRemove(id) {
      this.notifyRemove(id);
    } // Массив покупателей

  }, {
    key: "filterBase",
    get: function get() {
      return this.consumers;
    }
  }, {
    key: "count",
    get: function get() {
      return this.consumers.length;
    }
  }]);

  return ConsumerList;
}();

var _default = ConsumerList;
exports.default = _default;
},{"./consumer":1,"./urls":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REMOVE_CONSUMER_URL = exports.EDIT_CONSUMER_URL = exports.CREATE_CONSUMER_URL = exports.CONSUMERS_URL = void 0; // Адреса url для передачи данных
// Получение покупателей

var CONSUMERS_URL = null; // например, 'http://server/consumers';
// Создание покупателя

exports.CONSUMERS_URL = CONSUMERS_URL;
var CREATE_CONSUMER_URL = null; // например, 'http://server/consumers/create';
// Редактирование покупателя

exports.CREATE_CONSUMER_URL = CREATE_CONSUMER_URL;
var EDIT_CONSUMER_URL = null; // например, 'http://server/consumers/edit';
// Удаление покупателя

exports.EDIT_CONSUMER_URL = EDIT_CONSUMER_URL;
var REMOVE_CONSUMER_URL = null; // например, 'http://server/consumers/remove';

exports.REMOVE_CONSUMER_URL = REMOVE_CONSUMER_URL;
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _consumer = require("./consumer");

var _list = _interopRequireDefault(require("./list"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
} // Таблица-представление покупателей


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
},{"./consumer":1,"./list":3}],6:[function(require,module,exports){
"use strict";

var _form = _interopRequireDefault(require("./consumers/form"));

var _view = _interopRequireDefault(require("./consumers/view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// тест добавления покупателя через открытие модальной формы 
// и затем через имитацию нажатия на кнопку добавить
QUnit.test('add modal form open', function (assert) {
  // выбор элемента для включения строк таблицы-представления
  var $consumersTarget = $('#consumers-container');
  $consumersTarget.hide();
  var consumerView = new _view.default($consumersTarget, function () {}); // выбор элемента для включения модальной формы

  var $modalFormTarget = $('#modal-root');
  $modalFormTarget.hide();
  var consumerAddModal = new _form.default($modalFormTarget, function (consumer) {
    assert.notEqual(_typeof(consumer), 'undefined', 'Покупатель создан.');
    consumerView.addConsumer(consumer);
    assert.notEqual($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель добавлен.');
    assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма добавления закрыта.');
  }, null); // создание и открытие формы

  consumerAddModal.openNewConsumer();
  assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма добавления создана.');
  var consumer = {
    name: 'Tom',
    num: '1231231231231',
    kind: 1
  }; // заполнение данными полей формы

  $modalFormTarget.find('input[name="name"]').attr('value', consumer.name);
  $modalFormTarget.find('input[name="num"]').attr('value', consumer.num);
  $modalFormTarget.find('option[value="' + consumer.kind.toString() + '"]').attr('selected', 'selected');
  $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - добавить
}); // тест редактирования покупателя через открытие формы редактирования
// сначала создается форма добавления, потом имитируется нажатие на кнопку добавить
// и далее имитируется нажатие на строку таблицы для создания и открытия формы редактирования,
// а после имитации нажатия на кнопку сохранения происходит сравнение с исходными данными

QUnit.test('edit modal form open', function (assert) {
  // объект покупателя по умолчанию
  var defaultConsumer = {
    name: 'Tom',
    num: '1231231231231',
    kind: 1
  }; // выбор элемента для включения модальной формы

  var $modalFormTarget = $('#modal-root');
  $modalFormTarget.children().remove();
  $modalFormTarget.hide(); // выбор элемента для включение строк таблицы-представления

  var $consumersTarget = $('#consumers-container');
  $consumersTarget.children().remove();
  $consumersTarget.hide();
  var consumerView = new _view.default($consumersTarget, function (consumer) {
    assert.notEqual(_typeof(consumer), 'undefined', 'Произошло нажатие на строку таблицы-представления.');
    var consumerEditModal = new _form.default($modalFormTarget, function (anotherConsumer) {
      consumerView.editConsumer(anotherConsumer);
      var done = assert.async();
      setTimeout(function () {
        var $row = $('div.consumer-item', $consumersTarget).first();
        assert.equal($row.attr('data-name'), anotherConsumer.name, 'Имя сохранено.');
        assert.equal($row.attr('data-num'), anotherConsumer.num, 'Номер сохранен.');
        assert.equal($row.attr('data-kind'), anotherConsumer.kind, 'Тип сохранен.');
        assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма редактирования закрыта.');
        done();
      }, 1000);
    }, null, null); // создание и открытие формы редактирование

    consumerEditModal.openEditConsumer(consumer);
    assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма редактирования создана.'); // заполнение изменений объекта покупателя

    defaultConsumer.name = 'Toms';
    defaultConsumer.num = '1231231231232';
    defaultConsumer.kind = 2; // заполнение полей форм

    $modalFormTarget.find('input[name="name"]').attr('value', defaultConsumer.name);
    $modalFormTarget.find('input[name="num"]').attr('value', defaultConsumer.num);
    $modalFormTarget.find('option[value="' + defaultConsumer.kind.toString() + '"]').attr('selected', 'selected');
    $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - сохранить
  });
  var consumerAddModal = new _form.default($modalFormTarget, function (consumer) {
    assert.notEqual(_typeof(consumer), 'undefined', 'Покупатель создан.');
    consumerView.addConsumer(consumer);
    var done = assert.async();
    setTimeout(function () {
      assert.notEqual($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель добавлен.');
      assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма добавления закрыта.'); // имитация нажатия на строку таблицу-представление

      $('div.consumer-item', $consumersTarget).first().children('.consumer-item-name').click();
      done();
    }, 1000);
  }, null); // создание и открытие модальной формы

  consumerAddModal.openNewConsumer();
  assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма добавления создана.'); // заполнение полей формы из объекта покупателя по умолчанию

  $modalFormTarget.find('input[name="name"]').attr('value', defaultConsumer.name);
  $modalFormTarget.find('input[name="num"]').attr('value', defaultConsumer.num);
  $modalFormTarget.find('option[value="' + defaultConsumer.kind.toString() + '"]').attr('selected', 'selected');
  $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - добавить
}); // тест удаления покупателя 
// сначала создается и открывается форма добавления, 
// затем происходит имитация нажатия на строку таблицы для открытие формы редактирования
// и затем удаление покупателя имитацией нажатия на кнопку удалить в форме

QUnit.test('edit modal form open for remove', function (assert) {
  // объект покупателя по умолчанию
  var defaultConsumer = {
    name: 'Tom',
    num: '1231231231231',
    kind: 1
  }; // выборэлемента для включения модальной формы

  var $modalFormTarget = $('#modal-root');
  $modalFormTarget.children().remove();
  $modalFormTarget.hide(); // выбор элемента для включения строк таблицы-представления

  var $consumersTarget = $('#consumers-container');
  $consumersTarget.children().remove();
  $consumersTarget.hide();
  var consumerView = new _view.default($consumersTarget, function (consumer) {
    assert.notEqual(_typeof(consumer), 'undefined', 'Произошло нажатие на строку таблицы-представления.');
    var consumerEditModal = new _form.default($modalFormTarget, null, null, function (id) {
      consumerView.removeConsumer(id);
      var done = assert.async();
      setTimeout(function () {
        assert.equal($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель удален.');
        assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма редактирования закрыта.');
        done();
      }, 1000);
    }); // создание и открытие формы редактирования покупателя

    consumerEditModal.openEditConsumer(consumer);
    assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма редактирования создана.');
    $modalFormTarget.find('button.button-blue').click(); // имитация нажатия кнопки - удалить
  });
  var consumerAddModal = new _form.default($modalFormTarget, function (consumer) {
    assert.notEqual(_typeof(consumer), 'undefined', 'Покупатель создан.');
    consumerView.addConsumer(consumer);
    var done = assert.async();
    setTimeout(function () {
      assert.notEqual($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель добавлен.');
      assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма добавления закрыта.');
      $('div.consumer-item', $consumersTarget).first().children('.consumer-item-name').click(); // имитация нажатия на строку

      done();
    }, 1000);
  }, null); // создание и открытие формы добавления покупателя

  consumerAddModal.openNewConsumer();
  assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма добавления создана.'); // заполнение полей формы добавления данными по умолчанию

  $modalFormTarget.find('input[name="name"]').attr('value', defaultConsumer.name);
  $modalFormTarget.find('input[name="num"]').attr('value', defaultConsumer.num);
  $modalFormTarget.find('option[value="' + defaultConsumer.kind.toString() + '"]').attr('selected', 'selected');
  $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - добавить
});
},{"./consumers/form":2,"./consumers/view":5}]},{},[6]);
