define([], function () {

    FormController.$inject = ['CoisaService', '$state','entity'];

    function FormController(CoisaService, $state,entity) {
        var form = this;
        form.entity = entity.data;
        form.list = [{name: 'Luke Skywalker', age: 19, dead: false},
            {name: 'Princess Leia Organa of Alderaan', age: 21, dead: false},
            {name: 'Anakin Skywalker', age: 45, dead: true},
            {name: 'Frodo Baggins', age: 50, dead: false},
            {name: 'Bilbo Baggins', age: 75, dead: true},
            {name: 'Gandalf the Grey', age: 95, dead: false},
            {name: 'Tom Bombadil', age: 96, dead: true}];

        form.list2 = [{name: 'Luke Skywalker', age: 19},
            {name: 'Princess Leia Organa of Alderaan', age: 21},
            {name: 'Anakin Skywalker', age: 45},
            {name: 'Frodo Baggins', age: 50},
            {name: 'Bilbo Baggins', age: 75},
            {name: 'Gandalf the Grey', age: 95},
            {name: 'Tom Bombadil', age: 96}];


        form.addressMock = {
            cep: null,
            pais: null,
            localidade: null,
            UF: null,
            tipoLogradouro: null,
            logradouro: null,
            numero: null,
            complemento: null,
            bairro: null
        };

        

        form.update = function (entity) {
            CoisaService.update(entity)
                .success(function () {
                    $state.go('coisa.list');
                });
        };

    }

    return FormController;
});
