const {
    v4: uuidv4,
} = require('uuid')
const fh = require('../utils/FileHandler')
const Document = require('./Document')
const DocumentReader = require('./DocumentReader')
const CollectionIterator = require('./CollectionIterator')

const Index = require('./Index')

class Collection {
    constructor(database_name, collection_name) {
        let id = String(uuidv4())
        let ts = Date.now()

        this.uuid = id
        this.created_at = ts
        this.last_updated_at = ts
        this.collection_name = collection_name
        this.database_name = database_name
        this.default_index = {}
        this.index_list = []

        this.create_default_index()
        let folder_name = `data/documents/${this.uuid}`
        fh.createFolder(folder_name)
        let file_name = `data/collections/${this.uuid}.collection`
        fh.writeJsonSync(file_name, this.describe_collection())
    }

    get_collection_id() {
        return this.uuid
    }

    get_collection_name() {
        return this.collection_name
    }

    describe_collection() {
        let collection_object = {
            uuid: this.uuid,
            created_at: this.created_at,
            last_modified_at: this.last_updated_at,
            collection_name: this.collection_name,
            database_name: this.database_name,
            default_index: this.default_index.describe_index(),
            index_list: []
        }

        this.index_list.map((index_item,id)=>{
            collection_object.index_list.push(index_item.describe_index())
        })

        return collection_object
    }

    create_default_index(){
        let default_index = new Index(this.database_name, this.collection_name, true, null)
        // this.index_list.push(default_index)
        this.default_index = default_index
    }

    delete_indexes(){
        this.index_list.map((index_object,index)=>{
            let index_location = `data/indexes/${index_object.index_name}`
            fh.deleteJsonSync(index_location)
        })
    }

    create_document(payload){
        let new_document = new Document(this.uuid, payload)

        new_document.save()

        let file_location = `data/documents/${this.uuid}/${new_document.uuid}.document`
        this.default_index.add_record(new_document.uuid, file_location)

        return new_document
    }

    update_document(document_uuid,payload){
        this.check_document_exists(document_uuid)

        let existing_document = new DocumentReader(this.uuid,document_uuid)
        for(const [key, value] of Object.entries(payload)){
            existing_document.payload[key] = value
        }
        existing_document.save()
    }

    check_document_exists(doc_uuid){
        if (this.default_index.get_record(doc_uuid)=== null){
            throw `Document with uuid ${doc_uuid} not found`
        }
    }

    delete_document(document_uuid){
        this.check_document_exists(document_uuid)

        let existing_document = new DocumentReader(this.uuid,document_uuid)

        this.default_index.remove_record(document_uuid)

        existing_document.delete()
    }

    delete_data(){
        this.delete_indexes()
        this.delete_documents()
    }

    get_iterator(){
        let iterator = new CollectionIterator(this.uuid, this.default_index)
        return iterator
    }
}

module.exports = Collection