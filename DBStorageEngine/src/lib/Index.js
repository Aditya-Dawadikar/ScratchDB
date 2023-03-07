const {
    v4: uuidv4,
} = require('uuid')
const fh = require('../utils/FileHandler')

const IndexEntry = require('./IndexEntry')

class Index {
    constructor(database_name, collection_name, is_default, fields) {
        let id = String(uuidv4())
        let ts = Date.now()

        this.is_default = is_default
        this.uuid = id
        this.created_at = ts
        this.last_updated_at = ts
        this.collection_name = collection_name
        this.database_name = database_name
        this.index_fields = []

        if (is_default === false) {
            this.name = `${collection_name}_${id}.index`
            fields.map((entry,index)=>{
                let entry_obj = new IndexEntry(entry.field_name,entry.order)
                this.index_fields.push(entry_obj)
            })
        }else{
            this.name = `${collection_name}_default.index`
            let entry_obj = new IndexEntry("uuid",1)
            this.index_fields.push(entry_obj)
        }

        let index_location = `data/indexes/${this.name}`
        fh.writeJsonSync(index_location, {})
    }

    describe_index() {
        let index_object = {
            uuid: this.uuid,
            name: this.name,
            created_at: this.created_at,
            last_modified_at: this.last_updated_at,
            collection_name: this.collection_name,
            database_name: this.database_name,
            index_fields: []
        }

        this.index_fields.map((entry) => {
            index_object.index_fields.push(entry.describe_index_entry())
        })

        return index_object
    }

    add_record(key, payload){
        let curr_data = fh.readJsonSync(`data/indexes/${this.name}`)
        curr_data[key] = payload
        fh.writeJsonSync(`data/indexes/${this.name}`, curr_data)
    }

    get_record(key){
        let curr_data = fh.readJsonSync(`data/indexes/${this.name}`)
        if (curr_data.hasOwnProperty(key) === true){
            return curr_data[key]
        }
        return null
    }

    remove_record(key){
        let curr_data = fh.readJsonSync(`data/indexes/${this.name}`)
        delete curr_data[key]
        fh.writeJsonSync(`data/indexes/${this.name}`, curr_data)
    }

    delete_index() {
        let index_location = `data/indexes/${this.name}`
        fh.deleteJsonSync(index_location)
    }

    get_all_records(){
        let curr_data = fh.readJsonSync(`data/indexes/${this.name}`)
        return Object.keys(curr_data)
    }
}

module.exports = Index