
let ticketArea = "";



//old queue
const cold_start =["JUNIPER","show system uptime","show virtual-chassis",
    "show version | inc up |Last","show switch","HP",
    "sh system information", "dis ver"];

const cpu_threshold =[ "sh cpu", "show system process", "show processes cpu sorted 5min | ex 0.00",
     "sh processes cpu history", "show chassis routing-engine", "show snmp mib walk jnxOperatingCPU"];


const flapping_line = ["sh interfaces trunk", "sh int port" ];

const fru_fault = ["show chassis environment", "show environment all",
     "show log", "show chassis alarms", 
     "show alarms", "show chassis pic pic-slot 0 fpc-slot 0"];

const psu_fault = ["show chassis hardware", "show chassis pic pic-slot 0 fpc-slot 0",
    "CISCO", "show environment power", "show environment", "show inventory",
    "JUNIPER", "show chassis power", "show chassis power" , "HP",
    "show system power-supply","INNE", "sh env power all", "show inventory"
];
    
const bad_link = ["show interface port status", "Display interface <port>"];

const fan_fault = ["sh env fan", "show chassis fan", "sh logg | i FAN"];



//new queue
        
// Function to copy text to clipboard
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
       
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Function to dynamically generate rows based on commands and append them to a given element
function printRows(commands, element) {
    commands.forEach((car) => {
        // Create a container div for each car
        const container = document.createElement('div');
        container.className = 'info-block';

        // Create a button to copy the car name
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerText = `${car}`;

        // Set up the click event to copy the car name
        button.addEventListener('click', () => {
            copyText(car);  // Copy car name
        });

        // Append the button to the container
        container.appendChild(button);

        // Append the container to the specified element
        element.appendChild(container);
    });
}


function classify(){
    ticketArea = document.getElementById('inputTicket').value;

    const commandList = document.getElementById('commandList');
    commandList.innerHTML = '';
    const basicCommand = document.getElementById('basicCommand');
    basicCommand.innerHTML = '';
    if(ticketArea.includes("PL.Network.ADE.BRIDGE") || ticketArea.includes("PL.Network.ADE.Highpriority")){
        //scrapeTicket look check if bridge or higprio then
        const IP_Address = findIPAddress(ticketArea);
        const regular = [`connect ${IP_Address} -l`, 'PL.Network.ADE.NOC', "Haslo"];
        printRows(regular,basicCommand);

    }
    if(ticketArea.includes("COLD_START")){
        printRows(cold_start, commandList);
    }
    if(ticketArea.includes("CPU_THRESHOLD")){
        printRows(cpu_threshold, commandList);
    }
    if(ticketArea.includes("LRAD_FAILURE" || "LRAD_MULTIPLE")){

        const AP = findAP(ticketArea);

        const lrad = [ `show ap summary ${AP}`, `grep include '${AP}' 'show ap join stats summary all'`,
            "WINTERSHALL",`sh ap sum | inc ${AP}`, `sh ap sum | in ${AP}`];

        printRows(lrad, commandList);
    }
    if(ticketArea.includes("FLAPPING_LINE") && (!ticketArea.includes("Bahlsen"))){
        printRows(flapping_line, commandList);
    }
    if(ticketArea.includes("FRU_FAULT")){
        printRows(fru_fault, commandList);
    }
    if(ticketArea.includes("BAD_LINK") && (!ticketArea.includes("Bahlsen"))){
        printRows(bad_link, commandList);
    }
    if(ticketArea.includes("DOM_FAULT")){

        const port = findPortDescriptor(ticketArea);

        const dom_fault = [`show log messages.0.gz | match ${port}`, "sh system uptime", `show interfaces ${port}`];
        printRows(dom_fault, commandList);
    }
    if(ticketArea.includes("PSU_FAILURE")){
        printRows(psu_fault, commandList);
    }
    if(ticketArea.includes("FAN_FAULT")){
        printRows(fan_fault, commandList);
    }
    if(ticketArea.includes("Bahlsen") && (ticketArea.includes("FLAPPING_LINE")||ticketArea.includes("BAD_LINK"))){

        const b_port=findBahlsenPort(ticketArea);
        const bahlsen = [`show configuration | display set | match WAN.trust.${b_port}`, "ping routing-instance WAN_0 8.8.8.8",
            "ping routing-instance WAN_1 8.8.8.8","ping routing-instance WAN_2 8.8.8.8"];
        printRows(bahlsen, commandList);
    }
}

function findIPAddress(text) {
    // Regular expression to match IP address
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;

    // Use the regular expression to find IP addresses in the text
    const ipAddresses = text.match(ipRegex);

    // Return the last IP address found, or a message if none found
    return ipAddresses ? ipAddresses[ipAddresses.length - 1] : 'No IP address found';
}


function findPortDescriptor(text) {
    // Regular expression to match the port descriptor (e.g., ge-0/1/3)
    const portRegex = /\b(?:ge|xe|et|fe)-\d+\/\d+\/\d+\b/g;

    // Use the regular expression to find port descriptors in the text
    const portMatches = text.match(portRegex);

    // Return the first port descriptor found, or a message if none found
    return portMatches ? portMatches[0] : 'No port descriptor found';
}

function findAP(text){
    const deviceRegex = /AP\s([A-Za-z0-9-]+)/;
    const match = text.match(deviceRegex);

    const deviceName = match ? match[1] : 'Brak wyników';
    return deviceName;
}

function findBahlsenPort(text){
 // Regular expression to match the port descriptor (e.g., gr-0/0/0.4010)
    const portRegex = /\bgr-\d+\/\d+\/\d+\.\d+\b/g;

    // Use the regular expression to find port descriptors in the text
    const portMatches = text.match(portRegex);

    // Return the first port descriptor found, or a message if none found
    return portMatches ? portMatches[0] : 'No port descriptor found';
}


