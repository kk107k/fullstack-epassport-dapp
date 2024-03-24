export const API_URL = "https://volta-rpc.energyweb.org/";
export const PRIVATE_KEY = "efc4fc54cdfe525a147245ef5f833b16d1130caea768e046fb064b3a30b019e6"; 
export const contractAddress = "0x3b55Af38D847ecB0Eb97709352F8432B9aAb1797";
export const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_passportNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nationality",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_birthDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_placeOfBirth",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_sex",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_issueDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_expiryDate",
				"type": "uint256"
			}
		],
		"name": "addPassport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deleteAllPassports",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "deletePassport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_passportNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nationality",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_birthDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_placeOfBirth",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_sex",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_issueDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_expiryDate",
				"type": "uint256"
			}
		],
		"name": "editPassport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "removePassport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getAllPassports",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "passportNumber",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "nationality",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "birthDate",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "placeOfBirth",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "sex",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "issueDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "expiryDate",
						"type": "uint256"
					}
				],
				"internalType": "struct PassportRegistry.Passport[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPassportsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_passportNumber",
				"type": "string"
			}
		],
		"name": "getPassportByNumber",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "passportNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nationality",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "birthDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "placeOfBirth",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "sex",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "issueDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "passports",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "passportNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nationality",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "birthDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "placeOfBirth",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "sex",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "issueDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];