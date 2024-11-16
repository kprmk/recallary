from constants import (
    ADMIN_USERNAME,
    SQLALCHEMY_DATABASE_URI,
)
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)


class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    word = db.Column(db.String(100), nullable=False)
    translation = db.Column(db.String(100), nullable=False)
    date_added = db.Column(db.DateTime, default=db.func.current_timestamp())
    repetitions = db.Column(db.JSON, default={'correct': 0, 'incorrect': 0})

    def __repr__(self):
        return f'<Word {self.word} {self.translation}>'


@app.route('/word', methods=['POST'])
def add_word():
    data = request.get_json()
    item = dict(
        username=data.get('username', ADMIN_USERNAME),
        word=data['word'],
        translation=data['translation'],
    )
    existing_word = Word.query.filter_by(**item)
    if existing_word.first():
        return jsonify({'message': 'Word already exists!'}), 400

    new_word = Word(
        repetitions=data.get('repetitions', {'correct': 0, 'incorrect': 0}),
        **item
    )
    db.session.add(new_word)
    db.session.commit()
    return jsonify({'message': 'Word added successfully!'}), 201


@app.route('/words', methods=['GET'])
def get_words():
    username = request.args.get('username', ADMIN_USERNAME)
    words = Word.query.filter_by(username=username).all()
    result = jsonify([{
      'id': w.id,
      'word': w.word,
      'translation': w.translation,
      'date_added': w.date_added,
      'repetitions': w.repetitions,
      'username': w.username,
    } for w in words])
    return result


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if Word.query.count() == 0:
            initial_words = [
                {'word': 'monday', 'translation': 'понедельник'},
                {'word': 'morning', 'translation': 'утро'},
                {'word': 'apple', 'translation': 'яблоко'},
                {'word': 'strawberry', 'translation': 'клубника'},
                {'word': 'summer', 'translation': 'лето'},
                {'word': 'bus', 'translation': 'автобус'},
                {'word': 'deer', 'translation': 'олень'},
            ]
            for word in initial_words:
                new_word = Word(username=ADMIN_USERNAME, **word)
                db.session.add(new_word)
            db.session.commit()

    app.run(debug=True) 
