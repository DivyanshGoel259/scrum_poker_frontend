export interface Player {
  number?: string;
  name: string;
  voted: boolean;
}

export interface Data {
  type: string;
  message: Partial<Message>;
}

export interface Message {
  players: Array<Player>;
  organizerId: string;
  reveal: boolean;
  gameId: string;
  userId: string;
  name: string;
  number: string;
}
