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