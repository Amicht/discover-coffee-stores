import React from "react";
import { ICoffeeStore } from "./ICoffeeStore";

export interface IStoreContext{
    state: {
        latLong:string,
        coffeeStores: ICoffeeStore[]
    },
    reducer:{
        saveCoffeeStores: (coffeeStores:ICoffeeStore[]) => void,
        saveLatLong: (latLong:string) => void
    }
}