const DocumentReader = require('./DocumentReader')

const COMPARATORS = ["==", ">", "<", ">=", "<=", "!="]

class CollectionIterator{
    constructor(collection_uuid, index_obj){
        this.collection_uuid = collection_uuid
        this.index = index_obj
        this.doc_list = []
        this.effective_doc_list = []

        this.doc_list = this.index.get_all_records()

        this.doc_list.map((doc_id,pos)=>{
            this.effective_doc_list.push(new DocumentReader(this.collection_uuid,doc_id))
        })
    }

    filter(key, comparator, value){
        let temp_list = []

        if (COMPARATORS.indexOf(comparator) === -1){
            throw "Invalid Comparator"
        }

        switch(comparator){
            case COMPARATORS[1]:
                // greater than
                this.effective_doc_list.map((doc,pos)=>{
                    if(doc.payload[key] > value){
                        temp_list.push(doc)
                    }
                })
                break;
            case COMPARATORS[2]:
                // less than
                this.effective_doc_list.map((doc,pos)=>{
                    if(doc.payload[key] < value){
                        temp_list.push(doc)
                    }
                })
                break;
            case COMPARATORS[3]:
                // greater than or equals to
                this.effective_doc_list.map((doc,pos)=>{
                    if(doc.payload[key] >= value){
                        temp_list.push(doc)
                    }
                })
                break;
            case COMPARATORS[4]:
                // less than or equals to
                this.effective_doc_list.map((doc,pos)=>{
                    if(doc.payload[key] <= value){
                        temp_list.push(doc)
                    }
                })
                break;
            case COMPARATORS[5]:
                // is null
                this.effective_doc_list.map((doc,pos)=>{
                    if(doc.payload[key] !== value){
                        temp_list.push(doc)
                    }
                })
                break;
            default:
                // is equals
                this.effective_doc_list.map((doc,pos)=>{
                    if(doc.payload[key] === value){
                        temp_list.push(doc)
                    }
                })
                break;
        }
        this.effective_doc_list = temp_list

        return this
    }

    get_json_array(){
        let json_array = []
        this.effective_doc_list.map((doc,pos)=>{
            json_array.push(doc.describe_document())
        })
        return json_array
    }
}

module.exports = CollectionIterator
