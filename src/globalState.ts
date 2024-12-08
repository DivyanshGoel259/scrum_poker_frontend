import createNewStore from "./zustand/store";


interface InitialStateType {
    name:string|null
}

const initialState:InitialStateType={
    name:null
}

export const globalState = createNewStore(initialState,{
    name:"global",
    devTools:true,
    persist:true
})