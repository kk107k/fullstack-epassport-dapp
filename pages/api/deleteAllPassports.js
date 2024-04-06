import { ethers } from "ethers";
import * as Constants from "../../Utils/config";

async function handler(req, res) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL);
        const signer = new ethers.Wallet(Constants.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        
        // Call the deleteAllPassports function in the smart contract
        await contract.deleteAllPassports();

        res.status(200).json({ message: "All passports deleted successfully" });
    } catch (error) {
        console.error("Error deleting all passports:", error);
        res.status(500).json({ message: "Failed to delete all passports" });
    }
}

export default handler;
