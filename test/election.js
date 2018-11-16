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
        })
    })
});

