## DB Server

A server that interacts with the DB Storage Engine to perform the queries on the database. It converts the binary data coming from the DB Storage Engine into JSON format.

### Features
#### 1. Query Validation
    a. Syntax
    b. Symantics
    This will check the sanity of the query. 
        i. Database and Collection Validation
        ii. Datatype Validation
        iii. Query Operation Validation
            For example: 
            - Datetime operations on datetime fields.
            - String search operations on String only 

#### 2. Output Formatting
    The binary output of the DB Storage Engine will be converted to JSON and sent as a response of the query.

#### 3. Cache Query Response
    The output from previous queries can be cached in the memory.

#### 4. Store Database Secrets
    This service will hold all the secrets and metadata regarding all the databases and collections. This information will include the schema information, roles, permissions, etc.

#### 5. Event Logging
    This service will log all the events of the database and store the logs to disk. These logs will be used for concurrency control, deadlock tracking and inconsistency mitigation.