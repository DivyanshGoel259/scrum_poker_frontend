

export interface RequestDataType {
  type:string,
  userId:string,
  name:string,
  number?:string,
  gameId?:string|undefined,
  cards?:Array<Pick<Player,"name"|"number">>
  players?:Array<Pick<Player,"name">>
}

export interface ResponseDataType {
    type:string,
    assignedId?:string,
    name?:string,
    number?:string,
    gameId?:string|undefined,
    cards?:Array<Pick<Player,"name"|"number" |"voted">>
    players?:Array<Pick<Player,"name"|"voted">>
    success?:boolean,
    voted:boolean
  }

export interface Player {
  number?:string,
  name:string,
  voted:boolean
}