angular.module('starter.relatorioService', [])

.factory('Relatorio', function(Restangular) {
  var endpoint = "relatorio/";

  return {
    buscarRelatorioFinanceiroPorPeriodo: function(periodo){
      return Restangular.all(endpoint + 'financeiro/buscarRelatorioFinanceiroPorPeriodo').post(periodo);
    }
  };
});
