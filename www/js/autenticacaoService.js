angular.module('starter.autenticacaoService', [])

.factory('Autenticacao', function(Restangular, localStorageService, $state) {

  return {
    verificar: function(credenciais){
      console.log(localStorageService.get("usuarioLogado"));
      if(localStorageService.get("usuarioLogado")){
        return;
      }else{
        $state.go("tab.login");
        return;
      }
    }
  };
});
