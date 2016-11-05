angular.module('starter.controllers', [])

.controller('InicioCtrl', function($scope) {

})


.controller('AdministradoresCtrl', function($scope, Administradores) {
    $scope.busca = '';
    $scope.administradores = {};

    //Utilizado para forçar a atualização dos resultados após uma alteração
    $scope.$on('$ionicView.enter', function() {
      Administradores.buscar().then(function(resposta){
        $scope.administradores = resposta;
      });
    });

    $scope.limparBusca = function(){
        $scope.busca = '';
    }

    $scope.ativarInativar = function(administrador) {
      if(administrador.dtInativacao == null){
        administrador.dtInativacao = new Date();
      }else{
        administrador.dtInativacao = null;
      }
      Administradores.salvar(administrador);
    };
})

.controller('AdministradorDetailCtrl', function($scope, $stateParams, Administradores, $location, $state) {
    $scope.administradorForm = {};
    if($stateParams.administradorId != ""){
      Administradores.get($stateParams.administradorId).then(function(resposta){
        $scope.administrador = resposta;
        $scope.administradorForm = angular.copy($scope.administrador);
      });
    }

    $scope.salvarAdministrador = function(){
      Administradores.salvar($scope.administradorForm);
      $state.go('tab.administradores');

  }
})

.controller("ParametroCtrl", function($scope, Parametro){
  $scope.parametro = Parametro.get(0);

  $scope.salvarParametro = function(){
    alert($scope.parametro.tolerancia);
  }
});
