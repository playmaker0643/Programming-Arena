const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    cards.forEach(card => {
        card.classList.remove('flipped');
    });
});
const progressBar = document.getElementById('progress-bar');
cards.forEach(card => {
    card.addEventListener('click', () => {
        const flippedCards = document.querySelectorAll('.card.flipped').length;
        const totalCards = cards.length;
        const progress = (flippedCards / totalCards) * 100;
        progressBar.style.width = `${progress}%`;
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
});
const left_button = document.getElementById('left-button');
const right_button = document.getElementById('right-button');
const cardContainer = document.querySelector('.card-container');

left_button.addEventListener('click', () => {
    cardContainer.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
});

right_button.addEventListener('click', () => {
    cardContainer.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
});