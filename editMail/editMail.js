function generateMail() {
    const emailData = scrapeEmailData();

    // Ustawienie zmiennych na podstawie danych z e-maila
    const from = emailData.sender;
    const to = emailData.receivers.join(', ');
    const cc = emailData.receiversCc.join(', ');
    const subject = emailData.subject;
    const body = `${emailData.message}`;

    // Encode URI components
    const mailtoLink = `mailto:${to}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open the mail client with the pre-filled email
    window.location.href = mailtoLink;
}

function scrapeEmailData() {
    // Pobierz zawartość pola o ID 'original'
    const emailContent = document.getElementById('original').value;

    // Zdefiniuj wzorce dla różnych sekcji e-maila
    const senderPattern = /^From:\s*(.*)$/m;
    const receiversPattern = /^To:\s*(.*)$/m;
    const ccPattern = /^Cc:\s*(.*)$/m;
    const subjectPattern = /^Subject:\s*(.*)$/m;
    const messagePattern = /Subject:.*?\n([\s\S]*?)\n(?:Best Regards|Regards)/m;

    // Wyciągnij poszczególne informacje
    const sender = (emailContent.match(senderPattern) || [])[1] || '';
    const receivers = (emailContent.match(receiversPattern) || [])[1] || '';
    const receiversList = receivers.split(';').map(item => item.trim());
    const receiversCc = (emailContent.match(ccPattern) || [])[1] || '';
    const receiversCcList = receiversCc.split(';').map(item => item.trim());
    const subject = (emailContent.match(subjectPattern) || [])[1] || '';
    const message = (emailContent.match(messagePattern) || [])[1] || '';

    // Zwróć dane jako obiekt
    return {
        sender: sender.trim(),
        receivers: receiversList,
        receiversCc: receiversCcList,
        subject: subject.trim(),
        message: message.trim()
    };
}
