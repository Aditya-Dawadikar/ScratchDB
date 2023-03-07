const fh = require('../utils/FileHandler')
const DocumentReader = require('./DocumentReader')

const Index = require('./Index')

class CollectionReader{
    constructor(collection_uuid){
        this.file_name = `data/collections/${collection_uuid}.collection`

        let doc = fh.readJsonSync(this.file_name)

        this.uuid = doc.uuid
        this.created_at = doc.created_at
        this.last_updated_at = doc.last_updated_at
        this.collection_name = doc.collection_name
        this.database_name = doc.database_name
        this.default_index = doc.default_index
        this.index_list = doc.index_list
    }

    get_iterator(){
        let iterator = new CollectionIterator(this.uuid, this.default_index)
        return iterator
    }
}