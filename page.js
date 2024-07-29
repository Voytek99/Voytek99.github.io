function showInfo(infoId) {
    // Ukryj wszystkie bloki informacji
    const allInfoBlocks = document.querySelectorAll('.info-block');
    allInfoBlocks.forEach(block => block.style.display = 'none');
    
    // Pokaż tylko wybrany blok informacji
    const infoBlock = document.getElementById(infoId);
    if (infoBlock) {
        infoBlock.style.display = 'block';
    }
}

function copyText(elementId) {
    const element = document.getElementById(elementId);
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.select();
        element.setSelectionRange(0, 99999); // Dla urządzeń mobilnych
        document.execCommand('copy');
    } else {
        const textToCopy = element.innerText;
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999); // Dla urządzeń mobilnych
    document.execCommand('copy');
}

function extractDeviceNames() {
    const input = document.getElementById('text_lrad_failure').value;

    // Definiujemy wyrażenie regularne
    const deviceRegex = /AP\s([A-Za-z0-9-]+)/;
    const match = input.match(deviceRegex);

    // Wyciągamy tylko pierwszy wynik
    const deviceName = match ? match[1] : 'Brak wyników';

    // Wyświetl wynik w elemencie div
    const resultsDiv = document.getElementById('deviceNames');
    resultsDiv.innerHTML = ''; // Czyść poprzednie wyniki
    const div = document.createElement('div');
    div.textContent = deviceName;
    resultsDiv.appendChild(div);

    const command1 = `show ap summary AP ${deviceName}`;
    const command2 = `grep include "${deviceName}" show ap join stats summary all`;
    const command3 = `sh ap sum | ${deviceName}`;
    const command4 = `grep include "${deviceName}" sh ap summary`;

    document.getElementById('command1').value = command1;
    document.getElementById('command2').value = command2;
    document.getElementById('command3').value = command3;
    document.getElementById('command4').value = command4;
}
