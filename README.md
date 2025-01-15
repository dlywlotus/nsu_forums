# NSU FORUMS 

By: Dylan Low Yok Wee

Currently hosted on: https://nsu-forums.onrender.com

## Tester account
* Kindly log in to test out most of the features
* Email: tester1@gmail.com
* Password: 123123

## How to set up 

### Step 1 Supabase account
Create a supabase account and create a new project (free).

### Step 2 Environment variables
Create a .env file in both client and server dirs and add the following into each file.

#### client/env variables

* VITE_SUPABASE_URL= "->PROJECT_SETTINGS->API->PROJECT_URL"
* VITE_SUPABASE_ANON_KEY= "->PROJECT_SETTINGS->PROJECT_API_KEYS"
* VITE_SERVER_API_URL= URL of hosted backend OR http://localhost:3000 if self hosted

#### server/env variables

* PORT=3000
* DB_URL="TOP_NAV->CONNECT->SESSION_POOLER"
* SUPABASE_JWT_SECRET="->PROJECT_SETTINGS->API->JWT_SETTINGS"

### Step 3 Migrate schema tables
Next, populate the database with the schema tables defined in server/models/models.go.
To migrate the tables, cd into the server dir and run "run go migrate/migrate.go".

### Step 4 Start commands
To start front end, "cd client" and "npm run dev".
To start back end, "cd server" and "go run main.go".



