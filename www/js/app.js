// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'diretiva.maximo', 'starter.administradorService', 'starter.parametroService', 'starter.cartaoService', 'starter.ticketService', 'starter.relatorioService', 'ui.utils.masks', 'ngCpfCnpj', 'restangular', 'credit-cards', 'LocalStorageModule', 'ngTable'])
.constant('ApiEndpoint', {
  url: 'http://localhost:8080/'
})
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

.config(function($stateProvider, $urlRouterProvider, RestangularProvider, localStorageServiceProvider) {
  RestangularProvider.setBaseUrl('http://localhost:8080/');
  localStorageServiceProvider.setPrefix('qrParking');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

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
    .state('tab.relatorios', {
      url: '/relatorios',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-relatorios.html',
          controller: 'RelatoriosCtrl'
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
  // PÁGINA SOBRE
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
 //PÁGINA SOBRE

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/inicio');

});
