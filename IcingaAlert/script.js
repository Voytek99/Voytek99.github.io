document.addEventListener('DOMContentLoaded', () => {
    loadFile();
});

// Object mapping contacts to their email addresses
const contact_to_email = {
    "linux_experts": "linux-experts@atos.net",
    "wbc_ad_win_services": "wbc-ad-win-services@atos.net",
    "dl_de_uni_moco_service": "dl-de-uni-moco-service@atos.net",
    "UNI_XSP": "xspteam@atos.net",
    "wbc_exchange": "wbc-exchange@atos.net",
    "it_solutions_oco_sap": "IT-Solutions-OCO-SAP@atos.net",
    "ms_co_oco_sued3": "MS-CO-OCO-Sued3@atos.net",
    "dl_de_smb_aix": "dl-de-smb-aix@atos.net",
    "dlde_ats_dbs_db2": "dlde-ats-dbs-db2@atos.net"
};

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
    // Sort in descending order (newest first)
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function displayData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="${row.link}" target="_blank">${row.link}</a></td>
            <td>${row.name}</td>
            <td>${row.alert}</td>
            <td>${row.server}</td>
            <td>${row.timestamp}</td>
            <td>
                <button onclick="sendMail('${row.server}', '${row.name}', '${row.alert}', '${row.timestamp}')">Send Email</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Function to send mail based on the server name
function sendMail(server, name, alert, timestamp) {
    // Search for the contact email based on the server or name
    const contactEmail = findContactEmail(server) || `${name}@yourcompany.com`;

    const subject = `Alert for ${server}`;
    const body = `
        Alert: ${alert}
        Server: ${server}
        Timestamp: ${timestamp}
    `;
    
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// Function to find the email for a contact based on the server string
function findContactEmail(server) {
    // Look for known contact names in the server string
    for (const contact in contact_to_email) {
        if (server.includes(contact)) {
            return contact_to_email[contact];
        }
    }
    return null;  // Return null if no contact found
}
