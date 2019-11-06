import ConsumerModalForm from './consumers/form';
import ConsumerView from './consumers/view';

// тест добавления покупателя через открытие модальной формы 
// и затем через имитацию нажатия на кнопку добавить
QUnit.test('add modal form open', function(assert) {
    // выбор элемента для включения строк таблицы-представления
    let $consumersTarget = $('#consumers-container');
    $consumersTarget.hide();
    let consumerView = new ConsumerView($consumersTarget, function() { });
    // выбор элемента для включения модальной формы
    let $modalFormTarget = $('#modal-root');
    $modalFormTarget.hide();

    let consumerAddModal = new ConsumerModalForm(
        $modalFormTarget,
        function(consumer) {
            assert.notEqual(typeof(consumer), 'undefined', 'Покупатель создан.');
            consumerView.addConsumer(consumer);
            assert.notEqual($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель добавлен.');
            assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма добавления закрыта.');
        },
        null,
    );
    // создание и открытие формы
    consumerAddModal.openNewConsumer();
    assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма добавления создана.');

    let consumer = {
        name: 'Tom',
        num: '1231231231231',
        kind: 1
    };
    // заполнение данными полей формы
    $modalFormTarget.find('input[name="name"]').attr('value', consumer.name);
    $modalFormTarget.find('input[name="num"]').attr('value', consumer.num);
    $modalFormTarget.find('option[value="' + consumer.kind.toString() +'"]').attr('selected', 'selected');

    $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - добавить
});



// тест редактирования покупателя через открытие формы редактирования
// сначала создается форма добавления, потом имитируется нажатие на кнопку добавить
// и далее имитируется нажатие на строку таблицы для создания и открытия формы редактирования,
// а после имитации нажатия на кнопку сохранения происходит сравнение с исходными данными
QUnit.test('edit modal form open', function(assert) {
    // объект покупателя по умолчанию
    let defaultConsumer = {
        name: 'Tom',
        num: '1231231231231',
        kind: 1
    };
    // выбор элемента для включения модальной формы
    let $modalFormTarget = $('#modal-root');
    $modalFormTarget.children().remove();
    $modalFormTarget.hide();

    // выбор элемента для включение строк таблицы-представления
    let $consumersTarget = $('#consumers-container');
    $consumersTarget.children().remove();
    $consumersTarget.hide();

    let consumerView = new ConsumerView($consumersTarget, function(consumer) {
        assert.notEqual(typeof(consumer), 'undefined', 'Произошло нажатие на строку таблицы-представления.');
    
        let consumerEditModal = new ConsumerModalForm(
            $modalFormTarget,
            function(anotherConsumer) {
                consumerView.editConsumer(anotherConsumer);
                let done = assert.async();
                setTimeout(function() {
                    let $row = $('div.consumer-item', $consumersTarget).first();
                    assert.equal($row.attr('data-name'), 
                                 anotherConsumer.name, 'Имя сохранено.');
                    assert.equal($row.attr('data-num'), 
                                 anotherConsumer.num, 'Номер сохранен.');
                    assert.equal($row.attr('data-kind'), 
                                 anotherConsumer.kind, 'Тип сохранен.');

                    assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма редактирования закрыта.');
                    done();
                }, 1000);
            },
            null,
            null
        );
        // создание и открытие формы редактирование
        consumerEditModal.openEditConsumer(consumer);
        assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма редактирования создана.');

        // заполнение изменений объекта покупателя
        defaultConsumer.name = 'Toms';
        defaultConsumer.num = '1231231231232';
        defaultConsumer.kind = 2;

        // заполнение полей форм
        $modalFormTarget.find('input[name="name"]').attr('value', defaultConsumer.name);
        $modalFormTarget.find('input[name="num"]').attr('value', defaultConsumer.num);
        $modalFormTarget.find('option[value="' + defaultConsumer.kind.toString() +'"]').attr('selected', 'selected');
    
        $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - сохранить
    });

    let consumerAddModal = new ConsumerModalForm(
        $modalFormTarget,
        function(consumer) {
            assert.notEqual(typeof(consumer), 'undefined', 'Покупатель создан.');
            consumerView.addConsumer(consumer);

            let done = assert.async();
            setTimeout(function() {
                assert.notEqual($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель добавлен.');
                assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма добавления закрыта.');
                // имитация нажатия на строку таблицу-представление
                $('div.consumer-item', $consumersTarget).first().children('.consumer-item-name').click();
                done();
            }, 1000);
        },
        null,
    );
    // создание и открытие модальной формы
    consumerAddModal.openNewConsumer();
    assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма добавления создана.');

    // заполнение полей формы из объекта покупателя по умолчанию
    $modalFormTarget.find('input[name="name"]').attr('value', defaultConsumer.name);
    $modalFormTarget.find('input[name="num"]').attr('value', defaultConsumer.num);
    $modalFormTarget.find('option[value="' + defaultConsumer.kind.toString() +'"]').attr('selected', 'selected');

    $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - добавить
});



// тест удаления покупателя 
// сначала создается и открывается форма добавления, 
// затем происходит имитация нажатия на строку таблицы для открытие формы редактирования
// и затем удаление покупателя имитацией нажатия на кнопку удалить в форме
QUnit.test('edit modal form open for remove', function(assert) {
    // объект покупателя по умолчанию
    let defaultConsumer = {
        name: 'Tom',
        num: '1231231231231',
        kind: 1
    };

    // выборэлемента для включения модальной формы
    let $modalFormTarget = $('#modal-root');
    $modalFormTarget.children().remove();
    $modalFormTarget.hide();

    // выбор элемента для включения строк таблицы-представления
    let $consumersTarget = $('#consumers-container');
    $consumersTarget.children().remove();
    $consumersTarget.hide();

    let consumerView = new ConsumerView($consumersTarget, function(consumer) {
        assert.notEqual(typeof(consumer), 'undefined', 'Произошло нажатие на строку таблицы-представления.');
    
        let consumerEditModal = new ConsumerModalForm(
            $modalFormTarget,
            null,
            null,
            function(id) {
                consumerView.removeConsumer(id);
            
                let done = assert.async();
                setTimeout(function() {
                    assert.equal($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель удален.');
                    assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма редактирования закрыта.');
                    done();
                }, 1000);
            }
        );
        // создание и открытие формы редактирования покупателя
        consumerEditModal.openEditConsumer(consumer);
        assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма редактирования создана.');

        $modalFormTarget.find('button.button-blue').click(); // имитация нажатия кнопки - удалить
    });

    let consumerAddModal = new ConsumerModalForm(
        $modalFormTarget,
        function(consumer) {
            assert.notEqual(typeof(consumer), 'undefined', 'Покупатель создан.');
            consumerView.addConsumer(consumer);
            
            let done = assert.async();
            setTimeout(function() {
                assert.notEqual($('div.consumer-item', $consumersTarget).length, 0, 'Покупатель добавлен.');
                assert.equal($('div.modal', $modalFormTarget).length, 0, 'Форма добавления закрыта.');
                $('div.consumer-item', $consumersTarget).first().children('.consumer-item-name').click(); // имитация нажатия на строку
                done();
            }, 1000);
        },
        null,
    );
    // создание и открытие формы добавления покупателя
    consumerAddModal.openNewConsumer();
    assert.equal($('div.modal', $modalFormTarget).length, 1, 'Форма добавления создана.');

    // заполнение полей формы добавления данными по умолчанию
    $modalFormTarget.find('input[name="name"]').attr('value', defaultConsumer.name);
    $modalFormTarget.find('input[name="num"]').attr('value', defaultConsumer.num);
    $modalFormTarget.find('option[value="' + defaultConsumer.kind.toString() +'"]').attr('selected', 'selected');

    $modalFormTarget.find('button[type="submit"]').click(); // имитация нажатия кнопки - добавить
});