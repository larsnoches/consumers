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