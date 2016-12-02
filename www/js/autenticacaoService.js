angular.module('starter.autenticacaoService', [])

.factory('Autenticacao', function(Restangular, localStorageService, $state) {

  return {
    autenticar: function(credenciais){
      return Restangular.all('administrador/buscarPorCredenciais').post(credenciais);
    },

    verificar: function(credenciais){
      if(localStorageService.get("usuarioLogado")){
        return;
      }else{
        $state.go("tab.login");
        return;
      }
    }
  };
});
