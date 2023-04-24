import { getMinifiedRecords, getRecordByFilter, table } from '@/lib/airtable';



const favouriteCoffeeStoreById = async (req,res) => {

    try{
        if(req.method === "PUT"){
            const {id} = req.body;
            
            // required fields validation
            if(!id){
                res.status(400).json({message: "Id is missing"});
                return;
            };
            
            // get coffee store by id (create new if doesnt exist)
            const records = await getRecordByFilter(id);
            
            if(records.length == 0){
                res.status(400).json({message: `Coffee store with id ${id} not found`});
                return;
            }

            const updateRes = await table.update([
                {
                    id: records[0].recordId,
                    fields: {
                      voting: records[0].voting + 1
                    }
                  }
            ]);

            if(!updateRes || updateRes.length === 0){
                throw Error();
            }

            const updatedCoffeeStore = updateRes[0].fields;
            res.status(203).json(updatedCoffeeStore);
        }
        else{
            res.status(404).json({message:"Route does not exist"})
        }
    }
    catch(err){
        res.status(500).json({message: "Error upvoting our coffee-store"});
    }
}


export default favouriteCoffeeStoreById;