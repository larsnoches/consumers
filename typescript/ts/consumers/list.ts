/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
import { ConsumerKind, Consumer } from './consumer';
import { CONSUMERS_URL, CREATE_CONSUMER_URL, 
         EDIT_CONSUMER_URL, REMOVE_CONSUMER_URL } from './urls';


// Список объектов покупателей
class ConsumerList {
    private consumers: Consumer[] = []; // Массив покупателей
    private notifyUpdate: any; // Ссылка на обработчик события получения объектов покупателей
    private notifyAdd: any; // Ссылка на обработчик события добавления покупателя
    private notifyEdit: any; // Ссылка на обработчик события редактирования покупателя
    private notifyRemove: any; // Ссылка на обработчик события удаления покупателя
    private xhr = new XMLHttpRequest(); // Объект сетевого взаимодействия

    constructor(notifyUpdate: any, notifyAdd: any, notifyEdit: any, notifyRemove: any) {
        this.notifyUpdate = notifyUpdate;
        this.notifyAdd = notifyAdd;
        this.notifyEdit = notifyEdit;
        this.notifyRemove = notifyRemove;

        // Инициализация
        this.updateConsumers = this.updateConsumers.bind(this);
        this.onLoadConsumers = this.onLoadConsumers.bind(this);
        this.notifyAboutUpdateConsumers = this.notifyAboutUpdateConsumers.bind(this);
        this.add = this.add.bind(this);
        this.onLoadConsumerAdd= this.onLoadConsumerAdd.bind(this);
        this.notifyAboutAdd = this.notifyAboutAdd.bind(this);
        this.edit = this.edit.bind(this);
        this.onLoadConsumerEdit = this.onLoadConsumerEdit.bind(this);
        this.notifyAboutEdit = this.notifyAboutEdit.bind(this);
        this.remove = this.remove.bind(this);
        this.onLoadConsumerRemove = this.onLoadConsumerRemove.bind(this);
        this.notifyAboutRemove = this.notifyAboutRemove.bind(this);
    }



    // Метод получения массива покупателей
    public updateConsumers(): void {
        if (!CONSUMERS_URL) {
            // не заполнен url, используем синтетические данные
            let consumers = [];

            let names = [
                'Thomas Jeffrey Hanks', 
                'Sir Philip Anthony Hopkins',
                'Timothy Peter Dalton',
                'Robert Anthony De Niro',
                'Kurt Russell'
            ];
            let nums = [
                '1284154332210',
                '1283154562210',
                '1283154562210',
                '1283199022210',
                '1288985783210',
            ];
            for (let i = 0; i < 5; i++) {
                let cons = {
                    id: i,
                    kind: ((i % 2) === 0) ? ConsumerKind.Person : ConsumerKind.Organisation,
                    name: names[i],
                    num: nums[i]
                };
                consumers.push(cons);
            }
            consumers.sort((a: Consumer, b: Consumer) => {
                if (a.name > b.name) {
                    return 1;
                }
                else if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });

            this.consumers = [...consumers];
            this.notifyAboutUpdateConsumers();
            return;
        }

        if (this.xhr.readyState > 0 || this.xhr.readyState < 4) {
            this.xhr.abort();
        }
        this.xhr.open('get', CONSUMERS_URL, true);
        this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.xhr.addEventListener('load', this.onLoadConsumers);

        this.xhr.send();
    }



    // Обработка успешного ответа сервера на запрос получения массива покупателей
    private onLoadConsumers(ev: any): void {
        let data = this.xhr.responseText;
        if (!data || typeof(data) === 'undefined') {
            return;
        }

        let consumers = JSON.parse(data);
        if (!consumers || typeof(consumers) === 'undefined') {
            return;
        }

        consumers = consumers.map((currentValue) => {
            if (typeof(currentValue.kind) === 'string') {
                currentValue.kind = parseInt(currentValue.kind);
            }
            return currentValue;
        });
        consumers.sort((a: Consumer, b: Consumer) => {
            if (a.name > b.name) {
                return 1;
            }
            else if (a.name < b.name) {
                return -1;
            }
            return 0;
        });

        this.consumers = [...consumers];
        this.notifyAboutUpdateConsumers();
    }



    // Вызов callback функции оповещения получения массива покупателей
    private notifyAboutUpdateConsumers(): void {
        this.notifyUpdate(this.consumers);
    }



