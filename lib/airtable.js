import Airtable from 'airtable'

const apiKey = process.env.AIRTABLE_API_KEY;
const baseKey = process.env.AIRTABLE_BASE_KEY;
const base = new Airtable({apiKey}).base(baseKey);

const table = base("coffee-stores");

const getMinifiedRecord = (record) =>  {
    return {
        ...record.fields, 
        recordId: record.id 
    }
};

const getMinifiedRecords = (records) =>  {
    return records.map(rec => getMinifiedRecord(rec))
}

const getRecordByFilter = async (id) => {
    const findCoffeeStoreRecords = await table.select({
        filterByFormula: `id="${id}"`
    }).firstPage();

    return getMinifiedRecords(findCoffeeStoreRecords);
}

export {
    table,
    getMinifiedRecords,
    getRecordByFilter
}