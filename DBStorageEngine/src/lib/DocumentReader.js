const fh = require('../utils/FileHandler')

class DocumentReader{
    constructor(collection_uuid,document_uuid){
        this.file_name = `data/documents/${collection_uuid}/${document_uuid}.document`

        let doc = fh.readJsonSync(this.file_name)

        this.uuid = doc.uuid
        this.created_at = doc.created_at
        this.last_updated_at = doc.last_updated_at
        this.payload = doc.payload
        this.collection_uuid = doc.collection_uuid
        
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

    save(){
        fh.writeJsonSync(this.file_name, this.describe_document())
    }

    delete(){
        fh.deleteJsonSync(this.file_name)
    }
}

module.exports = DocumentReader