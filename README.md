# book-management-backend
Create, Read, Update, and Delete (CRUD) operations for managing books.

## Getting Started

### Features
- Provides APIs to-
  - Create Book 
  - Query Book by query params 
  - Get Book by id 
  - Update Book by id 
  - Delete Book by id

For detailed understanding each API functionality refer to [api specification](api-spec.yml).

### Pre-requisites
- Install Node.js 14.x and above.

### Installation and Project setup
1. Clone the project repository.
    ```bash
   git clone https://github.com/Anuhya-Peddineni/book-management-backend.git
    ```
2. Follow below steps to run locally
   1. Install packages-
        ```bash
        npm i
        ```
   2. Configure Environment-
      
      - By default, NODE_ENV=dev and respective .env.dev config file present under config folder will be considered.
      - To override-set NODE_ENV using below command
        ```bash
        set NODE_ENV=<provide node enviroment>
        ```
      - Create a .env file under config folder with below variables. Use .env.dev config for reference.
           
         ``` MongoDbUrl ```
         
         ``` ServerPort ```
         
         ``` logLevel ```
   3. Run the project-
      ```bash
        npm run start
      ```
3. Follow below steps to run with Docker
   1. Configure Environment-

        - By default, NODE_ENV=dev and respective .env.dev config file present under config folder will be considered.
        - To override-Create a .env file under config folder with below variables. Use .env.dev config for reference.

          ``` MongoDbUrl=mongodb://mongodb:27017/books (mandatory to be assigned to same specified value) ```

          ``` ServerPort ```

          ``` logLevel ```
   2. Run the project by specifying env-
      ```bash
        docker compose-up -e NODE_ENV=dev 
      ```
        OR
      ```bash
        docker compose-up -e NODE_ENV=<configured custom environment> 
      ```
      
4. The APIs will be available at `http://localhost:3000` or `http://localhost:<configured PORT>`.

### Run test
`npm run test`

### Run ESLint
`npm run lint`
