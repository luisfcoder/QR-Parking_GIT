angular.module('starter.parametroService', [])

.factory('Parametro', function(Restangular) {
  var endpoint = "parametro/";

  var ID_PARAMETRO = 1;

  return {
    salvar: function(parametro){
      return Restangular.all(endpoint).post(parametro);
    },

    buscarPorId: function() {
      return Restangular.one(endpoint + 'buscarPorId', ID_PARAMETRO).get();
    }
  };
});
