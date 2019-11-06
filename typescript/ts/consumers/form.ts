/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/@types/jquery.validation/index.d.ts" />
import { Consumer, ConsumerKind } from './consumer';

class ConsumerModalForm {
    private $targetElement: any; // элемент, куда встраивается созданное модальное окно
    private notifySubmit: any; // ссылка на функцию-обработчик нажатия кнопки отправки
    private notifyCancel: any; // ссылка на функцию-обработчик нажатия кнопки отмены
    private notifyRemove: any; // ссылка на функцию-обработчик нажатия кнопки удаления
    private $modalElement: any = null; // элемент, созданный после методов openNewConsumer или openEditConsumer
    private consumer: Consumer = null; // объект покупателя

    constructor(targetElement: any, notifySubmit: any, notifyCancel: any, notifyRemove?: any) {
        this.$targetElement = targetElement;
        this.notifySubmit = notifySubmit;
        this.notifyCancel = notifyCancel;
        this.notifyRemove = notifyRemove;

        // Инициализация
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
    }



    // Метод создания общего шаблона модальной формы
    private createTemplate(headerText: string): JQuery[] {
        let elements: JQuery[] = [];

        // темный фон
        let $modal = $('<div />', {
            'class': 'modal'
        });
        elements.push($modal);

        // рамка формы
        let $modalContent = $('<div />', {
            'class': 'modal-content'
        });
        elements.push($modalContent);

        // кнопка закрытия
        let $modalCloseButton = $('<span />', {
            'class': 'modal-close-button',
            html: '&times;',
            click: this.onCancelBtnClick
        });
        elements.push($modalCloseButton);

        // заголовок формы
        let $modalHeader = $('<h2 />', {
            'class': 'modal-header',
            text: headerText
        });
        elements.push($modalHeader);

        // форма, настройка валидации
        let $modalForm = $('<form />', {
            'id': 'modal-form',
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
        elements.push($modalForm);

        // подготовка места для будущих строк - элементов формы
        let $modalFormColumn = $('<div />', {
            'class': 'column noguts'
        });
        elements.push($modalFormColumn);
        let $modalFormControlRow = $('<div />', {
            'class': 'row'
        });
        elements.push($modalFormControlRow);
        let $modalFormControlColumn = $('<div />', {
            'class': 'column'
        });
        elements.push($modalFormControlColumn);

        return elements;
    }



    // Метод создания элемента формы - Имя покупателя
    private createNameControl($modalFormControlRow: JQuery, 
                              $modalFormControlColumn: JQuery,
                              value?: string): JQuery {
        let $mfControlRowName = $modalFormControlRow.clone(true);
        let $mfControlColumnName = $modalFormControlColumn.clone(true);

        let $nameLabel = $('<label />', {
            'class': 'form-control',
            'for': 'name',
            text: 'Имя покупателя'
        });
        let $nameInput = $('<input />', {
            'class': 'form-control',
            'id': 'name',
            'name': 'name',
            'type': 'text',
            'value': value
        });

        $mfControlColumnName.append($nameLabel, $nameInput);
        $mfControlRowName.append($mfControlColumnName);
        
        return $mfControlRowName;
    }



    // Метод создания элемента формы - Номер покупателя
    private createNumControl($modalFormControlRow: JQuery, 
                             $modalFormControlColumn: JQuery,
                             value?: string): JQuery {
        let $mfControlRowNum = $modalFormControlRow.clone(true);
        let $mfControlColumnNum = $modalFormControlColumn.clone(true);

        let $numLabel = $('<label />', {
            'class': 'form-control',
            'for': 'num',
            text: 'Номер покупателя'
        });
        let $numInput = $('<input />', {
            'class': 'form-control',
            'id': 'num',
            'name': 'num',
            'type': 'text',
            'value': value
        });
        $mfControlColumnNum.append($numLabel, $numInput);
        $mfControlRowNum.append($mfControlColumnNum);

        return $mfControlRowNum;
    }



    // Метод создания элемента формы - Тип покупателя
    // выполняется перебор типов покупателей
    // принято за истину, что типов всего два
    private createKindControl($modalFormControlRow: JQuery, 
                              $modalFormControlColumn: JQuery,
                              value?: ConsumerKind): JQuery {
        let $mfControlRowKind = $modalFormControlRow.clone(true);
        let $mfControlColumnKind = $modalFormControlColumn.clone(true);

        let $kindLabel = $('<label />', {
            'class': 'form-control',
            'for': 'kind',
            text: 'Тип'
        });

        let $kindSelect = $('<select />', {
            'class': 'form-control',
            'id': 'kind',
            'name': 'kind'
        });

        let kinds = Object.keys(ConsumerKind).filter((key) => {
            return !isNaN(Number(ConsumerKind[key]));
        });
        for (let kind of kinds) {
            let $kindOption = $('<option />', {
                'value': ConsumerKind[kind],
                text: (kind === 'Person') ? 'Физическое лицо' : 'Юридическое лицо'
            });
            if (value == ConsumerKind[kind]) {
                $kindOption.attr('selected', 'selected');
            }
            $kindSelect.append($kindOption);
        }

        $mfControlColumnKind.append($kindLabel, $kindSelect);
        $mfControlRowKind.append($mfControlColumnKind);

        return $mfControlRowKind;
    }



    // Метод создания элемента с кнопками Отмена и Добавить
    private createAddButtonsBar($modalFormControlRow: JQuery, 
                                $modalFormControlColumn: JQuery): JQuery {
        let $mfControlRowButtons = $modalFormControlRow.clone(true);
        let $mfControlColumnCancelBtn = $modalFormControlColumn.clone(true);
        let $mfControlColumnSubmitBtn = $modalFormControlColumn.clone(true);

        let $cancelBtn = $('<button />', {
            'class': 'button button-blue form-button',
            text: 'Отмена',
            click: this.onCancelBtnClick
        });
        $mfControlColumnCancelBtn.append($cancelBtn);

        let $submitBtn = $('<button />', {
            'class': 'button form-button',
            'type': 'submit',
            text: 'Добавить'
        });
        $mfControlColumnSubmitBtn.append($submitBtn);

        $mfControlRowButtons.append($mfControlColumnCancelBtn, $mfControlColumnSubmitBtn);
        return $mfControlRowButtons;
    }



    // Метод создания и открытия модального окна добавления нового покупателя
    public openNewConsumer() {
        // Генерация общего шаблона формы
        let [$modal, 
             $modalContent, 
             $modalCloseButton, 
             $modalHeader, 
             $modalForm, 
             $modalFormColumn, 
             _$modalFormControlRow, 
             _$modalFormControlColumn] = this.createTemplate('Новый покупатель');

        // Элемент формы - Имя покупателя
        let $nameControl = this.createNameControl(_$modalFormControlRow, 
                                                  _$modalFormControlColumn);

        // Элемент формы - Номер покупателя
        let $numControl = this.createNumControl(_$modalFormControlRow, 
                                                _$modalFormControlColumn);

        // Элемент формы - Тип покупателя
        let $kindControl = this.createKindControl(_$modalFormControlRow, 
                                                  _$modalFormControlColumn);

        // Элементы формы - Кнопки отмены и отправки
        let $buttonsBar = this.createAddButtonsBar(_$modalFormControlRow,
                                                _$modalFormControlColumn);

        // Включение строк в общий шаблон
        $modalFormColumn.append(
            $nameControl, $numControl, $kindControl, $buttonsBar
        ).appendTo($modalForm);
        $modalContent.append($modalCloseButton, $modalHeader, $modalForm);
        $modal.append($modalContent);

        this.$modalElement = $modal;
        this.$targetElement.append($modal);
    }



    // Метод создания элемента с кнопками Удалить и Сохранить
    private createEditButtonsBar($modalFormControlRow: JQuery, 
                                 $modalFormControlColumn: JQuery): JQuery {
        let $mfControlRowButtons = $modalFormControlRow.clone(true);
        let $mfControlColumnRemoveBtn = $modalFormControlColumn.clone(true);
        let $mfControlColumnSubmitBtn = $modalFormControlColumn.clone(true);

        let $removeBtn = $('<button />', {
            'class': 'button button-blue form-button',
            text: 'Удалить',
            click: this.onRemoveBtnClick
        });
        $mfControlColumnRemoveBtn.append($removeBtn);

        let $submitBtn = $('<button />', {
            'class': 'button form-button',
            'type': 'submit',
            text: 'Сохранить'
        });
        $mfControlColumnSubmitBtn.append($submitBtn);

        $mfControlRowButtons.append($mfControlColumnRemoveBtn, $mfControlColumnSubmitBtn);
        return $mfControlRowButtons;
    }



    // Метод создания и открытия модального окна редактирования покупателя
    public openEditConsumer(consumer: Consumer): void {
        // Генерация общего шаблона формы
        let [$modal, 
             $modalContent, 
             $modalCloseButton, 
             $modalHeader, 
             $modalForm, 
             $modalFormColumn, 
             _$modalFormControlRow, 
             _$modalFormControlColumn] = this.createTemplate('Редактирование');

        let $idControl = $('<input />', {
            'id': 'id',
            'name': 'id',
            'type': 'hidden',
            'value': consumer.id
        });

        // Элемент формы - Имя покупателя
        let $nameControl = this.createNameControl(_$modalFormControlRow, 
                                                  _$modalFormControlColumn,
                                                  consumer.name);

        // Элемент формы - Номер покупателя
        let $numControl = this.createNumControl(_$modalFormControlRow, 
                                                _$modalFormControlColumn,
                                                consumer.num);

        // Элемент формы - Тип покупателя
        let $kindControl = this.createKindControl(_$modalFormControlRow, 
                                                  _$modalFormControlColumn,
                                                  consumer.kind);

        // Элементы формы - Кнопки отмены и отправки
        let $buttonsBar = this.createEditButtonsBar(_$modalFormControlRow,
                                                    _$modalFormControlColumn);

        // Включение строк в общий шаблон
        $modalFormColumn.append(
            $idControl, $nameControl, $numControl, $kindControl, $buttonsBar
        ).appendTo($modalForm);
        $modalContent.append($modalCloseButton, $modalHeader, $modalForm);
        $modal.append($modalContent);

        this.$modalElement = $modal;
        this.$targetElement.append($modal);
        this.consumer = consumer;
    }



    // Обработчик нажатия кнопки Добавить/Изменить
    // Происходит вызов callback функции
    private onSubmitForm(form: any, ev: any): void {
        ev.preventDefault();
        let data = $(form).serializeArray().reduce((a, b) => {
            if (b.name !== 'num') {
                a[b.name] = (!isNaN(Number(b.value))) ? parseInt(b.value) : b.value;
            }
            else {
                a[b.name] = b.value;
            }
            return a;
        }, {});
        this.$modalElement.remove();
        this.notifySubmit(data);
    }



    // Обработчик нажатия кнопки удаления
    // Происходит вызов callback функции
    private onRemoveBtnClick(ev: any): void {
        ev.preventDefault();
        this.$modalElement.remove();
        this.notifyRemove(this.consumer.id);
    }



    // Обработчик нажатия кнопки отмены
    // Происходит вызов callback функции
    private onCancelBtnClick(ev: any): void {
        ev.preventDefault();
        this.consumer = null;
        this.$modalElement.remove();
        this.notifyCancel();
    }
}

export default ConsumerModalForm;