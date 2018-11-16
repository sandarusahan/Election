var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;
    it("initializes with two candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 3);
        });
    });

    it("It initializes the candidates with correct values", function(){
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate) {
            assert.equal(candidate[0], 1, "Contains the correct id");
            assert.equal(candidate[1], "A", "Contains the correct first name");
            assert.equal(candidate[2], "a", "Contains the correct last name");
            assert.equal(candidate[3], "P1", "Contains the correct party");
            assert.equal(candidate[4], 0, "Contains the correct votes count");
            return electionInstance.candidates(2);
        }).then(function(candidate) {
            assert.equal(candidate[0], 2, "Contains the correct id");
            assert.equal(candidate[1], "B", "Contains the correct first name");
            assert.equal(candidate[2], "b", "Contains the correct last name");
            assert.equal(candidate[3], "P2", "Contains the correct party");
            assert.equal(candidate[4], 0, "Contains the correct votes count");
        });
    });

    it("It allows a voter to cast a vote", function(){
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, {from: accounts[0]});
        }).then(function(receipt) {
            return electionInstance.voters(accounts[0]);
        }).then(function(voted) {
            assert(voted, "The voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
            var voteCount = candidate[4];
            assert.equal(voteCount, 1, "Increments the candidate's vote count");
        });
    });

    it("It thrwos an exception for invalid candidates", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.vote(99, {from: accounts[0]});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1) {
            var voteCount = candidate1[4];
            assert.equal(voteCount, 1, "candidate 1 did not received any votes");
            return electionInstance.candidates(2);
        }).then(function(candidate2) {
            var voteCount = candidate2[4];
            assert.equal(voteCount, 0, "candidate 2 did not received any votes");
        });
    })

    it("It thrwos an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, {from: accounts[1]});
            return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
            var voteCount = candidate[4];
            assert.equal(voteCount, 1, "accepts first vote");
            return electionInstance.vote(candidateId, {from: accounts[1]}); 
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1) {
            var voteCount = candidate1[4];
            assert.equal(voteCount, 1, "candidate 1 did not received any votes");
            return electionInstance.candidates(2);
        }).then(function(candidate2) {
            var voteCount = candidate2[4];
            assert.equal(voteCount, 1, "candidate 2 did not received any votes");
        });
    })

});

