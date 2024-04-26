
let video;
let canvas;
let nameInput;

function init() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    nameInput = document.getElementById('name');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.log("error accessing webcam", error);
        });
}

function capture() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';
    video.style.display = 'none';
}

function register(){
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const photo = dataURItoBlob(canvas.toDataURL());
    const userMetamaskAddress = document.getElementById('regMetaMaskAddress').value; 
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('photo', photo, `${username}.jpg`);
    formData.append('user_metamask_address', userMetamaskAddress);

    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registered successfully.");
            const userName = data.name; // Retrieve the associated name from the response
            window.location.href = `http://127.0.0.1:5000/organizationLogin`; // Redirect to localhost:3000
        }else{
            alert("Registration failed.");
        }
    })
    .catch(error => {
        console.log("Error registering user", error);
    });
}


function login(metamaskAddress){
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const userMetamaskAddress = document.getElementById('loginMetaMaskAddress').value; // Get user's Metamask address
    const photo = dataURItoBlob(canvas.toDataURL());

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('photo', photo, 'login.jpg');
    formData.append('user_metamask_address', userMetamaskAddress); // Append user's Metamask address
    formData.append('metamask_address', metamaskAddress); 

    fetch('/login', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Login successful.");
            window.location.href = `localhost:3000`; // Redirect to localhost:3000
        } else {
            alert("Login failed: " + data.error);
        }
    })
    .catch(error => {
        console.log("Error logging in user", error);
    });
}

function registerAdmin() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const adminMetamaskAddress = document.getElementById('regMetaMaskAddress').value; // Get user's Metamask address

    const photo = dataURItoBlob(canvas.toDataURL());

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('admin_metamask_address', adminMetamaskAddress); // Append user's Metamask address
    formData.append('photo', photo, `${username}.jpg`);

    fetch('/registerAdmin', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registered successfully.");
            logout()
            alert("Logged out successfully.");
            const userName = data.name; // Retrieve the associated name from the response
            window.location.href = `http://127.0.0.1:5000/`; // Redirect to localhost:3000
        }else{
            alert("Registration failed.");
        }
    })
    .catch(error => {
        console.log("Error registering user", error);
    });
}

function adminLogin(adminMetamaskAddress) {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const adminUserMetamaskAddress = document.getElementById('adminLoginMetaMaskAddress').value; // Get user's Metamask address
    const photo = dataURItoBlob(canvas.toDataURL());

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('admin_user_metamask_address', adminUserMetamaskAddress); // Append user's Metamask address
    formData.append('admin_metamask_address', adminMetamaskAddress);

    console.log(adminUserMetamaskAddress)
    console.log(adminMetamaskAddress)

    formData.append('photo', photo, 'login.jpg');
    console.log(formData)

    fetch('/adminlogin', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Admin login successful.");
            window.location.href = `http://127.0.0.1:5000/adminRegister`; // Redirect to admin dashboard
            console.log(formData)
        } else {
            alert("Admin login failed: " + data.error);
            console.log(formData)
        }
    })
    .catch(error => {
        console.log("Error logging in admin", error);
    });
    console.log(formData)

}

function logout() {
    fetch('/logout', {
        method: 'GET'
    })
    .then(response => {
        if(response.ok) {  // Check if the response status is OK (200-299)
            window.location.href = "/";  // Redirect to the home page
        }
    })
    .catch(error => {
        console.log("Error logging out", error);
    });
}

function adminLogout() {
    fetch('/adminlogout', {
        method: 'GET'
    })
    .then(response => {
        if(response.ok) {  // Check if the response status is OK (200-299)
            window.location.href = "/";  // Redirect to the home page
        }
    })
    .catch(error => {
        console.log("Error logging out", error);
    });
}


function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

init()

