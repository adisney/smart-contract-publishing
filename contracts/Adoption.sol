pragma solidity ^0.4.21;

contract Adoption {
    address[16] public adopters;

    event AdoptionSuccessful(uint petId, address adopter);

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);
        adopters[petId] = msg.sender;
        emit AdoptionSuccessful(petId, msg.sender);
        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16]) {
        return adopters;
    }
}
