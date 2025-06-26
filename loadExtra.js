// script.js

// Function to fetch external HTML content and insert it into a specific element
function loadHTML(element, file) {
    fetch(file)
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Failed to load file: ' + file);
        })
        .then(data => {
            element.innerHTML = data;
        })
        .catch(error => {
            console.error(error);
        });
}

window.onload = function() {
    // Load header and footer using root-relative paths
    loadHTML(document.getElementById('header-placeholder'), '/extra/header.html');
    loadHTML(document.getElementById('footer-placeholder'), '/extra/footer.html');
};
