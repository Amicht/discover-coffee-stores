export interface IApiCoffeeStoreRes{
    fsq_id: number;
    name: string;
    location:{
        "address": string,
        "country": string,
        "cross_street": string,
        "formatted_address": string,
        "locality": string,
        "region": string,
    }
}

export interface ICoffeeStore{
    id: number;
    name: string;
    address: string,
    locality: string,
    imgUrl:string
}