    // Метод добавления покупателя, принимает новый объект без id
    public add(consumer: Consumer): void {
        if (!CREATE_CONSUMER_URL) {
            // не заполнен url, переходим сразу к добавлению
            consumer.id = this.count + 1;
            this.consumers.push(consumer);
            this.notifyAboutAdd(consumer);
            return;
        }

        if (this.xhr.readyState > 0 || this.xhr.readyState < 4) {
            this.xhr.abort();
        }
        this.xhr.open('post', CREATE_CONSUMER_URL, true);
        this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.xhr.addEventListener('load', this.onLoadConsumerAdd);

        this.xhr.send(JSON.stringify(consumer));
    }



    // Обработка успешного ответа сервера на запрос добавления покупателя
    private onLoadConsumerAdd(ev: any): void {
        let data = this.xhr.responseText;
        if (!data || typeof(data) === 'undefined') {
            return;
        }

        let consumer = JSON.parse(data);
        if (!consumer || typeof(consumer) === 'undefined') {
            return;
        }

        if (consumer.id && typeof(consumer.id) !== 'undefined' &&
            consumer.id > 0) {
            if (typeof(consumer.kind) === 'string') {
                consumer.kind = parseInt(consumer.kind);
            }
            this.consumers.push(consumer);
            this.notifyAboutAdd(consumer);
        }
    }



    // Вызов callback функции оповещения добавления покупателя
    private notifyAboutAdd(consumer: Consumer): void {
        this.notifyAdd(consumer);
    }



    // Метод изменения покупателя, принимает измененный объект
    public edit(consumer: Consumer): void {
        if (!EDIT_CONSUMER_URL) {
            // не заполнен url, переходим сразу к изменению
            let index = -1;
            for (let i = 0; i < this.consumers.length; i++) {
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

        let found = this.consumers.some((currentConsumer, index, arr) => {
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
        this.xhr.open('post', EDIT_CONSUMER_URL, true);
        this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.xhr.addEventListener('load', this.onLoadConsumerEdit);

        this.xhr.send(JSON.stringify(consumer));
    }



    // Обработка успешного ответа сервера на запрос изменения покупателя
    private onLoadConsumerEdit(ev: any): void {
        let data = this.xhr.responseText;
        if (!data || typeof(data) === 'undefined') {
            return;
        }

        let consumer = JSON.parse(data);
        if (!consumer || typeof(consumer) === 'undefined') {
            return;
        }

        if (consumer.id && typeof(consumer.id) !== 'undefined' &&
            consumer.id > 0) {
            if (typeof(consumer.kind) === 'string') {
                consumer.kind = parseInt(consumer.kind);
            }
            let index = -1;
            for (let i = 0; i < this.consumers.length; i++) {
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
    }



    // Вызов callback функции оповещения изменения
    private notifyAboutEdit(consumer: Consumer): void {
        this.notifyEdit(consumer);
    }



    // Удаление покупателя, принимает параметр id
    public remove(id : number): void {
        if (!REMOVE_CONSUMER_URL) {
            // не заполнен url, переходим сразу к удалению
            let index = -1;
            for (let i = 0; i < this.consumers.length; i++) {
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

        let found = this.consumers.some((currentConsumer, index, arr) => {
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
        this.xhr.open('post', REMOVE_CONSUMER_URL, true);
        this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.xhr.addEventListener('load', this.onLoadConsumerRemove);

        let consumerForDelete = {
            id: id
        };
        this.xhr.send(JSON.stringify(consumerForDelete));
    }



    // Обработка успешного ответа сервера на запрос удаления покупателя
    private onLoadConsumerRemove(ev: any): void {
        let data = this.xhr.responseText;
        if (!data || typeof(data) === 'undefined') {
            return;
        }

        let consumer = JSON.parse(data);
        if (!consumer || typeof(consumer) === 'undefined') {
            return;
        }

        if (consumer.id && typeof(consumer.id) !== 'undefined' &&
            consumer.id > 0) {
            let index = -1;
            for (let i = 0; i < this.consumers.length; i++) {
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
    }



    // Вызов callback функции оповещения удаления
    private notifyAboutRemove(id: number): void {
        this.notifyRemove(id);
    }



    // Массив покупателей
    get filterBase(): Consumer[] {
        return this.consumers;
    }



    get count(): number {
        return this.consumers.length;
    }
}

export default ConsumerList;