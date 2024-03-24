import { ethers } from "ethers";
import * as Constants from "../../Utils/config";

async function handler(req, res) {
    const { index } = req.body; // Assuming the index of the passport to be deleted is sent in the request body

    try {
        const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL);
        const signer = new ethers.Wallet(Constants.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        
        // Call the deletePassport function in the smart contract
        await contract.deletePassport(index);

        res.status(200).json({ message: "Passport deleted successfully" });
    } catch (error) {
        console.error("Error deleting passport:", error);
        res.status(500).json({ message: "Failed to delete passport" });
    }
}

export default handler;
