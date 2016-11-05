angular.module('starter.administradorService', [])

.factory('Administradores', function(Restangular, ApiEndpoint) {
  var endpoint = "administrador/";

  return {
    buscar: function() {
      return Restangular.all(endpoint + 'getAll').getList();
    },

    salvar: function(administrador){
      Restangular.all(endpoint).post(administrador);
    },

    remove: function(administrador) {
      var administradores = {};
      administradores.splice(administradores.indexOf(administrador), 1);
    },

    get: function(administradorId) {
      return Restangular.one(endpoint + 'getId', administradorId).get();
    }
  };
});
