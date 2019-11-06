"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _consumer = require("./consumer");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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