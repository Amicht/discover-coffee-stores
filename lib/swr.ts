import { ICoffeeStore } from '@/interfaces/ICoffeeStore'
import {Fetcher} from 'swr/_internal'

const fetcher: Fetcher<ICoffeeStore, string> = async(id) => {
    const coffeeStore = await fetch(`/api/getCoffeeStoreById?id=${id}`)
        .then(res => res.json());
    return coffeeStore;
}

export {
    fetcher
}