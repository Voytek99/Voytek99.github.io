function processLog() {
    const log = document.getElementById('log-input').value;

    // Regex to capture Hostname, CL, SG, CU
    const regex = /Hostname:\s*CS:\s*([^\n]+?)\s*Message:.*?CL:\s*([^\/]+?)\s*\/\s*SG:\s*([^\/]+?)\s*\/\s*CU:\s*([^\n]+?)\s*/si;
    const match = log.match(regex);

    // Ensure the variables are defined before using them
    let hostname = '';
    let cl = '';
    let sg = '';
    let cu = '';

    if (match) {
        hostname = match[1].trim();
        cl = match[2].trim();
        sg = match[3].trim();
        cu = match[4].trim();
        
    } else {
        console.log("No match found for Hostname, CL, SG, or CU");
    }

    // Regex to capture Save Group, Policy, Workflow
    const regexSaveGroup = /SAVEGROUP:\s*([^\s]+?)\s*\(POLICY:\s*([^\s]+?)\s*\|\s*WORKFLOW:\s*([^\s]+?)\)/i;
    const matchSaveGroup = log.match(regexSaveGroup);

    let saveGroup = '';
    let policy = '';
    let workflow = '';

    if (matchSaveGroup) {
        saveGroup = matchSaveGroup[1].trim();
        policy = matchSaveGroup[2].trim();
        workflow = matchSaveGroup[3].trim();
        
        console.log("Save Group:", saveGroup);
        console.log("Policy:", policy);
        console.log("Workflow:", workflow);
    } else {
        console.log("No match found for Save Group, Policy, or Workflow");
    }

    // Regex to capture Level
    const regexLevel = /LEVEL:\s*([^\n]+?)\s*(?:\n|$)/i;
    const matchLevel = log.match(regexLevel);

    let level = '';

    if (matchLevel) {
        level = matchLevel[1].trim();
    } else {
        console.log("No match found for Level");
    }

    // Ensure all variables are defined before using them
    if (hostname && policy && workflow && level) {
        // Construct commands
        const session = `ssh ${hostname}`;
        const view = `/nsr/protocols/view_statistic/view_workflows.sh | grep ${sg}`;
        const time = `cat /nsr/bin/nw_param | cut -d ";" -f 2,3,5,10,14,15,17 | grep -i ${sg} | grep ${cl}`;
        const restart = `/usr/sbin/nsrworkflow -s ${hostname} -p ${policy} -w ${workflow} -c ${cl} -A "'backup' -l ${level.toLowerCase()}" &`;
        const root = `sudo su -`

        document.getElementById('session-output').value = session;
        document.getElementById('view-output').value = view;
        document.getElementById('time-output').value = time;
        document.getElementById('restart-output').value = restart;
        document.getElementById('root').value = root;
    } else {
        console.log("Required variables are not defined. Check the regex or input data.");
    }
    document.getElementById('session-output').value = session;
    document.getElementById('root').value = root;
    document.getElementById('view-output').value = view;
    document.getElementById('time-output').value = time;
    document.getElementById('restart-output').value = restart;
}
function copyToClipboard(elementId) {
    const inputElement = document.getElementById(elementId);
    inputElement.select();
    inputElement.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
}

