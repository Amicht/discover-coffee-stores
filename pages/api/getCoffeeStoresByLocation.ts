// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ICoffeeStore } from '@/interfaces/ICoffeeStore';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  coffeeStores?: ICoffeeStore[]
  message?: string
}


export default async function getCoffeeStoresByLocation(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    try{
        const limit = req.query.limit?.toString() || 30;
        const latLong = req.query.latLong?.toString();
        const fetchedCoffeeStores = await fetchCoffeeStores({limit:+limit,latLong});
        res.status(200)
            .json({ coffeeStores: fetchedCoffeeStores });
    }
    catch(err){
        res.status(500)
        .json({ message: "Something went wrong..."});
    }
}
