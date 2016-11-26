angular.module('starter.parametroService', [])

.factory('Parametro', function(Restangular) {
  var endpoint = "parametro/";

  return {
    salvar: function(parametro){
      return Restangular.all(endpoint).post(parametro);
    },

    buscarAtual: function() {
      return Restangular.one(endpoint + 'buscarAtual').get();
    }
  };
});
