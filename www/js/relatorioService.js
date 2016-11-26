angular.module('starter.relatorioService', [])

.factory('Relatorio', function(Restangular) {
  var endpoint = "relatorio/";

  return {
    buscarRelatorioFinanceiro: function() {
      return Restangular.all(endpoint + 'financeiro/buscarTodos').getList();
    },

    buscarRelatorioFinanceiroPorPeriodo: function(periodo) {
      return Restangular.all(endpoint + 'financeiro/buscarRelatorioFinanceiroPorPeriodo', periodo).getList();
    }
  };
});
