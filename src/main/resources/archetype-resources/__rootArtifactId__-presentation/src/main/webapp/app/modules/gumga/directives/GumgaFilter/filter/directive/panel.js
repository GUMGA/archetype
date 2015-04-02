define(function() {
    var Keys = {
        'ENTER' : 13,
        'ESC' : 27,
        'END' : 35,
        'HOME' : 36,
        'LEFT' : 37,
        'RIGHT' : 39,
        'INSERT' : 45,
        'DELETE' : 46
    };


    return function() {
        return {
            restrict : 'EA',
            link : function($scope, $element) {

                $scope.$on('gumga.filter.confirm', function(ev, domEvent) {
                    if (!$.contains($element[0].parentNode, domEvent.target)) {
                        $scope.$panelInstance.confirm($scope.$condition, $scope.$value);
                    }
                });

                $element.on('keydown', function(ev) {

                    // Fecha a janela caso pressionar o botão "ESC"
                    if (ev.which == Keys.ESC) {
                        $scope.$panelInstance.cancel();
                    }

                    // Confirma os valores da janela caso pressionar o botão "ENTER"
                    if (ev.which == Keys.ENTER) {
                        $scope.$panelInstance.confirm($scope.$condition, $scope.$value);
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
                });
            }

        };
    };
});