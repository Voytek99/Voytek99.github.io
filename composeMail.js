let ticketArea = "";

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied successfully!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function printRows(commands, element) {
    commands.forEach((car) => {
        const container = document.createElement('div');
        container.className = 'info-block';
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerText = `${car}`;

        button.addEventListener('click', () => {
            copyText(car);  
        });

        container.appendChild(button);
        element.appendChild(container);
    });
}

function extractInfoBetween(ticketArea, startKeyword, endKeyword) {
    const regex = new RegExp(`${startKeyword}:?\\s*([\\s\\S]*?)${endKeyword}:?`, 'i');
    const match = ticketArea.match(regex);
    let extractedValue = match ? match[1].trim() : "";

    // If the extracted value is longer than 20 characters, return "-"
    return (extractedValue.length > 50 || extractedValue === "") ? "-" : extractedValue;
}

function classify() {
    ticketArea = document.getElementById('inputTicket').value;
    
    const commandList = document.getElementById('commandList');
    commandList.innerHTML = '';
    const basicCommand = document.getElementById('basicCommand');
    basicCommand.innerHTML = '';

    // Extracting the values between marked "here" and relevant keywords
    const specialLocationInfo = extractInfoBetween(ticketArea, "Special Location Info", "Location");
    const location = extractInfoBetween(ticketArea, "Location", "Mounting Height U");
    const building = extractInfoBetween(ticketArea, "Building", "Floor");
    const floor = extractInfoBetween(ticketArea, "Floor", "Room");
    const room = extractInfoBetween(ticketArea, "Room", "Mngd Building");

    // Prepare the strings to display
    let locationDetails = `Special Location Info: ${specialLocationInfo}\nLocation: ${location}\nBuilding: ${building}\nFloor: ${floor}\nRoom: ${room}`;

    // Store data in an array and print it in the UI
    let data = [locationDetails];
    printRows(data, commandList);
}

function removeFirstOccurrence(text, keyword) {
    const regex = new RegExp(keyword, 'i');  // Case-insensitive search for the keyword
    return text.replace(regex, '');  // Replace only the first occurrence
}
