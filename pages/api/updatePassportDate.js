import { ethers } from "ethers";
import * as Constants from "../../Utils/config";

async function handler(req, res) {
    const { index, issueDate, expiryDate } = req.body;

    try {
        const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL);
        const signer = new ethers.Wallet(Constants.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        
        // Call the updatePassportDate function in the smart contract
        await contract.updatePassportDates(index, issueDate, expiryDate);

        res.status(200).json({ message: "Passport dates updated successfully" });
    } catch (error) {
        console.error("Error updating passport dates:", error);
        res.status(500).json({ message: "Failed to update passport dates" });
    }
}

export default handler;
