import { Player, RequestDataType, ResponseDataType } from "../../types"
import { Dispatch, SetStateAction } from "react"

export const handleSocketMessages = (message:MessageEvent<any>,setPlayers:Dispatch<SetStateAction<Player[] | undefined>>,players:Array<Player>|undefined,setSelected:React.Dispatch<React.SetStateAction<boolean>>,setRevealed:React.Dispatch<React.SetStateAction<boolean>>)=>{
    try {
            
            const data:ResponseDataType= JSON.parse(message.data)

            switch (data.type){
                case "join":{
                    const newPlayer =data
                    const newPlayers = players
                    newPlayers?.push({name:newPlayer.name!,voted:data.voted})
                    setPlayers(newPlayers)
                    
                    break;
                }

                case "all":{
                    console.log("object");
                    setPlayers(data.players)
                    break;                    
                }

                case "selected":{
                    setPlayers(prevPlayers => 
                        prevPlayers?.map(player => 
                        player.name === data.name
                            ? { ...player,voted:data.voted } 
                            : player
                        )
                      );
                    break;
                }

                case "new_user":{
                    if(data.assignedId){
                    localStorage.setItem("userId",data.assignedId)
                    }
                    break;
                }

                case "reveal":{
                    
                    setPlayers(data.cards)
                    setRevealed(true)
                    break;
                }
            }
        
    } catch (err:any){
        console.log(err.message)
    }
}

interface RequestArgs {
    type:string,
    name:string
    number?:string
    socket:WebSocket|null
    gameId?:string
}

export const handleSocketRequests = async (data:RequestArgs)=>{
    try {      
            
            const userId = localStorage.getItem("userId")
            switch (data.type){

                case "join":{
                    data.socket?.send(JSON.stringify({
                        type:data.type,
                        name:data.name,
                        userId:userId,
                        gameId:data.gameId
                    }))
                    data.socket?.send(JSON.stringify({
                        type:"all",
                        name:data.name,
                        userId:userId,
                        gameId:data.gameId
                    }))
                    break;
                }

                case "all":{
                    data.socket?.send(JSON.stringify({
                        type:data.type,
                        gameId:data.gameId,
                        userId:userId
                    }))
                    break;                    
                }

                case "selected":{
                    const selectedData:RequestDataType={
                        gameId:data.gameId,
                        name:data.name,
                        type:data.type,
                        userId:userId!,
                        number:data.number
                    }
                    data.socket?.send(JSON.stringify(selectedData))
                    break;
                }

                case "reveal":{
                    data.socket?.send(JSON.stringify({...data,userId}))
                    break;
                }
            }
        
    } catch (err:any){
        console.log(err.message)
    }
}