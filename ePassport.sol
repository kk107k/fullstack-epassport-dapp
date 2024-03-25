// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PassportRegistry {
    address public owner;
    
    struct Passport {
        string name;
        string passportNumber;
        string nationality;
        uint256 birthDate;
        string placeOfBirth;
        string sex;
        uint256 issueDate;
        uint256 expiryDate;
    }

    Passport[] public passports;

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
        passports.push(Passport({
            name: _name,
            passportNumber: _passportNumber,
            nationality: _nationality,
            birthDate: _birthDate,
            placeOfBirth: _placeOfBirth,
            sex: _sex,
            issueDate: _issueDate,
            expiryDate: _expiryDate
        }));
    }

    function editPassport(
        uint256 id,
        string memory _name,
        string memory _passportNumber,
        string memory _nationality,
        uint256 _birthDate,
        string memory _placeOfBirth,
        string memory _sex,
        uint256 _issueDate,
        uint256 _expiryDate
    ) public onlyOwner {
        require(id < passports.length, "Passport does not exist");
        passports[id].name = _name;
        passports[id].passportNumber = _passportNumber;
        passports[id].nationality = _nationality;
        passports[id].birthDate = _birthDate;
        passports[id].placeOfBirth = _placeOfBirth;
        passports[id].sex = _sex;
        passports[id].issueDate = _issueDate;
        passports[id].expiryDate = _expiryDate;
    }

    function removePassport(uint256 id) public onlyOwner {
        require(id < passports.length, "Passport does not exist");

        for (uint256 i = id; i < passports.length - 1; i++) {
            passports[i] = passports[i + 1];
        }
        passports.pop();
    }

    function deletePassport(uint256 id) public onlyOwner {
        require(id < passports.length, "Passport does not exist");

        for (uint256 i = id; i < passports.length - 1; i++) {
            passports[i] = passports[i + 1];
        }
        passports.pop();
    }

    function deleteAllPassports() public onlyOwner {
        delete passports;
    }

    function getAllPassportsCount() public view returns (uint256) {
        return passports.length;
    }

    function getPassportByNumber(string memory _passportNumber) public view returns (
        string memory name,
        string memory passportNumber,
        string memory nationality,
        uint256 birthDate,
        string memory placeOfBirth,
        string memory sex,
        uint256 issueDate,
        uint256 expiryDate
    ) {
        for (uint256 i = 0; i < passports.length; i++) {
            if (keccak256(abi.encodePacked(passports[i].passportNumber)) == keccak256(abi.encodePacked(_passportNumber))) {
                Passport memory passport = passports[i];
                return (
                    passport.name,
                    passport.passportNumber,
                    passport.nationality,
                    passport.birthDate,
                    passport.placeOfBirth,
                    passport.sex,
                    passport.issueDate,
                    passport.expiryDate
                );
            }
        }
        revert("Passport not found");
    }

    function getAllPassports() public view returns (Passport[] memory) {
        return passports;
    }

    function updatePassportDates(uint256 id, uint256 _issueDate, uint256 _expiryDate) public onlyOwner {
    require(id < passports.length, "Passport does not exist");
    passports[id].issueDate = _issueDate;
    passports[id].expiryDate = _expiryDate;
    }
}
