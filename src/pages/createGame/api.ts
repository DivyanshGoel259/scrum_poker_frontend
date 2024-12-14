
interface Data {
    organizerId:string,
    gameId:string
}

export const createGame = async (name:string)=>{
    try {
        const response = await fetch("http://localhost:8080/create",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name
            })
        })
        const data = await response.json()

        return [data,null] as [Data,null];

    } catch (err:any){
        return [null,err] as [null,Error]
    }
}