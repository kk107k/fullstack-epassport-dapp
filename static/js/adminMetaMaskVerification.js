
async function adminCheckMetaMask() {
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.enable();
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            adminMetamaskAddress = accounts[0]; // Store the MetaMask address in the global variable
            console.log("MetaMask address:", adminMetamaskAddress);
            adminLogin(adminMetamaskAddress); // Call the login function with the MetaMask address obtained from the global variable
        } catch (error) {
            console.error("Error accessing MetaMask:", error);
            // Handle error, e.g., display a message to the user
        }
    } else {
        console.log("MetaMask not detected");
        // MetaMask is not installed or not supported
    }
}

let adminMetamaskAddress; // Declare a global variable to store the MetaMask address


// Check MetaMask status and call loginWithMetaMask when the button is pressed
document.getElementById('adminLoginButton').addEventListener('click', function() {
    adminCheckMetaMask();
});
