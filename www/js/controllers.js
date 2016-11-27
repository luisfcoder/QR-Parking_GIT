angular.module('starter.controllers', [])

.controller('InicioCtrl', function($scope,localStorageService) {

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
      $scope.administradorFormConf = angular.copy($scope.administrador);
    });
  }

  $scope.salvarAdministrador = function(){
    //REGRA CRIADA PARA NAO DEIXAR O FORMULÁRIO SER SUBMETIDO SE HOUVER ALGUM CAMPO VAZIO OU COM ERRO.
    //NÃO VALIDA OS FORMS DE CONFIRMAÇÃO
    if($scope.administradorForm.nome == undefined || $scope.administradorForm.cpf == undefined || $scope.administradorForm.email == undefined || $scope.administradorForm.senha == undefined || $scope.administradorForm.confirmacaoEmail == undefined || $scope.administradorForm.confirmacaoSenha == undefined){

      $ionicPopup.alert({title: 'Erro', template: 'Por favor, preencha todos os campos corretamente.'});

    }else{
      Administradores.salvar($scope.administradorForm).then(function() {
        $ionicPopup.alert({title: 'Sucesso', template: 'Dados salvos com êxito.'});
        $state.go('tab.administradores');
      }, function(resposta) {
        $ionicPopup.alert({title: 'Erro', template: resposta.data.message});
      });

    }
  }
})

.controller("ParametroCtrl", function($scope, $ionicPopup, Parametro){

  Parametro.buscarAtual().then(function(resposta){
    $scope.parametro = resposta;
  });

  $scope.salvarParametro = function(){

    if($scope.parametro.tolerancia == undefined || $scope.parametro.justificativa == undefined){
      $ionicPopup.alert({title: 'Erro', template: 'Por favor, preencha todos os campos corretamente.'});
      return;
    }

    Parametro.salvar($scope.parametro).then(function() {
      $ionicPopup.alert({title: 'Sucesso', template: 'Parâmetros atualizados com êxito.'});
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

.controller('CalcularTicketCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup, $stateParams, $state, Ticket, localStorageService, Cartao) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.dadosPagamento = {};
  $scope.dadosPagamento.ticket = {};
  $scope.dadosPagamento.ticket.id = $stateParams.ticketId;
  $scope.comprovante = {};

  Ticket.calcular($stateParams.ticketId).then(function(resposta){
    $scope.dadosPagamento.valor = resposta.valor;
    $scope.permanencia = resposta.permanencia;
  });

  $scope.formaPagamento = function(){
    $ionicPopup.show({
      template: buscarCartoes(),
      title: 'Selecione um cartão',
      scope: $scope,
      cssClass: "popup-cartao",
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Pagar',
          type: 'button-positive',
          onTap: function(e) {
            if ($scope.dadosPagamento.cartao >= 0) {
              processarPagamento();
              return;
            } else {
              $ionicPopup.alert({title: 'Erro', template: "Selecione um cartão"});
              e.preventDefault();
            }
          }
        },
        {
          text: '',
          type: 'ion-plus-circled adicionar-cartao',
          onTap: function(e) {
            $state.go('tab.cadastrar-cartao', {"ticketId":$stateParams.ticketId});
          }
        }
      ]
    });
  }

  function processarPagamento(){
    Ticket.processarPagamento($scope.dadosPagamento).then(function() {
      $scope.pago = true;
      respostaEnvioEmail();
    }, function(resposta) {
      $ionicPopup.alert({title: 'Erro', template: resposta.data.message});
    });
  }

  function respostaEnvioEmail(){
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="comprovante.email">',
      title: 'Ticket pago',
      subTitle: 'Informe seu email para receber o comprovante',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Enviar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.comprovante.email) {
              e.preventDefault();
            } else {
              //Email.enviarEmail(titulo, assunto);
              return;
            }
          }
        }
      ]
    });
  }

  function buscarCartoes(){
    var cartoes = localStorageService.keys();
    var template = '';
    for (var i = 0; i < cartoes.length; i++){
      var cartao = localStorageService.get(cartoes[i]);
      var numberoAbreviado = cartao.number.substr(12, 4);
      var bandeira = Cartao.buscarBandeiraCartao(cartao.number);
      template = template + '<ion-radio ng-model="dadosPagamento.cartao" ng-value="'+i+'">'+bandeira + " Final " + numberoAbreviado +'</ion-radio>'
    }
    return template;
  }
})

