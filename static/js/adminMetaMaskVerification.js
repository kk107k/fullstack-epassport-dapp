
async function adminCheckMetaMask() {
    if (window.ethereum) {
        try {
            await window.ethereum.enable();
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            adminMetamaskAddress = accounts[0];
            console.log("MetaMask address:", adminMetamaskAddress);
            adminLogin(adminMetamaskAddress);
        } catch (error) {
            console.error("Error accessing MetaMask:", error);
         
        }
    } else {
        console.log("MetaMask not detected");
    }
}

let adminMetamaskAddress; 

document.getElementById('adminLoginButton').addEventListener('click', function() {
    adminCheckMetaMask();
});
