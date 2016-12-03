angular.module('starter.controllers', [])

.controller('LeitorCtrl', function($scope, $state, $stateParams, $cordovaBarcodeScanner, $ionicPopup, $ionicHistory, $window, $ionicSideMenuDelegate, Ticket) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.exibeNavegador = false;

  $scope.lerQrCode = function() {
    try{
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        destino(imageData.text);
      }, function(error) {
        $ionicPopup.alert({title: 'Erro', template: error});
      });
    } catch (e) {
      $scope.exibeNavegador = true;
    }
  };

  $scope.onSuccess = function(imageData) {
    destino(imageData);
  };
  $scope.onError = function(error) {
  };
  $scope.onVideoError = function(error) {
    $ionicPopup.alert({title: 'Erro', template: error});
  };

  function destino(imageData){
    var ticket = imageData.split("=");

    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });

    if($stateParams.local != "saida"){
      if(ticket[0] == "ticketId"){
        $state.go('tab.calcular-ticket', {"ticketId":ticket[1]});
      }else if(ticket[0] == "administrador"){
        $window.location.href = '#/tab/login';
      }else{
        $ionicPopup.alert({title: 'Erro', template: "Ticket inválido, procure a administração." + imageData});
      }


    }else{
      Ticket.validarSaida(ticket[1]).then(function(resposta){
        $ionicPopup.alert({title: 'Obrigado', template: resposta.valor});
      }, function(erro){
        $ionicPopup.alert({title: 'Erro', template: erro.data.message});
      });
    }
  }
})

.controller('InicioCtrl', function($scope, localStorageService, Autenticacao) {
  Autenticacao.verificar();
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, localStorageService, Autenticacao, $ionicHistory) {
  $scope.loginForm = {};

  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  $scope.entrar = function(){
    Autenticacao.autenticar($scope.loginForm).then(function(resposta){
      localStorageService.set("usuarioLogado", resposta);
      $state.go('tab.inicio');
    }, function(erro){
      $ionicPopup.alert({title: 'Erro', template: erro.data.message});
    })
  }

  $scope.sair = function(){
    localStorageService.remove("usuarioLogado");
  }
})

.controller('AdministradoresCtrl', function($scope, Administradores, $ionicPopup, Autenticacao, localStorageService) {
  Autenticacao.verificar();
  var logado = localStorageService.get("usuarioLogado");
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
    if(logado.id != administrador.id){
      if(administrador.dtInativacao == null){
        administrador.dtInativacao = new Date();
      }else{
        administrador.dtInativacao = null;
      }
      Administradores.salvar(administrador);
    }else{
      $ionicPopup.alert({title: 'Erro', template: "O administrador logado, não pode desativar seu registro."});
    }
  }
})

.controller('AdministradorDetailCtrl', function($scope, $ionicPopup, $stateParams, Administradores, $state, Autenticacao) {
  Autenticacao.verificar();
  $scope.administrador = {};
  $scope.administradorForm = {};
  $scope.administradorFormConf = {}
  if($stateParams.administradorId != ""){
    Administradores.buscarPorId($stateParams.administradorId).then(function(resposta){
      $scope.administrador = resposta;
      $scope.administradorForm = angular.copy($scope.administrador);
      $scope.administradorFormConf = angular.copy($scope.administradorForm);
    });
  }

  $scope.salvarAdministrador = function(){
    //REGRA CRIADA PARA NAO DEIXAR O FORMULÁRIO SER SUBMETIDO SE HOUVER ALGUM CAMPO VAZIO OU COM ERRO.
    //NÃO VALIDA OS FORMS DE CONFIRMAÇÃO
    if($scope.administradorForm.id == undefined && ($scope.administradorForm.nome == undefined || $scope.administradorForm.cpf == undefined || $scope.administradorForm.email == undefined || $scope.administradorFormConf.email == undefined || $scope.administradorFormConf.novaSenha == undefined  || $scope.administradorFormConf.confirmacaoSenha == undefined)){

      $ionicPopup.alert({title: 'Erro', template: 'Por favor, preencha todos os campos corretamente.'});

    }else{
      $scope.administradorForm.senha = $scope.administradorFormConf.confirmacaoSenha;

      Administradores.salvar($scope.administradorForm).then(function() {
        $ionicPopup.alert({title: 'Sucesso', template: 'Dados salvos com êxito.'});
        $state.go('tab.administradores');
      }, function(resposta) {
        $ionicPopup.alert({title: 'Erro', template: resposta.data.message});
      });

    }
  }
})

.controller("ParametroCtrl", function($scope, $ionicPopup, Parametro, localStorageService, Autenticacao){
  Autenticacao.verificar();
  Parametro.buscarAtual().then(function(resposta){
    $scope.parametro = resposta;
  });

  $scope.salvarParametro = function(){

    if($scope.parametro.tolerancia == undefined || $scope.parametro.justificativa == undefined){
      $ionicPopup.alert({title: 'Erro', template: 'Por favor, preencha todos os campos corretamente.'});
      return;
    }
    $scope.parametro.administrador = localStorageService.get("usuarioLogado");
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
  }, function(erro){
    $ionicPopup.alert({title: 'Erro', template: erro.data.message});
    $state.go('tab.leitor', {"local": "entrada"});
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
    Ticket.processarPagamento($scope.dadosPagamento).then(function(retorno) {
      $scope.pago = true;
      $scope.comprovante.idPagamento = retorno.id;
      respostaEnvioEmail();
    }, function(resposta) {
      $ionicPopup.alert({title: 'Erro', template: resposta.data.message});
    });
  }

  function respostaEnvioEmail(){
    var myPopup = $ionicPopup.show({
      template: '<form name="form" novalidate><input type="email" name="email" ng-model="comprovante.email"><div class="col text-center"><span class="obrigatorio" ng-show="form.email.$dirty && form.email.$invalid"><span ng-show="form.email.$error.email">Email inválido.</span></span></div></form>',
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
              Ticket.enviarEmail($scope.comprovante).then(function(){
                $ionicPopup.alert({title: 'Obrigado', template: "Email enviado com exito."});
              }, function(erro){
                $ionicPopup.alert({title: 'Erro', template: "Ocorreu um erro ao enviar o comprovante."});
              });
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
  //limpa todos os cartões, usar somente em desenvolvimento
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

.controller('RelatorioFinanceiroCtrl', function($scope, NgTableParams, Relatorio, ionicDatePicker, datetime, $ionicPopup, Autenticacao) {
  Autenticacao.verificar();
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

.controller('RelatorioParametroCtrl', function($scope, NgTableParams, Relatorio, ionicDatePicker, datetime, $ionicPopup, Autenticacao) {
  Autenticacao.verificar();
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
