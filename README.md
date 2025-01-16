# NSU FORUMS 

By: Dylan Low Yok Wee

Currently hosted on: https://nsu-forums.onrender.com

## Tester account
* Kindly log in to test out most of the features
* Email: tester1@gmail.com
* Password: 123123

## How to set up 

### Step 1 Supabase account
* Create a supabase account and create a new project (free).

### Step 2 Disable confirm email
* Navigate to homepage -> taskbar -> authentication -> providers -> email
* Click on email and untoggle confirm email.

### Step 3 Set up storage CDN
* Navigate to homepage -> taskbar -> storage -> new bucket -> email
* Fill in the name of the bucket EXACTLY as "profile_icons" and ACTIVATE "Public bucket".
* Navigate to storage -> configuration -> policies -> profile_icons -> new policy -> for full customization.
* Name the policy anything, for allowed operations check all the boxes and select "authenticated" for target roles.
* Leave the "Policy definition" as is, then click on "Review" and finally "Save policy"

### Step 4 Environment variables
Create a .env file in both client and server dirs and add the following into each file.

#### client/env variables
* VITE_SUPABASE_URL= "->PROJECT_SETTINGS->API->PROJECT_URL"
* VITE_SUPABASE_ANON_KEY= "->PROJECT_SETTINGS->PROJECT_API_KEYS"
* VITE_SERVER_API_URL= URL of hosted backend OR http://localhost:3000 if self hosted
* 
#### server/env variables
* PORT=3000
* DB_URL="TOP_NAV->CONNECT->SESSION_POOLER"
* SUPABASE_JWT_SECRET="->PROJECT_SETTINGS->API->JWT_SETTINGS"

### Step 5 Migrate schema tables
* Next, populate the database with the schema tables defined in server/models/models.go.
* To migrate the tables, cd into the server dir and run "go run migrate/migrate.go".

### Step 6 Un-comment initializer
* Navigate to server/main.go and un-comment "initialisers.LoadEnvVariables()" if running on local host.
* If you choose to host the server on railway for example, leave it commented and add ur env variables in your host provider's dashboard. It should be usually under environment.

### Step 7 Start client
* cd client -> npm i -> npm run dev
### Step 8 Start server
* cd server -> go run main.go



