import { createApi } from 'unsplash-js';
import { IApiCoffeeStoreRes, ICoffeeStore } from "@/interfaces/ICoffeeStore";

interface ReqParams{
    limit?:number, 
    query?:string,
    latLong?:string
}

const SEARCH_WORDS = {
    placesAPI: "coffee",
    photos: "coffee shop"
}

const getPlacesApiUrl = (params: ReqParams) => {

    const url = "https://api.foursquare.com/v3/places/search?";
    let query = "query=" + (params.query || SEARCH_WORDS.placesAPI);
    let limit = "limit=" + (params.limit || 30);
    let ll = "ll=" + (params.latLong || "31.785123,35.208340");
    let radius = "radius=15000";
    return `${url}${query}&${ll}&${limit}&${radius}`;
}

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "" 
});

const getCoffeeStorePhotos = async (): Promise<string[]> => {

    const altImgUrl = getDefaultCoffeeStorePhoto()

    const photos = await unsplash.search.getPhotos({
        query: SEARCH_WORDS.photos,
        perPage:40,
        page:1
    })

    if(photos.response?.results){
        return photos.response.results.map(res => res.urls.small);
    }

    return [
        altImgUrl
    ];

}

export const getDefaultCoffeeStorePhoto = () => {
    return "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";
}


export const fetchCoffeeStores = async (params:ReqParams):Promise<ICoffeeStore[]> => {
    const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";
    
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

    
    if(!data || !data.results){
        return [];
    }

    return data.results
    .filter(((store:IApiCoffeeStoreRes) => (!!store.location && !!store.location.address)))
    .map((cs:IApiCoffeeStoreRes,idx:number) => {
        return {
            id:cs.fsq_id,
            name: cs.name,
            address: cs.location.address || null,
            locality: cs.location.locality || null,
            imgUrl: photos[idx] ||  photos[0] 
        }
    });
}