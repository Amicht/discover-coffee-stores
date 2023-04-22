
import { StoreContext } from "@/store/store-context";
import { useContext, useState } from "react";

export const useTrackLocation = () => {

    const [locationErrorMsg,setLocationErrorMsg] = useState("");
    // const [latLong,setLatLong] = useState("");
    const [isFindingLocation,setIsFindingLocation] = useState(false);
    const {reducer:{saveLatLong}, state} = useContext(StoreContext)

    const success = (position: {coords:{latitude:number,longitude:number}}) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        saveLatLong(`${latitude},${longitude}`);

        setLocationErrorMsg("");
        setIsFindingLocation(false);
    };
    
    const error = () => {
        setLocationErrorMsg("Unable to retrieve your location");
        setIsFindingLocation(false);
    };

    const handleTrackLocation = () => {
        setIsFindingLocation(true);

        if(!navigator.geolocation){
            setLocationErrorMsg("Geolocation is not supported by your browser")
        }
        else{
            navigator.geolocation.getCurrentPosition(success,error);
        }
    };
    
    return {
        // latLong,
        handleTrackLocation,
        locationErrorMsg,
        isFindingLocation
    }
}