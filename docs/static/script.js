document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');

    // Fetch cards from deployed API if API_BASE is set
    async function loadCards() {
        const base = window.API_BASE || '';
        const deckId = window.CURRENT_DECK_ID || 1;
        if (!base || base.includes('REPLACE_WITH_API_URL')) {
            // No API configured; keep static markup
            bindCardEvents();
            return;
        }
        try {
            const res = await fetch(`${base.replace(/\/$/, '')}/api/deck/${deckId}/cards`);
            if (!res.ok) throw new Error('Failed to fetch cards');
            const cards = await res.json();
            renderCards(cards);
        } catch (e) {
            console.error('Error loading cards:', e);
            bindCardEvents();
        }
    }

    function renderCards(cards) {
        if (!cardContainer) return;
        cardContainer.innerHTML = '';
        cards.forEach(c => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = c.id;

            const front = document.createElement('div');
            front.className = 'front';
            front.innerHTML = `<h2>${escapeHtml(c.front)}</h2>`;

            const back = document.createElement('div');
            back.className = 'back';
            back.innerHTML = `<h2>${escapeHtml(c.back)}</h2>`;

            card.appendChild(front);
            card.appendChild(back);
            cardContainer.appendChild(card);
        });
        bindCardEvents();
    }

    function escapeHtml(str){
        return String(str).replace(/[&<>"']/g, function(m){
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m];
        });
    }

    function bindCardEvents(){
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) progressBar.style.width = '0%';
        });
    }

    // Update progress when cards flipped
    document.addEventListener('click', () => {
        const progressBar = document.getElementById('progress-bar');
        const flippedCards = document.querySelectorAll('.card.flipped').length;
        const totalCards = document.querySelectorAll('.card').length || 1;
        const progress = (flippedCards / totalCards) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;
    });

    const left_button = document.getElementById('left-button');
    const right_button = document.getElementById('right-button');

    if (left_button && cardContainer) left_button.addEventListener('click', () => {
        cardContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });
    if (right_button && cardContainer) right_button.addEventListener('click', () => {
        cardContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Load cards from API if configured
    loadCards();
});
