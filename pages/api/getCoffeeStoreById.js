import { getMinifiedRecords, getRecordByFilter, table } from '@/lib/airtable';



const getCoffeeStoreById = async (req,res) => {

    try{
        if(req.method === "GET"){
            const id = req.query.id;
    
            if(!id){
                res.status(400).json({message: "Id is missing"});
                return;
            };
            
            // get coffee store by id
            const records = await getRecordByFilter(id);
            
            if(records.length === 0){
                res.status(404).json({message: "No coffee-store with id :" + id});
                return;
            }

            res.status(200).json(records[0]);
        
        }
        else{
            res.status(404).json({message:"Route does not exist"})
        }
    } catch(err){
        res.status(500).json({message: "something went wrong"});
    }
}


export default getCoffeeStoreById;