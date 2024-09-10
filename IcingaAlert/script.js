document.addEventListener('DOMContentLoaded', () => {
    loadFile();
});

function loadFile() {
    fetch('scraped_data.txt')  // Name of your text file
        .then(response => response.text())
        .then(text => {
            const data = parseTextFile(text);
            const sortedData = sortDataByTimestamp(data);
            displayData(sortedData);
        })
        .catch(error => console.error('Error loading the file:', error));
}

function parseTextFile(text) {
    const lines = text.trim().split('\n');
    const data = [];
    
    for (let i = 0; i < lines.length; i += 5) {
        if (i + 4 < lines.length) {
            const [link, name, alert, server, timestamp] = lines.slice(i, i + 5);
            data.push({ link, name, alert, server, timestamp });
        }
    }
    
    return data;
}

function sortDataByTimestamp(data) {
    return data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function displayData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.link}</td>
            <td>${row.name}</td>
            <td>${row.alert}</td>
            <td>${row.server}</td>
            <td>${row.timestamp}</td>
        `;
        tableBody.appendChild(tr);
    });
}
