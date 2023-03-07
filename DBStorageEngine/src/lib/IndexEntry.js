const {
    v4: uuidv4,
} = require('uuid')
const fh = require('../utils/FileHandler')

class IndexEntry {
    constructor(field_name, order) {
        this.field_name = field_name
        this.order = order
    }

    describe_index_entry() {
        let index_entry = {
            field_name : this.field_name,
            order: this.order
        }
        return index_entry
    }
}

module.exports = IndexEntry