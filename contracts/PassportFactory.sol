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
        string birthDate;
        string placeOfBirth;
        string sex;
        string issueDate;
        string expiryDate;
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
    string memory _birthDate,
    string memory _placeOfBirth,
    string memory _sex,
    string memory _issueDate,
    string memory _expiryDate
) public onlyOwner {
    uint256 birthDateTimestamp = stringToTimestamp(_birthDate);
    uint256 issueDateTimestamp = stringToTimestamp(_issueDate);
    uint256 expiryDateTimestamp = stringToTimestamp(_expiryDate);

    PassportRegistry newPassportContract = new PassportRegistry();
    newPassportContract.addPassport(
        _name,
        _passportNumber,
        _nationality,
        birthDateTimestamp, // Pass uint256 instead of string
        _placeOfBirth,
        _sex,
        issueDateTimestamp, // Pass uint256 instead of string
        expiryDateTimestamp // Pass uint256 instead of string
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

    function stringToTimestamp(string memory _date) internal pure returns (uint256) {
        bytes memory b = bytes(_date);
        require(b.length == 10, "Invalid date format");
        uint256 year = parseInt(_substring(b, 6, 4));
        uint256 month = parseInt(_substring(b, 0, 2));
        uint256 day = parseInt(_substring(b, 3, 2));
        require(year >= 1970, "Year must be greater than or equal to 1970");

        return _toTimestamp(year, month, day);
    }

    function parseInt(string memory _a) internal pure returns (uint256) {
        bytes memory bresult = bytes(_a);
        uint256 mint = 0;
        bool decimals = false;
        for (uint256 i = 0; i < bresult.length; i++) {
            if ((uint256(uint8(bresult[i])) >= 48) && (uint256(uint8(bresult[i])) <= 57)) {
                if (decimals) {
                    break;
                }
                mint *= 10;
                mint += uint256(uint8(bresult[i])) - 48;
            } else if (uint256(uint8(bresult[i])) == 46) {
                decimals = true;
            } else {
                revert();
            }
        }
        return mint;
    }

    function _substring(bytes memory _a, uint256 _startIndex, uint256 _endIndex) internal pure returns (string memory) {
        require(_startIndex <= _endIndex && _endIndex < _a.length, "Invalid substring indices");
        bytes memory result = new bytes(_endIndex - _startIndex + 1);
        for (uint256 i = _startIndex; i <= _endIndex; i++) {
            result[i - _startIndex] = _a[i];
        }
        return string(result);
    }

    function _toTimestamp(uint256 _year, uint256 _month, uint256 _day) internal pure returns (uint256 timestamp) {
        uint256 c = 0;
        if (_month <= 2) {
            _year--;
            _month += 12;
        }
        uint256 _e = _year / 100;
        uint256 _f = 2 - _e + (_e / 4);
        c = 36525 * (_year + 4716) / 100;
        uint256 d = 306 * (_month + 1) / 10;
        return (c + d + _day + _f - 1524) * 86400 - 10800;
    }

    function deletePassport(uint256 index) public onlyOwner {
        require(index < passportContracts.length, "Invalid index");
        delete passportContracts[index];
    }

    function updatePassportDate(uint256 id, string memory _issueDate, string memory _expiryDate) public onlyOwner {
        require(id < passportContracts.length, "Invalid index");
        PassportRegistry passportContract = PassportRegistry(passportContracts[id]);
        passportContract.updatePassportDates(id, stringToTimestamp(_issueDate), stringToTimestamp(_expiryDate));

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
