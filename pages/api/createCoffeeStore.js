import { getMinifiedRecords, getRecordByFilter, table } from '@/lib/airtable';



const createCoffeeStore = async (req,res) => {

    try{
        if(req.method === "POST"){
            const newCofeeStore = req.body;
            const {id} = req.body;
    
            // required fields validation
            if(!id){
                res.status(400).json({message: "Id is missing"});
                return;
            };
            
            // get coffee store by id (create new if doesnt exist)
            const records = await getRecordByFilter(id);
            
            if(records.length !== 0){
                res.status(200).json(records[0]);
            }
            else{
    
                if(!req.body.name){
                    res.status(400).json({message: "Failed to create new store: 'name' is missing"});
                    return;
                };
                const createdCoffeeStore = await table.create([
                    {
                        "fields": newCofeeStore
                    }
                ]);
    
                const records = getMinifiedRecords(createdCoffeeStore);
    
                res.status(201).json(records[0])
            }
        
        }
        else{
            res.status(404).json({message:"Route does not exist"})
        }
    }
    catch(err){
        res.status(500).json({message: "error finding or creating a store"});
    }
}


export default createCoffeeStore;


