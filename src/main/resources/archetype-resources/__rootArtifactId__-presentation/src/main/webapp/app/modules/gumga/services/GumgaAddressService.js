/**
 * Created by igorsantana on 26/03/15.
 */
define([], function () {

    GumgaAddressService.$inject = [];

    function GumgaAddressService() {
        var factory = {};
        var ids = [];
        factory.everyUf = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
            'RJ', 'RN', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
        factory.everyLogradouro = ['Outros', 'Aeroporto', 'Alameda', 'Área', 'Avenida', 'Campo', 'Chácara', 'Colônia', 'Condomínio', 'Conjunto', 'Distrito',
            'Esplanada', 'Estação', 'Estrada', 'Favela', 'Fazenda', 'Feira', 'Jardim', 'Ladeira', 'Largo', 'Lago', 'Lagoa', 'Loteamento', 'Núcleo', 'Parque', 'Passarela', 'Pátio', 'Praça',
            'Quadra', 'Recanto', 'Residencial', 'Rodovia', 'Rua', 'Setor', 'Sítio', 'Travessa', 'Trevo', 'Trecho', 'Vale', 'Vereda', 'Via', 'Viaduto', 'Viela', 'Via'];
        factory.availableCountries = ['Brasil'];
        factory.setId = function(id){
            ids.push(id);
        };
        factory.getId = function () {
            console.log(ids);
        };
        return factory;
    }

    return GumgaAddressService;

});