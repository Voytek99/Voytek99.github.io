let ticketArea = "";

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
       
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




function classify(){
    ticketArea = document.getElementById('inputTicket').value;
    
    const commandList = document.getElementById('commandList');
    commandList.innerHTML = '';
    const basicCommand = document.getElementById('basicCommand');
    basicCommand.innerHTML = '';
    const hostname = extractInfoBetween(ticketArea, "Host Name", "Last Ticket Number");
    const serialNumber = extractInfoBetween(ticketArea, "Serial number", "Asset tag");
    const modelID = extractInfoBetween(ticketArea, "Model ID", "Manufacturer");

    
    const specialLocationInfo = extractInfoBetween(ticketArea, "Special Location Info", "Location");
    const building = extractInfoBetween(ticketArea, "Building", "Floor");
    const floor = extractInfoBetween(ticketArea, "Floor", "Room");
    const room  = extractInfoBetween(ticketArea, "Room", "Mngd Building");


    let specs = "Name: "+hostname +"\nS/N: " + serialNumber + "\nModel ID: " + modelID;

    let lcon_location = "Special Location Info: " + specialLocationInfo +  "\nLocation: " + "\nBuilding: " + building +  "\nFloor: " + floor + "\nRoom: " + room;
    
    data = [specs, lcon_location];
    printRows(data,commandList);

}

