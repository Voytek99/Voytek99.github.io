// script.js

// Function to load external HTML content into a target element
function includeHTML(element, file) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            element.innerHTML = xhr.responseText;
        }
    };
    xhr.open("GET", file, true);
    xhr.send();
}

// Load the header and footer into the respective elements
window.onload = function() {
    includeHTML(document.getElementById('header-placeholder'), 'header.html');
    includeHTML(document.getElementById('footer-placeholder'), 'footer.html');
};
