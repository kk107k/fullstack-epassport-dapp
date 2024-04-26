// test.js

const { ethers } = require('ethers');
const * as Constants = require("./config");

const sendTestData = async () => {
    const testData = {
        name: "John Doe",
        passportNumber: "AB123456",
        nationality: "USA",
        birthDate: "1990-01-01",
        placeOfBirth: "New York",
        sex: "Male",
        issueDate: "2024-04-24",
        expiryDate: "2029-04-24"
    };

    try {
        const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL);
        const signer = new ethers.Wallet(Constants.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        
        // Convert birthDate, issueDate, and expiryDate to timestamps
        const birthTimestamp = new Date(testData.birthDate).getTime();
        const issueTimestamp = new Date(testData.issueDate).getTime(); 
        const expiryTimestamp = new Date(testData.expiryDate).getTime();
        
        // Call the addPassport function in the smart contract
        await contract.addPassport(
            testData.name,
            testData.passportNumber,
            testData.nationality,
            birthTimestamp,
            testData.placeOfBirth,
            testData.sex,
            issueTimestamp,
            expiryTimestamp
        );

        console.log("Passport added successfully");
    } catch (error) {
        console.error("Error adding passport:", error);
    }
};

module.exports = { sendTestData };
