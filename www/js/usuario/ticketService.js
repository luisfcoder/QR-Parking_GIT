angular.module('starter.ticketService', [])

.factory('Ticket', function(Restangular) {
  var endpoint = "ticket/";

  return {
    gerar: function() {
      return Restangular.one(endpoint + 'gerar').get();
    },

    calcular: function(ticketId){
      return Restangular.one(endpoint + 'calcular', ticketId).get();
    },

    processarPagamento: function(dadosPagamento){
      return Restangular.all(endpoint + 'processarPagamento').post(dadosPagamento);
    }
  };
});
