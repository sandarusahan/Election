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

    mapping(address => bool) public voters;

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

    function vote(uint _candidateId) public {

        require(!voters[msg.sender]);

        require(_candidateId>0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount ++;
    }
}