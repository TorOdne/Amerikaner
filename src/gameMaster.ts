import {Deck} from "./deck";
import {Card, User, CardNamed, Team} from "./types";
import {Table} from "./table";

export class GameMaster {
    currentBidder: User | null = null;
    private newDeck = new Deck;
    private playerList: User[] = [];
    private bidNum: number = 0;
    private bidderIndex: number = 0;
    private isBidding: boolean = false;
    private isPlaying: boolean = false;
    private bidders: User[] = [];
    private currentPlayer: User | null = null;
    private table = new Table;
    private team1: Team = {players: [], points: 0};
    private team2: Team = {players: [], points: 0};

    
    start(users: User[]) {
        // shuffle deal put players in playerlist.
        this.newDeck.shuffle();
        this.newDeck.deal(users);
        this.playerList = this.newDeck.players;
    }

    showHand(name: string) {
        // show players hand by name

        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].username == name) {
                return this.playerList[i].cards;
            }
        } 
    }

    startBidding() {
        // start bidding round
        if (this.isBidding) {
            return "Already bidding.";
        }

        else if (this.isPlaying) {
            return "Now is not the time to bid!"
        }
        else {
            this.isBidding = true;
            this.bidNum = 0;
            for (let i = 0; i < this.playerList.length; i++) {
                this.bidders.push(this.playerList[i]);
            }
            this.currentBidder = this.bidders[0];
            return `Bidding started. ${this.currentBidder.username} goes first.`;
        }
    }

    bid(bidValue: number | string, playerName: string) {
        // make bid
        if (playerName != this.currentBidder?.username) {
            return `${playerName}, it's not your turn.`;
        }

        if (bidValue == "pass") {
            this.bidders.splice(this.bidderIndex, 1);
            if (this.bidders.length == 1) {
                this.isPlaying = true;
                this.isBidding = false;
                this.team1.players.push(this.bidders[0].username);
                return `${this.bidders[0].username} is the winner of the bidding round! His first card will decide the trump.`;
            }
            if (this.bidderIndex >= this.bidders.length) {
                this.bidderIndex = 0;
            }
            this.currentBidder = this.bidders[this.bidderIndex]; 
            
            return `${playerName}, passed. Your move ${this.currentBidder.username}. Bidders left: ${this.bidders.length}`;
            
        }

        else {
            bidValue = bidValue as number;
            if (bidValue <= this.bidNum) {
                return `${playerName}, your bid is too low.`;
            }

            else if (bidValue > 13) {
                return `${playerName}, your bid is too high.`;
            }
    
            else {
                this.bidNum = bidValue;
                this.nextBidder();
                return `${playerName} has bid ${bidValue}. Your move ${this.currentBidder.username}.`;
            }
        }
    }
    
    private nextBidder() {
        // advance bid round
        this.bidderIndex++;
        if (this.bidderIndex >= this.bidders.length) {
            this.bidderIndex = 0;
        }
        this.currentBidder = this.bidders[this.bidderIndex]; 
    }

    startPlaying() {
        // start playing (after bid round)
        if (this.isBidding) {
            return "Can't play when bidding.";
        }

        else if (this.isPlaying) {
            this.currentPlayer = this.bidders[0];
            return `Play started. ${this.currentPlayer.username} goes first.`;
        }
        else {
            return "woops";
        }
    }

    playCard(playerName: string, suit: string, rank: string) {
        // play a card
        if (this.isPlaying) {
            if (this.currentPlayer?.username == playerName) {
                for (let i = 0; i < this.currentPlayer.cards.length; i++) {
                    if (this.checkSuit(suit) === this.currentPlayer.cards[i].suit 
                    && rank === this.currentPlayer.cards[i].rank) {
                        // advance turn
                        let player = this.currentPlayer.username;
                        let card = this.cardToString(this.currentPlayer.cards.splice(i, 1)[0]);
                        this.table.pushTable(this.currentPlayer.username, this.currentPlayer.cards[i]);
                        if (this.table.trump === "") {
                            this.table.trump = suit;
                        }
                        this.advanceTurn(this.currentPlayer);
                        if (this.table.pile.length > 3) {
                            let winner = this.table.showWinner();
                            this.table.pile = [];
                            this.currentPlayer = this.setPlayer(winner)!;
                            if (this.team1.points === 0) {
                                this.team1.players.push(winner.name);
                                for (let i = 0; i < this.playerList.length; i++) {
                                    if (!this.team1.players.includes(this.playerList[i].username)) {
                                        this.team2.players.push(this.playerList[i].username);
                                    }
                                }
                                this.team1.points += 1;
                                return `${winner.name} won with ${this.cardToString(winner.card)}. \n
                                team1: ${this.team1.players[0]}, ${this.team1.players[1]}. \n
                                team2: ${this.team2.players[0]}, ${this.team2.players[1]}.`
                            }     
                            this.givePoint(winner.name);
                            if (this.team1.points + this.team2.points === 13) {
                                this.isPlaying = false;
                                if (this.team1.points > this.team2.points) {
                                    return `Team 1 wins with ${this.team1.points} points.`;
                                }
                                else {
                                    return `Team 2 wins with ${this.team2.points}.`;
                                }
                            }
                            return `${winner.name} won with ${this.cardToString(winner.card)}.\n
                            Team1: ${this.team1.points}. Team2: ${this.team2.points}.`;
                        }
                        return `${player} played ${card}.`;
                    }
                } 
                return "You don't have that card";
            }
            else return "It's not your turn.";
        }
        else return "Not currently playing";
    }

    private checkSuit(suit: string) {
        // convert suit in text to sign
        if (suit == "spades") {
            return '♠';
        }

        else if (suit == "hearts") {
            return '♥';
        }

        else if (suit == "diamonds") {
            return '♦';
        }

        else if (suit == "clubs") {
            return '♣';
        }

        else return "error";
    }

    private cardToString(card: Card) {
        // card type to string
        let cardString = card.suit + card.rank;
        return cardString;
    }

    private givePoint(winner: string) {
        let winnerteam1 = false;
        for (let name of this.team1.players) {
            if (name === winner) {
                winnerteam1 = true;
            }
        }
        if (winnerteam1) {
            this.team1.points += 1;
        }
        else {
            this.team2.points += 1;
        }
    }

    private advanceTurn(currentPlayer: User) {
        let newIndex = this.playerList.indexOf(currentPlayer)+1;
        if (newIndex >= this.playerList.length) {
            newIndex = 0;
        }
        this.currentPlayer = this.playerList[newIndex];
    }

    private setPlayer(toFind: CardNamed) {
        for (let player of this.playerList) {
            if (player.username === toFind.name) {
                return player;
            }
        }
    }
}
