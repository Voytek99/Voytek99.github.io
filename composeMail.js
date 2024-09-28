let ticketArea = "";
let ticketArea1 = "";
let ticketArea2 = "";

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
    return (extractedValue.length > 100 || extractedValue === "") ? "-" : extractedValue;
}




function classify(){
    ticketArea = document.getElementById('ticketPage').value;
    ticketArea1 = document.getElementById('specs').value;
    ticketArea2 = document.getElementById('location').value;
    
    const commandList = document.getElementById('commandList');
    commandList.innerHTML = '';
    const basicCommand = document.getElementById('basicCommand');
    basicCommand.innerHTML = '';
    const deviceInfo = extractDeviceInfo(ticketArea);
   
    const regex = /\b(INC0\d+)\b/; 
    const ticketNumber = ticketArea.match(regex)[0];
    let title = ticketNumber + " || " + deviceInfo.deviceName + " " + "("+deviceInfo.status+")";
    console.log(title);

    const location = extractInfoBetween(ticketArea, "Location", "Phone Number");

    const hostname = extractInfoBetween(ticketArea1, "Host Name", "Last Ticket Number");
    const serialNumber = extractInfoBetween(ticketArea1, "Serial number", "Asset tag");
    const modelID = extractInfoBetween(ticketArea1, "Model ID", "Manufacturer");

    
    const specialLocationInfo = extractInfoBetween(ticketArea2, "Special Location Info", "Location");
    const building = extractInfoBetween(ticketArea2, "Building", "Floor");
    const floor = extractInfoBetween(ticketArea2, "Floor", "Room");
    const room  = extractInfoBetween(ticketArea2, "Room", "Mngd Building");


    let specs = "Name: "+hostname +"\nS/N: " + serialNumber + "\nModel ID: " + modelID;

    let lcon_location = "Special Location Info: " + specialLocationInfo +  "\nLocation: " + location+ "\nBuilding: " + building +  "\nFloor: " + floor + "\nRoom: " + room;
    
    data = [specs, lcon_location];
    printRows(data,commandList);

}
function extractDeviceInfo(inputString) {
    // Regular expression to match the required parts of the input string
    const regex = /Short Description\s+([^\s()]+)\s+\((.*?)\)\s+Device\s+([^\s]+)\s+of\s+type\s+([^\s]+)\s+has\s+(.*)/i;
    const match = inputString.match(regex);
    
    if (match) {
        const shortDescription = match[1] ? match[1].trim() : "-";
        const status = match[2] ? match[2].trim() : "-";
        const deviceName = match[3] ? match[3].trim() : "-";
        const deviceType = match[4] ? match[4].trim() : "-";
        const alertMessage = match[5] ? match[5].trim() : "-";
        
        // Construct an object with the extracted information
        return {
            shortDescription,
            status,
            deviceName,
            deviceType,
            alertMessage
        };
    }
    
    console.log("No match found for the input string.");
    return null; // Return null if no match found
}