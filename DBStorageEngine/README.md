## DB Storage Engine

A service to perform low level storage operations for collections and document management.

### Features
#### 1. Binary Data Storage
The data will be stored on the Disk in the form of binary data. This data should be efficiently stored to perform fast IO operations.

#### 2. Search Tree and Indexing
The data binary data's start and end bytes location will be refenced in a Search Tree for the search operations. A similar data structure should be created for indexing the documents for fast queries.

#### 3. In-memory Search Tree
The In-memory Search Tree caching mechanism will store one branch of the Search Tree in the memory for fast data retrieval. The updates to this inmemory tree will be written to the disk based on commits and checkpoints. If the document being requested by the user is not in memory, it will be read from the disk and the query will be served from the memory.

#### 4. Query Processing
The input high level language query will be interpreted and equivalent low level language query will be formed before performing the Search. At this stage we can also optimize the query. 
