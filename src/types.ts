export interface User {
    hasPassed: any;
    username: string;
    password: string;
    spot: number;
    cards: Card[];
  }

export interface Card {
    suit: string;
    rank: string;
}

export interface CardNamed {
  card: Card;
  name: string;
}

export interface Team {
  players: String[];
  points: number;
}