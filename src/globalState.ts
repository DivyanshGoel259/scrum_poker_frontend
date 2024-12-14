import createNewStore from "./zustand/store";


interface InitialStateType {
    organizerName:string|null,
    organizerId:string|null
}

const initialState:InitialStateType={
    organizerName:null,
    organizerId:null
}

export const globalState = createNewStore(initialState,{
    name:"global",
    devTools:true,
    persist:true
})