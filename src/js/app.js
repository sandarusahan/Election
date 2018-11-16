App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    ethereum.enable();
    return App.initWeb3();
    
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election){
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      
      if(err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidateResults = $("#candidatesResults");
      candidateResults.empty();

      var candidatesSelect = $("#candidatesSelect");
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var fName = candidate[1];
          var lName = candidate[2];
          var party = candidate[3];
          var voteCount = candidate[4];

          var candidateTemplate = "<tr><th>" + id + "</th><td>" + fName + "</td><td>" + lName + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"
          candidateResults.append(candidateTemplate);

          var candidateOption = "<option value='" + id + "'>" + fName + "' '" + lName + "</option>"
          candidatesSelect.append(candidateOption);

        });

      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted){
      if(hasVoted){
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error){
      console.warn(error);
    });
  },

  castVote: function() {
      var candidateId = $('#candidatesSelect').val();
      App.contracts.Election.deployed().then(function(instance){
        return instance.vote(candidateId, { from: App.account });
      }).then(function(result) {
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err) {
        console.log(err);
      });
  } 

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
