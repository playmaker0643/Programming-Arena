document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            cards.forEach(card => {
                card.classList.remove('flipped');
            });
        });
    }
    const progressBar = document.getElementById('progress-bar');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const flippedCards = document.querySelectorAll('.card.flipped').length;
            const totalCards = cards.length;
            const progress = (flippedCards / totalCards) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
        });
    });
    if (progressBar) progressBar.style.width = '0%';

    const left_button = document.getElementById('left-button');
    const right_button = document.getElementById('right-button');
    const cardContainer = document.getElementById('card-container');

    if (left_button && cardContainer) left_button.addEventListener('click', () => {
        cardContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });
    if (right_button && cardContainer) right_button.addEventListener('click', () => {
        cardContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });
});