.controller('CadastrarCartaoCtrl', function($scope, $state, localStorageService, $stateParams) {
  //limpa todos os cartões, usar somente me desenvolvimento
  //localStorageService.clearAll();

  $scope.card = {};
  $scope.salvarCartao = function(){
    localStorageService.set(new Date().getTime(), $scope.card);
    $state.go('tab.calcular-ticket', {"ticketId":$stateParams.ticketId});
  }

  $scope.voltar = function(){
    $state.go('tab.calcular-ticket', {"ticketId":$stateParams.ticketId});
  }

})

.controller('RelatorioFinanceiroCtrl', function($scope, NgTableParams, Relatorio, ionicDatePicker, datetime, $ionicPopup) {
  function init(){
    $scope.periodo = {};

    $scope.buscarPorPeriodo();
  }

  var inicial = {
    callback: function (val) {
      $scope.periodo.dataInicial = new Date(val);
    }
  };

  var final = {
    callback: function (val) {
      $scope.periodo.dataFinal = new Date(val);
    }
  };

  $scope.calendarioInicial = function(){
    ionicDatePicker.openDatePicker(inicial);
  };

  $scope.calendarioFinal = function(){
    ionicDatePicker.openDatePicker(final);
  };

  $scope.buscarPorPeriodo = function(){
    Relatorio.buscarRelatorioFinanceiroPorPeriodo($scope.periodo).then(function(resposta){
      $scope.total = calcularTotal(resposta);
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {
            id: 'asc'
        }
      }, {
        dataset: resposta
      });
    }, function(erro) {
      $ionicPopup.alert({title: 'Erro', template: erro.data.message});
    });
  };

  $scope.limpar = function(){
    $scope.periodo.dataInicial = null;
    $scope.periodo.dataFinal = null;
  }

  function calcularTotal(resposta){
    var soma = 0;
    for(var i = 0; i<resposta.length; i++){
      soma += resposta[i].valorPago;
    }
    return soma;
  }

  init();

})

.controller('RelatorioParametroCtrl', function($scope, NgTableParams, Relatorio, ionicDatePicker, datetime, $ionicPopup) {
  function init(){
    $scope.periodo = {};

    $scope.buscarPorPeriodo();
  }

  var inicial = {
    callback: function (val) {
      $scope.periodo.dataInicial = new Date(val);
    }
  };

  var final = {
    callback: function (val) {
      $scope.periodo.dataFinal = new Date(val);
    }
  };

  $scope.calendarioInicial = function(){
    ionicDatePicker.openDatePicker(inicial);
  };

  $scope.calendarioFinal = function(){
    ionicDatePicker.openDatePicker(final);
  };

  $scope.buscarPorPeriodo = function(){
    Relatorio.buscarRelatorioParametroPorPeriodo($scope.periodo).then(function(resposta){
      $scope.total = calcularTotal(resposta);
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {
            dtAlteracao: 'asc'
        }
      }, {
        dataset: resposta
      });
    }, function(erro) {
      $ionicPopup.alert({title: 'Erro', template: erro.data.message});
    });
  };

  $scope.limpar = function(){
    $scope.periodo.dataInicial = null;
    $scope.periodo.dataFinal = null;
  }

  function calcularTotal(resposta){
    var soma = 0;
    for(var i = 0; i<resposta.length; i++){
      soma += resposta[i].valorPago;
    }
    return soma;
  }

  init();

});
