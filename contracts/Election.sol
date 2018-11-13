// solium-disable linebreak-style
pragma solidity ^0.4.24;

contract Election {
    
    struct Candidate{
        uint id;
        string firstName;
        string lastName;
        string party;
        uint voteCount;

    }

    mapping(uint => Candidate) public candidates;

    uint public  candidatesCount;

    constructor () public {
        addCandidate("A", "a", "P1");
        addCandidate("B", "b", "P2");
        addCandidate("C", "c", "P3");

    } 

    function addCandidate(string _fName, string _lName, string _party) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _fName, _lName, _party, 0);
    } 
}