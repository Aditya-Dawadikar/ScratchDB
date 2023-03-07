const Database = require("./src/lib/Database")

function main(){
    db = new Database("employee")

    let BioCollection = db.create_collection("bio")
    
    BioCollection.create_document({
        "f_name":"aditya",
        "l_name":"dawadikar",
        "age":22
    })
    BioCollection.create_document({
        "f_name":"praneet",
        "l_name":"dawadikar",
        "age":12
    })
    BioCollection.create_document({
        "f_name":"maheshwari",
        "l_name":"dawadikar",
        "age":18
    })

    iterator = BioCollection.get_iterator()

    docs = iterator.filter("age","<",20).filter("age",">",15).get_json_array()

    console.log(docs)
}

main()