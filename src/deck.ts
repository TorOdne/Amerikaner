import {Card, User} from "./types";
const suits = [
    "♣",
    "♥",
    "♠",
    "♦",
]
    
const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
]

export class Deck {
    public deck: Card[] = [];
    public players: User[] = [];

    constructor() {
        for (let i = 0; i < suits.length; i++) {
            let suit = suits[i];
            for (let i = 0; i < ranks.length; i++) {
                let rank = ranks[i];
                this.deck.push({ suit, rank});
            }
        }
    }
   
    shuffle() {
        for (let i = 0; i < 52; i++) {
            let newCard = this.deck.splice(Math.random() * this.deck.length, 1, );
            console.log(newCard);
            this.deck.push(newCard[0]);
        }
        
    }

    
    deal(users: User[]) {
        users.forEach(user => {
            user.cards = []
            this.players.push(user)
        })
        let numPlayers = this.players.length;
        const cardsPerPlayer = Math.floor(this.deck.length / numPlayers);
        const remainingCards = this.deck.length % numPlayers;
        
        for (let i = 0; i < numPlayers; i++) {
            const additionalCard = i < remainingCards ? 1 : 0;

            for (let j = 0; j < cardsPerPlayer + additionalCard; j++) {
                if (this.deck.length === 0) {
                    break;
                } 
                const card = this.deck.pop();
                if (card) {
                    this.players[i].cards.push(card);
                }
            }
        }
    }
}



