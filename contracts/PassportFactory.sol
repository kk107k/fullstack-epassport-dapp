// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ePassport.sol";

contract PassportFactory {
    address public owner;
    address[] public passportContracts;

    struct PassportDetails {
        address passportAddress;
        string name;
        string passportNumber;
        string nationality;
        uint256 birthDate;
        string placeOfBirth;
        string sex;
        uint256 issueDate;
        uint256 expiryDate;
    }

    mapping(address => PassportDetails) public passportDetailsMap;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function addPassport(
        string memory _name,
        string memory _passportNumber,
        string memory _nationality,
        uint256 _birthDate,
        string memory _placeOfBirth,
        string memory _sex,
        uint256 _issueDate,
        uint256 _expiryDate
    ) public onlyOwner {
        PassportRegistry newPassportContract = new PassportRegistry();
        newPassportContract.addPassport(
            _name,
            _passportNumber,
            _nationality,
            _birthDate,
            _placeOfBirth,
            _sex,
            _issueDate,
            _expiryDate
        );
        address passportAddress = address(newPassportContract);
        passportContracts.push(passportAddress);
        
        passportDetailsMap[passportAddress] = PassportDetails(
            passportAddress,
            _name,
            _passportNumber,
            _nationality,
            _birthDate,
            _placeOfBirth,
            _sex,
            _issueDate,
            _expiryDate
        );
    }

    function getPassport(address _passportAddress) public view returns (
        string memory name,
        string memory passportNumber,
        string memory nationality,
        uint256 birthDate,
        string memory placeOfBirth,
        string memory sex,
        uint256 issueDate,
        uint256 expiryDate,
        address ePassportAddress
    ) {
        PassportDetails memory details = passportDetailsMap[_passportAddress];
        return (
            details.name,
            details.passportNumber,
            details.nationality,
            details.birthDate,
            details.placeOfBirth,
            details.sex,
            details.issueDate,
            details.expiryDate,
            details.passportAddress
        );
    }

    function deletePassport(uint256 index) public onlyOwner {
        require(index < passportContracts.length, "Invalid index");
        delete passportContracts[index];
    }

    function updatePassportDate(uint256 id, uint256 _issueDate, uint256 _expiryDate) public onlyOwner {
    require(id < passportContracts.length, "Invalid index");
    PassportRegistry passportContract = PassportRegistry(passportContracts[id]);
    passportContract.updatePassportDates(id, _issueDate, _expiryDate);

    // Update passport details in passportDetailsMap
    PassportDetails storage details = passportDetailsMap[passportContracts[id]];
    details.issueDate = _issueDate;
    details.expiryDate = _expiryDate;
}




    function getPassportContracts() public view returns (address[] memory) {
        return passportContracts;
    }

    function getAllPassports() public view returns (PassportDetails[] memory) {
        PassportDetails[] memory allPassports = new PassportDetails[](passportContracts.length);
        for (uint256 i = 0; i < passportContracts.length; i++) {
            allPassports[i] = passportDetailsMap[passportContracts[i]];
        }
        return allPassports;
    }

    function deleteAllPassports() public onlyOwner {
        for (uint256 i = 0; i < passportContracts.length; i++) {
            PassportRegistry(passportContracts[i]).deleteAllPassports();
        }
        delete passportContracts;
    }
}