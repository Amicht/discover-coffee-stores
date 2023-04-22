import { ICoffeeStore } from "@/interfaces/ICoffeeStore";
import { IStoreContext } from "@/interfaces/IStoreContextType";
import React from "react";


export const initialCtxt:IStoreContext = {
    state:{
      coffeeStores: [],
      latLong: ""
    },
    reducer:{
      saveCoffeeStores: (coffeeStores) => {},
      saveLatLong: (latLong) => {},
    }
}
  
export const StoreContext = React.createContext<IStoreContext>(initialCtxt);
  
export const StoreProvider = (props:{children:React.ReactNode}) => {

    const [coffeeStores, setCoffeeStores] = React.useState<ICoffeeStore[]>([])
    const [latLong, setLatLong] = React.useState<string>("");

    const newInitialCtxt:IStoreContext = {
        reducer:{
        saveCoffeeStores: (newCoffeeStores:ICoffeeStore[]) => {
            setCoffeeStores(newCoffeeStores)
        },
        saveLatLong: (newLocation:string) => { 
            setLatLong(newLocation) 
        }
        },
        state:{
        latLong,
        coffeeStores
        }
    }

    return <StoreContext.Provider value={newInitialCtxt} >
        {props.children}
    </StoreContext.Provider>
}