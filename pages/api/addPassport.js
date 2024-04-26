import { ethers } from "ethers";
import * as Constants from "../../Utils/config";

async function handler(req, res) {
    const {
        name,
        passportNumber,
        nationality,
        birthDate,
        placeOfBirth,
        sex,
        issueDate,
        expiryDate
    } = req.body;

    try {
        const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL);
        const signer = new ethers.Wallet(Constants.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        
        // Convert birthDate, issueDate, and expiryDate to timestamps
        const birthTimestamp = new Date(birthDate).getTime();
        const issueTimestamp = new Date(issueDate).getTime(); 
        const expiryTimestamp = new Date(expiryDate).getTime();
        
        // Call the addPassport function in the smart contract
        await contract.addPassport(
            name,
            passportNumber,
            nationality,
            birthTimestamp,
            placeOfBirth,
            sex,
            issueTimestamp,
            expiryTimestamp
        );

        res.status(200).json({ message: "Passport added successfully" });
    } catch (error) {
        console.error("Error adding passport:", error);
        res.status(500).json({ message: "Failed to add passport" });
    }
}

export default handler;
