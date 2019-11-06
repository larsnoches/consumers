/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
import ConsumerModalForm from './consumers/form';
import { Consumer } from './consumers/consumer';
import ConsumerView from './consumers/view';

class Application {
    private consumerAddModal: ConsumerModalForm; // Объект модальной формы добавления покупателя
    private $showAddModalBtn: JQuery; // Кнопка вызова модальной формы добавления покупателя
    private $modalFormTarget: JQuery; // Элемент модальной формыы
    private consumerView: ConsumerView // Объект таблицы-представления покупателей
    private $filterPersonBtn: JQuery; // Кнопка фильтрации - Показать ФЛ
    private $filterOrganisationBtn: JQuery; // Кнопка фильтрации - Показать ЮЛ

    public init(): void {
        // Инициализация
        this.launch = this.launch.bind(this);
        this.onConsumerViewItemClick = this.onConsumerViewItemClick.bind(this);
        this.onShowAddModalBtnClick = this.onShowAddModalBtnClick.bind(this);
        this.onConsumerAddModalSubmitBtnClick = this.onConsumerAddModalSubmitBtnClick.bind(this);
        this.onConsumerAddModalCancelBtnClick = this.onConsumerAddModalCancelBtnClick.bind(this);
        this.onConsumerEditModalSubmitBtnClick = this.onConsumerEditModalSubmitBtnClick.bind(this);
        this.onConsumerEditModalRemoveBtnClick = this.onConsumerEditModalRemoveBtnClick.bind(this);
        this.onConsumerEditModalCancelBtnClick = this.onConsumerEditModalCancelBtnClick.bind(this);
        this.onFilterPersonBtnClick = this.onFilterPersonBtnClick.bind(this);
        this.onFilterOrganisationBtnClick = this.onFilterOrganisationBtnClick.bind(this);

        // Выбирается элемент DOM, в который будет встраиваться модальная форма
        this.$modalFormTarget = $('#modal-root');
        // Модальная форма добавления покупателя
        this.consumerAddModal = new ConsumerModalForm(
            this.$modalFormTarget,
            this.onConsumerAddModalSubmitBtnClick,
            this.onConsumerAddModalCancelBtnClick
        );

        // Выбирается элемент кнопки, 
        // после нажатия на которую будет создаваться объект формы добавления покупателя
        this.$showAddModalBtn = $('#show-add-modal-button');
        this.$showAddModalBtn.on('click', this.onShowAddModalBtnClick);

        // Выбирается элемент контейнера,
        // в который будет встраиваться таблица
        let $consumersTarget = $('#consumers-container');
        this.consumerView = new ConsumerView($consumersTarget, this.onConsumerViewItemClick);

        // Назначение событий на кнопки фильтрации
        this.$filterPersonBtn = $('#filter-person-button');
        this.$filterPersonBtn.on('click', this.onFilterPersonBtnClick);

        this.$filterOrganisationBtn = $('#filter-org-button');
        this.$filterOrganisationBtn.on('click', this.onFilterOrganisationBtnClick);
    }



    // Запуск - вызов метода получения массива покупателей
    public launch(): void {
        this.consumerView.updateConsumerList();
    }



    // Обработчик нажатия на строку таблицы-представления
    public onConsumerViewItemClick(consumer: Consumer): void {
        let consumerEditModal = new ConsumerModalForm(
            this.$modalFormTarget,
            this.onConsumerEditModalSubmitBtnClick,
            this.onConsumerEditModalCancelBtnClick,
            this.onConsumerEditModalRemoveBtnClick
        );
        consumerEditModal.openEditConsumer(consumer);
    }



    // Обработчик события о нажатии на кнопку формы - Сохранить
    // Происходит вызов метода объекта таблицы-представления покупателей
    public onConsumerEditModalSubmitBtnClick(consumer: Consumer): void {
        this.consumerView.editConsumer(consumer);
    }



    // Обработчик нажатия на кнопку формы редактирования - Удалить покупателя
    public onConsumerEditModalRemoveBtnClick(id: number): void {
        this.consumerView.removeConsumer(id);
    }



    //
    public onConsumerEditModalCancelBtnClick(): void {
        console.log('edit canceled');
    }



    // Обработчик нажатия на кнопку - Добавить покупателя
    public onShowAddModalBtnClick(ev: any): void {
        this.consumerAddModal.openNewConsumer();
    } 



    // Обработчик события о нажатии на кнопку формы - Добавить
    // Происходит вызов метода объекта таблицы-представления покупателей
    public onConsumerAddModalSubmitBtnClick(consumer: Consumer): void {
        this.consumerView.addConsumer(consumer);
    }



    // 
    public onConsumerAddModalCancelBtnClick(): void {
        console.log('Add canceled');
    }



    // Обработчик нажатия на кнопку фильтрации по Физическим лицам
    public onFilterPersonBtnClick(ev: any): void {
        $(ev.target).toggleClass('pressed');
        let showPerson: boolean = this.$filterPersonBtn.hasClass('pressed');
        let showOrganisation: boolean = this.$filterOrganisationBtn.hasClass('pressed');
        this.consumerView.filterConsumerList(showPerson, showOrganisation);
    }



    // Обработчик нажатия на кнопку фильтрации по Юридическим лицам
    public onFilterOrganisationBtnClick(ev: any): void {
        $(ev.target).toggleClass('pressed');
        let showPerson: boolean = this.$filterPersonBtn.hasClass('pressed');
        let showOrganisation: boolean = this.$filterOrganisationBtn.hasClass('pressed');
        this.consumerView.filterConsumerList(showPerson, showOrganisation);
    }
}

// Назначение запуска приложения
$(document).ready(() => {
    let app = new Application();
    app.init();
    app.launch();
});
