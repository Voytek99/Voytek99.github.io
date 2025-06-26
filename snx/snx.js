function extractInformation() {
    const input = document.getElementById('inputText').value;

    const ticketRegex = /Ticket:\s*(\d+)/;
    const firstMessageRegex = /Telekom-Logo\s*([\s\S]*?)\s*Sender/;
    const troubleInfoRegex = /Trouble Info\s*([\s\S]*?)\s*Notes/;
    const notesRegex = /Notes\s*([\s\S]*?)\s*\* all timestamps/;

    const ticketMatch = input.match(ticketRegex);
    const firstMessageMatch = input.match(firstMessageRegex);
    const troubleInfoMatch = input.match(troubleInfoRegex);
    const notesMatch = input.match(notesRegex);

    const ticketNumber = ticketMatch ? ticketMatch[1] : 'Not found';
    const firstMessage = firstMessageMatch ? firstMessageMatch[1].trim() : 'Not found';
    const troubleInfo = troubleInfoMatch ? troubleInfoMatch[1].trim() : 'Not found';
    const notes = notesMatch ? notesMatch[1].trim() : 'Not found';

    const ticketNumberCorrect = ticketNumber.replace(/^0+/, '');
    const shortDescription = "#SNX#" + ticketNumberCorrect + "#" + troubleInfo;

    const description = firstMessage + "\n\n" + notes;

    document.getElementById('ticketNumber').value = ticketNumber;
    document.getElementById('shortDescription').value = shortDescription;
    document.getElementById('description').value = description;
    document.getElementById('secondLine').value = "SNXSNX";
    document.getElementById('telekom').value = "Your Ref ID on our site: ";
}

function copyToClipboard(elementId) {
    const inputElement = document.getElementById(elementId);
    inputElement.select();
    inputElement.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
}
