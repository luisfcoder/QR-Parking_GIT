angular.module('starter.administradorService', [])

.factory('Administradores', function(Restangular) {
  var endpoint = "administrador/";

  return {
    buscarTodos: function() {
      return Restangular.all(endpoint + 'buscarTodos').getList();
    },

    salvar: function(administrador){
      return Restangular.all(endpoint).post(administrador);
    },

    buscarPorId: function(administradorId) {
      return Restangular.one(endpoint + 'buscarPorId', administradorId).get();
    }
  };
});
