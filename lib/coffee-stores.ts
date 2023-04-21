import { createApi } from 'unsplash-js';
import { IApiCoffeeStoreRes, ICoffeeStore } from "@/interfaces/ICoffeeStore";

interface ReqParams{
    limit?:number, 
    query?:string,
    ll?:string
}

const getPlacesApiUrl = (params: ReqParams) => {

    const url = "https://api.foursquare.com/v3/places/search?";
    let query = "query=" + (params.query || "coffee");
    let limit = "limit=" + (params.limit || 30);
    let ll = "ll=" + (params.ll || "32.082404%2C34.895666");
    return `${url}${query}&${ll}&${limit}`;
}

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "" ,
});

const getCoffeeStorePhotos = async (): Promise<string[]> => {

    const altImgUrl = "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";

    const photos = await unsplash.search.getPhotos({
        query:"coffee shop",
        perPage:30
    })

    if(photos.response?.results){
        return photos.response.results.map(res => res.urls.small);
    }

    return [
        altImgUrl
    ];

}


export const fetchCoffeeStores = async (params:ReqParams):Promise<ICoffeeStore[]> => {
    const apiKey = process.env.PLACES_API_KEY || "";
    
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: apiKey
        }
    };

    const photos = await getCoffeeStorePhotos();
    
    const data = await fetch(getPlacesApiUrl(params), options)
    .then(response => response.json());

    return data.results.map((cs:IApiCoffeeStoreRes,idx:number) => {
        return {
            id:cs.fsq_id,
            name: cs.name,
            address: cs.location.address,
            locality: cs.location.locality,
            imgUrl: photos[idx] ||  photos[0] 
        }
    });
}