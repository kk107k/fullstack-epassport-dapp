export function logout() {
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