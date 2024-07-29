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
    // Pobierz tekst z wybranego elementu
    const textToCopy = document.getElementById(elementId).innerText;
    
    // Tworzymy tymczasowy element textarea, aby skopiować tekst
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

}
