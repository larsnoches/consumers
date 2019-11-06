/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
import { Consumer, ConsumerKind } from './consumer';
import ConsumerList from './list';

// Таблица-представление покупателей
class ConsumerView {
    private consumerList: ConsumerList; // Список объектов покупателей
    private $targetElement: JQuery; // Элемент, в который будут встраиваться строки списка
    private notifyItemClick: any; // Обработчик нажатия на строку таблицы
    private showPerson: boolean = true; // Фильтр по Физическим лицам
    private showOrganisation: boolean = true; // Фильтр по Юридическим лицам

    constructor($targetElement: JQuery, notifyItemClick: any) {
        this.$targetElement = $targetElement;
        this.notifyItemClick = notifyItemClick;

        // Инициализация
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

        this.onItemClick = this.onItemClick.bind(this);

        // Создание объекта списка покупателей
        this.consumerList = new ConsumerList(
            this.onUpdateConsumers,
            this.onAddConsumer,
            this.onEditConsumer,
            this.onRemoveConsumer
        );
    }



    // Метод получения массива покупателей
    public updateConsumerList(): void {
        this.consumerList.updateConsumers();
    }



    // Метод фильтрации
    public filterConsumerList(showPerson: boolean, showOrganisation: boolean): void {
        this.showPerson = showPerson;
        this.showOrganisation = showOrganisation;
        this.onUpdateConsumers(this.consumerList.filterBase);
    }



    // Включение в таблицу нескольких $-объектов из массива consumer-объектов
    public onUpdateConsumers(consumers: Consumer[]): void {
        let consumerItems = [];
        for (let consumer of consumers) {
            if ((consumer.kind === ConsumerKind.Person && this.showPerson) ||
                (consumer.kind === ConsumerKind.Organisation && this.showOrganisation)) {
                let $consumerItem = this.createOneRow(consumer);
                consumerItems.push($consumerItem); 
            }
        }
        this.$targetElement.children('.row').remove(); // исключение прошлых строк
        if (consumerItems.length > 0) {
            this.$targetElement.append(consumerItems);
        }
    }



    // Метод добавления покупателя
    // вызывает соответствующий метод объекта списка покупателей
    public addConsumer(consumer: Consumer): void {
        this.consumerList.add(consumer);
    }



    // Обработчик события списка покупателей о добавлении покупателя
    // Происходит включение в таблицу новой строки
    public onAddConsumer(consumer: Consumer): void {
        // проверка на соответствие фильтру
        if ((consumer.kind === ConsumerKind.Person && this.showPerson) ||
            (consumer.kind === ConsumerKind.Organisation && this.showOrganisation)) {
            let $consumerRow = this.createOneRow(consumer);
            this.$targetElement.append($consumerRow);
        }
    }



    // Получение строки из consumer-объекта
    public createOneRow(consumer: Consumer): JQuery {
        let $consumerItem = $('<div />', {
            'class': 'row consumer-item',
            'data-id': consumer.id,
            'data-name': consumer.name,
            'data-kind': consumer.kind,
            'data-num': consumer.num,
            click: this.onItemClick
        });

        let $consumerItemName = $('<div />', {
            'class': 'column consumer-item-name',
            text: consumer.name
        });
        $consumerItem.append($consumerItemName);

        let $consumerItemKind = $('<div />', {
            'class': 'column column-10 consumer-item-kind',
            text: (consumer.kind == ConsumerKind.Person) ? 'Ф' : 'Ю'
        });
        let $consumerItemKindTooltip = $('<span />', {
            'class': 'tooltip',
            text: (consumer.kind == ConsumerKind.Person) ? 'Физическое лицо' : 'Юридическое лицо'
        });
        $consumerItemKind.append($consumerItemKindTooltip);
        $consumerItem.append($consumerItemKind);

        let $consumerItemNum = $('<div />', {
            'class': 'column column-30 consumer-item-num',
            text: consumer.num
        });
        $consumerItem.append($consumerItemNum);
        return $consumerItem;
    }



    // Обработчик нажатия на строку
    // Принято за истину, что у элемента строки всегда будут вложенные ячейки,
    // соответствующие полям объекта покупателя
    private onItemClick(ev: any) {
        let target = ev.target;
        let itemRow = $(target).parent(); // получение строки

        let consumer = {
            id: parseInt($(itemRow).attr('data-id')),
            name: $(itemRow).attr('data-name'),
            num: $(itemRow).attr('data-num'),
            kind: parseInt($(itemRow).attr('data-kind'))
        };
        this.notifyItemClick(consumer);
    }



    // Метод редактирования покупателя
    // вызывает соответствующий метод объекта списка покупателей
    public editConsumer(consumer: Consumer): void {
        this.consumerList.edit(consumer);
    }



    // Обработчик события списка покупателей об изменении покупателя
    // Происходит редактирование строки в таблице
    public onEditConsumer(consumer: Consumer): void {
        let $consumerItem = this.$targetElement.children('.consumer-item[data-id="' + consumer.id.toString() + '"]');
        if (typeof($consumerItem) === 'undefined' || !$consumerItem ||
            typeof($consumerItem.length) === 'undefined' || $consumerItem.length === 0) {
            return;
        }

        if ((consumer.kind === ConsumerKind.Person && !this.showPerson) ||
            (consumer.kind === ConsumerKind.Organisation && !this.showOrganisation)) {
            $consumerItem.remove(); // исключаем строку, т.к. она не входит в фильтр
            return;
        }

        $consumerItem.attr('data-name', consumer.name);
        $consumerItem.attr('data-kind', consumer.kind);
        $consumerItem.attr('data-num', consumer.num);

        let $consumerItemName = $consumerItem.children('.consumer-item-name');
        if (typeof($consumerItemName) === 'undefined' || !$consumerItemName ||
            typeof($consumerItemName.length) === 'undefined' || $consumerItemName.length === 0) {
            return;
        }
        $consumerItemName.text(consumer.name);

        let $consumerItemKind = $consumerItem.children('.consumer-item-kind');
        if (typeof($consumerItemKind) === 'undefined' || !$consumerItemKind ||
            typeof($consumerItemKind.length) === 'undefined' || $consumerItemKind.length === 0) {
            return;
        }
        $consumerItemKind.text((consumer.kind == ConsumerKind.Person) ? 'Ф' : 'Ю');

        let $consumerItemKindTooltip = $('<span />', {
            'class': 'tooltip',
            text: (consumer.kind == ConsumerKind.Person) ? 'Физическое лицо' : 'Юридическое лицо'
        });
        $consumerItemKind.append($consumerItemKindTooltip);

        let $consumerItemNum = $consumerItem.children('.consumer-item-num');
        if (typeof($consumerItemNum) === 'undefined' || !$consumerItemNum ||
            typeof($consumerItemNum.length) === 'undefined' || $consumerItemNum.length === 0) {
            return;
        }
        $consumerItemNum.text(consumer.num);
    }



    // Метод удаления покупателя
    // вызывает соответствующий метод объекта списка покупателей
    public removeConsumer(id: number): void {
        this.consumerList.remove(id);
    }



    // Обработчик события списка покупателей об удалении покупателя
    // Происходит удаление строки из таблицы
    public onRemoveConsumer(id: number): void {
        let $consumer = this.$targetElement.children('.consumer-item[data-id="' + id.toString() + '"]');
        if (typeof($consumer) !== 'undefined' && $consumer &&
            typeof($consumer.length) !== 'undefined' && $consumer.length > 0) {
            $consumer.remove();
        }
    }
}

export default ConsumerView;