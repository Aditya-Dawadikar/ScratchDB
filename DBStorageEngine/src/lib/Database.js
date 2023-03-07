const { 
    v4: uuidv4,
  } = require('uuid');

const fh = require('../utils/FileHandler')

const Collection = require("./Collection")

class Database{
    constructor(database_name){
        let id =  String(uuidv4())
        let ts = Date.now()

        this.uuid = id
        this.created_at = ts
        this.last_updated_at = ts
        this.database_name = database_name
        this.collections = []

        fh.writeJsonSync(`data/dbs/${database_name}.db`, this.describe_database())
    }

    create_collection(collection_name){
        const new_collection = new Collection(this.database_name,collection_name)
        this.collections.push(new_collection)
        
        fh.writeJsonSync(`data/dbs/${this.database_name}.db`, this.describe_database())

        return new_collection
    }

    delete_collection(collection_name){
        
        let collection_location = -1
        this.collections.map((collection,index)=>{
            if (collection.collection_name === collection_name){
                collection_location = index
                return
            }
        })
        if (collection_location == -1){
            throw new Error(`Collection: ${collection_name} not found in Database: ${this.database_name}`)
        }
        
        let collection_to_delete = this.collections[collection_location]
        collection_to_delete.delete_data()
        
        this.collections.splice(collection_location,1)
        
        fh.writeJsonSync(`data/dbs/${this.database_name}.db`, this.describe_database())

    }

    get_collections(){
        return this.collections
    }

    describe_database(){
        let db_object = {
            uuid: this.uuid,
            db_name: this.database_name,
            created_at: this.created_at,
            last_modified_at: this.last_updated_at,
            collections: []
        }
        this.collections.map((collection,index)=>{
            db_object.collections.push(collection.describe_collection())
        })

        return db_object
    }
}

module.exports = Database