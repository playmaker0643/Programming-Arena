from flask import Flask, render_template, request, redirect, url_for, jsonify, session

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # For session

# In-memory storage
decks = [
    {"id": 1, "name": "Programming Terms", "cards": [
        {"id": 1, "front": "What is the full meaning of HTTP?", "back": "Hyper Text Transfer Protocol"},
        {"id": 2, "front": "What is the full meaning of HTML?", "back": "Hyper Text Markup Language"},
    ]},
]

@app.route('/')
def index():
    deck_id = request.args.get('deck', 1, type=int)
    deck = next((d for d in decks if d['id'] == deck_id), None)
    if not deck:
        deck = decks[0]
    return render_template('index.html', decks=decks, current_deck=deck)

@app.route('/add_card', methods=['POST'])
def add_card():
    deck_id = int(request.form['deck_id'])
    front = request.form['front']
    back = request.form['back']
    deck = next((d for d in decks if d['id'] == deck_id), None)
    if deck:
        new_id = max([c['id'] for c in deck['cards']]) + 1 if deck['cards'] else 1
        deck['cards'].append({"id": new_id, "front": front, "back": back})
    return redirect(url_for('index', deck=deck_id))

@app.route('/edit_card/<int:card_id>', methods=['GET', 'POST'])
def edit_card(card_id):
    deck_id_str = request.args.get('deck') or request.form.get('deck') or '1'
    deck_id = int(deck_id_str)
    deck = next((d for d in decks if d['id'] == deck_id), None)
    card = next((c for c in deck['cards'] if c['id'] == card_id), None) if deck else None
    if not card:
        return "Card not found", 404
    if request.method == 'POST':
        card['front'] = request.form['front']
        card['back'] = request.form['back']
        return redirect(url_for('index', deck=deck_id))
    return render_template('edit_card.html', card=card, deck_id=deck_id)

@app.route('/delete_card/<int:card_id>')
def delete_card(card_id):
    deck_id = request.args.get('deck', 1, type=int)
    deck = next((d for d in decks if d['id'] == deck_id), None)
    if deck:
        deck['cards'] = [c for c in deck['cards'] if c['id'] != card_id]
    return redirect(url_for('index', deck=deck_id))

@app.route('/add_deck', methods=['POST'])
def add_deck():
    name = request.form['name']
    new_id = max([d['id'] for d in decks]) + 1 if decks else 1
    decks.append({"id": new_id, "name": name, "cards": []})
    return redirect(url_for('index', deck=new_id))

@app.route('/quiz/<int:deck_id>')
def quiz(deck_id):
    deck = next((d for d in decks if d['id'] == deck_id), None)
    if not deck or not deck['cards']:
        return "No cards in deck", 404
    session['quiz_cards'] = deck['cards']
    session['quiz_index'] = 0
    session['correct'] = 0
    return render_template('quiz.html', card=deck['cards'][0], deck_id=deck_id)

@app.route('/export/<int:deck_id>')
def export_deck(deck_id):
    deck = next((d for d in decks if d['id'] == deck_id), None)
    if not deck:
        return "Deck not found", 404
    import json
    from flask import Response
    data = json.dumps(deck, indent=4)
    return Response(data, mimetype='application/json', headers={'Content-Disposition': f'attachment;filename={deck["name"]}.json'})

@app.route('/quiz_answer', methods=['POST'])
def quiz_answer():
    user_answer = request.form['answer'].strip().lower()
    correct_answer = session['quiz_cards'][session['quiz_index']]['back'].strip().lower()
    if user_answer == correct_answer:
        session['correct'] += 1
    session['quiz_index'] += 1
    if session['quiz_index'] >= len(session['quiz_cards']):
        score = session['correct']
        total = len(session['quiz_cards'])
        return render_template('quiz_result.html', score=score, total=total)
    next_card = session['quiz_cards'][session['quiz_index']]
    return render_template('quiz.html', card=next_card, deck_id=request.form['deck_id'])

@app.route('/search')
def search():
    query = request.args.get('q', '')
    deck_id = request.args.get('deck', 1, type=int)
    deck = next((d for d in decks if d['id'] == deck_id), None)
    if not deck:
        deck = decks[0]
    filtered_cards = [c for c in deck['cards'] if query.lower() in c['front'].lower() or query.lower() in c['back'].lower()]
    return render_template('search.html', cards=filtered_cards, query=query, deck=deck)

@app.route('/stats')
def stats():
    total_cards = sum(len(d['cards']) for d in decks)
    total_decks = len(decks)
    return render_template('stats.html', total_cards=total_cards, total_decks=total_decks)


@app.route('/api/deck/<int:deck_id>/cards')
def api_deck_cards(deck_id):
    deck = next((d for d in decks if d['id'] == deck_id), None)
    if not deck:
        return jsonify({"error": "Deck not found"}), 404
    return jsonify(deck['cards'])


@app.route('/import', methods=['POST'])
def import_deck():
    file = request.files.get('file')
    if file:
        import json
        try:
            data = json.load(file)
        except Exception:
            return "Invalid JSON file", 400
        new_id = max([d['id'] for d in decks]) + 1 if decks else 1
        data['id'] = new_id
        # Ensure minimal structure
        if 'name' not in data or 'cards' not in data:
            return "JSON must contain 'name' and 'cards'", 400
        decks.append({"id": data['id'], "name": data['name'], "cards": data['cards']})
        return redirect(url_for('index', deck=new_id))
    return "No file", 400

if __name__ == '__main__':
    app.run(debug=True, port=5002)