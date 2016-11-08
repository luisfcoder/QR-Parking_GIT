angular.module('starter.ticketService', [])

.factory('Ticket', function(Restangular) {
  var endpoint = "ticket/";

  return {
    gerar: function() {
      return Restangular.one(endpoint + 'gerar').get();
    }
  };
});
