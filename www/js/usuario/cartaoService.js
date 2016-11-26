angular.module('starter.cartaoService', [])

.factory('Cartao', function(Restangular) {
  var endpoint = "cartao/";

  return {
      buscarBandeiraCartao: function(cardNumber){

      var regexVisa = /^4[0-9]{12}(?:[0-9]{3})?/;
      var regexMaster = /^5[1-5][0-9]{14}/;
      var regexAmex = /^3[47][0-9]{13}/;
      var regexDiners = /^3(?:0[0-5]|[68][0-9])[0-9]{11}/;
      var regexDiscover = /^6(?:011|5[0-9]{2})[0-9]{12}/;

      if(regexVisa.test(cardNumber)){
        return 'Visa';
      }
      if(regexMaster.test(cardNumber)){
        return 'Mastercard';
      }
      if(regexAmex.test(cardNumber)){
        return 'Amex';
      }
      if(regexDiners.test(cardNumber)){
        return 'Diners';
      }
      if(regexDiscover.test(cardNumber)){
        return 'Discover';
      }
      return '';
    }
  };
});
