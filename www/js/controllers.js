angular.module('starter.controllers', [])

.controller('InicioCtrl', function($scope) {

})

.controller('RelatoriosCtrl', function($scope) {

})


.controller('AdministradoresCtrl', function($scope, Administradores) {
  $scope.busca = '';
  $scope.administradores = {};

  //Utilizado para forçar a atualização dos resultados após uma alteração
  $scope.$on('$ionicView.enter', function() {
    Administradores.buscarTodos().then(function(resposta){
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

.controller('AdministradorDetailCtrl', function($scope, $ionicPopup, $stateParams, Administradores, $state) {
  $scope.administradorForm = {};
  if($stateParams.administradorId != ""){
    Administradores.buscarPorId($stateParams.administradorId).then(function(resposta){
      $scope.administrador = resposta;
      $scope.administradorForm = angular.copy($scope.administrador);
    });
  }

  $scope.salvarAdministrador = function(){


    //REGRA CRIADA PARA NAO DEIXAR O FORMULÁRIO SER SUBMETIDO SE HOUVER ALGUM CAMPO VAZIO OU COM ERRO.
    //NÃO VALIDA OS FORMS DE CONFIRMAÇÃO
    if($scope.administradorForm.nome == undefined || $scope.administradorForm.cpf == undefined || $scope.administradorForm.email == undefined || $scope.administradorForm.senha == undefined){

      $ionicPopup.alert({title: 'Erro!', template: 'Por favor, preencha todos os campos corretamente.'});

    }else{

      Administradores.salvar($scope.administradorForm).then(function() {
        $ionicPopup.alert({title: 'Sucesso', template: 'Dados salvos com êxito.'});
      }, function() {
        $ionicPopup.alert({title: 'Erro', template: 'Ocorreu um erro ao salvar.'});
      });

      $state.go('tab.administradores');

    }
  }
})

.controller("ParametroCtrl", function($scope, $ionicPopup, Parametro){

  Parametro.buscarPorId().then(function(resposta){
    $scope.parametro = resposta;
  });

  $scope.salvarParametro = function(){
    Parametro.salvar($scope.parametro).then(function() {
      $ionicPopup.alert({title: 'Sucesso', template: 'Dados atualizados com êxito.'});
    }, function() {
      $ionicPopup.alert({title: 'Erro', template: 'Ocorreu um erro ao salvar.'});
    });
  }
})

.controller('GerarTicketCtrl', function($scope, $ionicSideMenuDelegate, $state, Ticket) {
  $ionicSideMenuDelegate.canDragContent(false);
  Ticket.gerar().then(function(ticketId){
    var qrcode = new QRCode("qrcode").makeCode("ticketId=" + ticketId.id);
  });
})

.controller('CalcularTicketCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup, $stateParams, $state, Ticket) {
  $ionicSideMenuDelegate.canDragContent(false);
  Ticket.calcular($stateParams.ticketId).then(function(resposta){
    $scope.valor = resposta.valor;
    $scope.permanencia = resposta.permanencia;
  });

  $scope.card = {};

  $ionicPopup.show({
    template: '<ion-radio ng-model="cartaoSelecionado" ng-value="hahaha">Cartao 1</ion-radio>',
    title: 'Selecione um cartão',
    scope: $scope,
    cssClass: "popup-cartao",
    buttons: [
      { text: 'Cancelar' },
      {
        text: 'Pagar',
        type: 'button-positive',
        onTap: function(e) {
            return $scope.cartaoSelecionado;
        }
      },
      {
        text: '',
        type: 'ion-plus-circled adicionar-cartao',
        onTap: function(e) {
          $state.go('tab.cadastrar-cartao');
        }
      }
    ]
  });
})

.controller('CadastrarCartaoCtrl', function($scope) {

});
