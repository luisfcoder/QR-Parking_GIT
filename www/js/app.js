angular.module('starter', ['ionic', 'starter.controllers', 'diretiva.maximo', 'starter.administradorService', 'starter.parametroService', 'starter.cartaoService', 'starter.ticketService', 'starter.relatorioService', 'ui.utils.masks', 'ngCpfCnpj', 'restangular', 'credit-cards', 'LocalStorageModule', 'ngTable', 'ionic-datepicker', 'datetime', 'ngCordova', 'qrScanner'])
.filter('yesNo', function () {
  return function (boolean) {
    return boolean ? 'Yes' : 'No';
  }
})
.directive("maximo", [function() {
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      var limit = parseInt(attrs.limitTo);
      angular.element(elem).on("keypress", function(e) {
        if (this.value.length == limit) e.preventDefault();
      });
    }
  }
}])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, RestangularProvider, localStorageServiceProvider, ionicDatePickerProvider) {
  RestangularProvider.setBaseUrl('http://192.168.0.4:8080/');
  localStorageServiceProvider.setPrefix('qrParking');
  var datePickerObj = {
    inputDate: new Date(),
    titleLabel: 'Selecione uma data',
    todayLabel: 'Hoje',
    closeLabel: 'Fechar',
    mondayFirst: false,
    weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
    monthsList: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    templateType: 'popup',
    from: new Date(2016, 8, 1),
    to: new Date(2025, 8, 1),
    showTodayButton: false,
    dateFormat: 'dd/MM/yyyy',
    closeOnSelect: true,
    disableWeekdays: []
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.leitor', {
    url: '/leitor/:local',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-leitor.html',
        controller: 'LeitorCtrl'
      }
    }
  })
  .state('tab.inicio', {
    url: '/inicio',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-inicio.html',
        controller: 'InicioCtrl'
      }
    }
  })
  .state('tab.login', {
    url: '/login',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('tab.administradores', {
    url: '/administradores',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-administradores.html',
        controller: 'AdministradoresCtrl'
      }
    }
  })
  .state('tab.parametros', {
    url: '/parametros',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-parametros.html',
        controller: 'ParametroCtrl'
      }
    }
  })
  .state('tab.relatorio-financeiro', {
    url: '/relatorio-financeiro',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-relatorio-financeiro.html',
        controller: 'RelatorioFinanceiroCtrl'
      }
    }
  })
  .state('tab.relatorio-parametro', {
    url: '/relatorio-parametro',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-relatorio-parametro.html',
        controller: 'RelatorioParametroCtrl'
      }
    }
  })
  .state('tab.administrador-detail', {
    url: '/administradores/:administradorId',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/administrador-detail.html',
        controller: 'AdministradorDetailCtrl'
      }
    }
  })
  .state('tab.calcular-ticket', {
    url: '/usuario/calcular-ticket/:ticketId',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/usuario/calcular-ticket.html',
        controller: 'CalcularTicketCtrl'
      }
    }
  })
  .state('tab.gerar-ticket', {
    url: '/usuario/gerar-ticket',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/usuario/gerar-ticket.html',
        controller: 'GerarTicketCtrl'
      }
    }
  })
  .state('tab.cadastrar-cartao', {
    url: '/usuario/cadastrar-cartao/:ticketId',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/usuario/cadastrar-cartao.html',
        controller: 'CadastrarCartaoCtrl'
      }
    }
  })
  .state('tab.sobre', {
    url: '/sobre',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-sobre.html',
        controller: 'InicioCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/leitor/entrada');

});
