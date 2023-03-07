const { 
    v4: uuidv4,
  } = require('uuid');

const fh = require('../utils/FileHandler')

class Document{
    constructor(parent_collection_uuid, json_object){
        let id =  String(uuidv4())
        let ts = Date.now()

        this.uuid = id
        this.created_at = ts
        this.last_updated_at = ts
        this.payload = json_object
        this.collection_uuid = parent_collection_uuid
    }

    save(){
        let file_name = `data/documents/${this.collection_uuid}/${this.uuid}.document`
        fh.writeJsonSync(file_name, this.describe_document())
    }

    describe_document(){
        let document_obj = {
            uuid: this.uuid,
            created_at: this.created_at,
            last_updated_at: this.last_updated_at,
            payload: this.payload,
            collection_uuid: this.collection_uuid
        }
        return document_obj
    }
}

module.exports = Document