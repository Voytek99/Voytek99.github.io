
let ticketArea = "";



//old queue
const cold_start =["JUNIPER","show system uptime","show virtual-chassis",
    "show version | inc up |Last","show switch","HP",
    "sh system information", "dis ver","sh env"];

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

const firewall = [];
        

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


function classify(){
    ticketArea = document.getElementById('inputTicket').value;

    const commandList = document.getElementById('commandList');
    commandList.innerHTML = '';
    const basicCommand = document.getElementById('basicCommand');
    basicCommand.innerHTML = '';
    const IP_Address = findIPAddress(ticketArea);
    const regular = [`connect ${IP_Address} -l`];
    printRows(regular,basicCommand);

    if(ticketArea.includes("COLD_START")){
        printRows(cold_start, commandList);
    }
    if(ticketArea.includes("CPU_THRESHOLD")){
        printRows(cpu_threshold, commandList);
    }
    if(ticketArea.includes("LRAD_FAILURE") || ticketArea.includes("LRAD_MULIPLE")){

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
    if(ticketArea.includes("PCT_ERROR_THRESHOLD")){
        const port = findPortDescriptor(ticketArea);
        const pct = [`show interface ${port} extensive`] 
        printRows(pct, commandList);
    }
    if(ticketArea.includes("Control_Connections_Downs")){
        const con = ["show sdwan control connections"] 
        printRows(con, commandList);
    }
    if(ticketArea.includes("SPANTREE_ROOT_CHANGE")){
        
        const port = findPortDescriptor(ticketArea);
        const span = [`show spanning-tree bridge detail", "show spanning-tree interface brief", "show interface ${port}`];
        printRows(span, commandList);
    }
    if(ticketArea.includes("BW_IN_THRESHOLD") || ticketArea.includes("BW_OUT_THRESHOLD")){
        const item_name = findItemBW(ticketArea);
        const bw = [`show int ${item_name}`]
        printRows(bw, commandList);
    }
    
    if(ticketArea.includes("Bahlsen") && (ticketArea.includes("FLAPPING_LINE")||ticketArea.includes("BAD_LINK"))){

        const b_port=findBahlsenPort(ticketArea);
        const bahlsen = [`show configuration | display set | match WAN.*trust.*${b_port}`, "ping routing-instance WAN_0 8.8.8.8",
            "ping routing-instance WAN_1 8.8.8.8","ping routing-instance WAN_2 8.8.8.8"];
        printRows(bahlsen, commandList);
    }
    if(ticketArea.includes("firewall") || ticketArea.includes("useme")){
        var priority = "";
        const lines = ticketArea.split('\n');
        let capturing = false;
        let company = null;
        const group = "";
        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            if (trimmedLine === "Customer") {
                capturing = true;
                continue; // Skip "Customer" line
                }
                if (trimmedLine === "Contact type") {
                    capturing = false;
                    break; 
                    }
                    if (capturing && trimmedLine.length > 0) {
                        company = trimmedLine;
                        break;
                    }
            }

        const regexGroup = /2ndL_Workgroup:\s*([A-Za-z0-9._]+)/;

        const matchGroup = ticketArea.match(regexGroup);
        let workgroup = "";
        if (matchGroup) {
              workgroup = matchGroup[1];
        }

    }
}

function findIPAddress(text) {
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
    const ipAddresses = text.match(ipRegex);
    return ipAddresses ? ipAddresses[ipAddresses.length - 1] : 'No IP address found';
}


function findPortDescriptor(text) {
    const portRegex = /\b(?:ge|xe|et|fe)-\d+\/\d+\/\d+\b/g;
    const portMatches = text.match(portRegex);
    return portMatches ? portMatches[0] : 'No port descriptor found';
}

function findAP(text){
    const deviceRegex = /AP\s([A-Za-z0-9-]+)/;
    const match = text.match(deviceRegex);

    const deviceName = match ? match[1] : 'Brak wyników';
    return deviceName;
}

function findItemBW(text) {
    const regex = /ItemName:\s*(\S+)/;
    const match = text.match(regex);
    return match ? match[1] : 'No interface found';
}

function findBahlsenPort(text){
    const portRegex = /\bgr-\d+\/\d+\/\d+\.\d+\b/g;
    const portMatches = text.match(portRegex);
    return portMatches ? portMatches[0] : 'No port descriptor found';
}

