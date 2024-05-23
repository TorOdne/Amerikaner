import { Card, CardNamed } from "./types";

export class Table {
    public pile: CardNamed[] = [];
    public bigCard: string = "";
    public trump: string = "";
    
    pushTable(playerName: string, card: Card) {
        let cardNamePair: CardNamed = { name: playerName, card: card };
        this.pile.push(cardNamePair);
        if (this.bigCard === "") {
            this.bigCard = card.suit;
        }
    }

    showWinner() {
        let bigCards: CardNamed[] = [];
        let trumps: CardNamed[] = [];

        for (let card of this.pile) {
            if (card.card.suit === this.trump) {
                trumps.push(card);
            }
            else if (card.card.suit === this.bigCard) {
                bigCards.push(card);
            }
        }

        if (trumps.length === 0) {
            let biggestCard: CardNamed = { name: "", card: { rank: "0", suit: "" } };
            for (let card of bigCards) {
                if (this.convertRank(card.card.rank) > this.convertRank(biggestCard.card.rank)) {
                    biggestCard = card;
                }
            }
            return biggestCard; // Return the winner's name
        }

        else {
            let biggestCard: CardNamed = { name: "", card: { rank: "0", suit: "" } };
            for (let card of trumps) {
                if (this.convertRank(card.card.rank) > this.convertRank(biggestCard.card.rank)) {
                    biggestCard = card;
                }
            }
            return biggestCard; // Return the winner's name
        }
    }

    private convertRank(rank: string): number {
        let convertedRank = Number(rank);

        if (isNaN(convertedRank)) {
            if (rank === "J") {
                return 11;
            }
            else if (rank === "Q") {
                return 12;
            }
            else if (rank === "K") {
                return 13;
            }
            else if (rank === "A") {
                return 14;
            }
            else return -1;
        }
        else return convertedRank;
    }
}

// Test the code
/*
let table = new Table();

table.trump = '♥';
table.bigCard = '♣';

table.pushTable("Monica", { suit: '♠', rank: "2" });
table.pushTable("Tor", { suit: '♦', rank: "4" });
table.pushTable("Mamma", { suit: '♣', rank: "6" });
table.pushTable("Pappa", { suit: '♠', rank: "A" });

console.log(table.showWinner()); // Output the winner's name
*/