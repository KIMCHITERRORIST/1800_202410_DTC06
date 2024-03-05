document.getElementById('cardHeader').addEventListener('click', function () {
    const content = document.getElementById('cardContent');
    const symbol = document.getElementById('toggleSymbol');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden'); // Show content
        symbol.textContent = '-'; // Change symbol to '-'
    } else {
        content.classList.add('hidden'); // Hide content
        symbol.textContent = '+'; // Change symbol to '+'
    }
});