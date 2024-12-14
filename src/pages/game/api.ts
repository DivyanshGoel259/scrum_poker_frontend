import { Data, Player} from "../../types"
import { Dispatch, SetStateAction } from "react"

interface Selected {
    card:string,
    selected:boolean
  }

export const handleSocketRequests = async (socket:WebSocket,data:Data)=>{
    try {      
            socket?.send(JSON.stringify(data))
    } catch (err:any){
        console.log(err.message)
    }
}