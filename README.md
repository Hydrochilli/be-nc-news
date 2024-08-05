
# Northcoders News API
This is the backend part of NC-News an app that 
The .env. files are not included so you will need to create them for each environment.
You will need one for each environment e.g .env.test and .env.dev
in each of these you will   need to put:
PGDATABASE=name_of_database
The name of the respective test and dev databases can be found in the setup.sql file.

Node:
You will need to install node or have it installed with version 14 or later.
If you are running a Debian-based linix like Ubuntu:
```bash
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

```


Dependencies

Dotenv

Express

postgres

Dev-Dependencies
Husky                        

Jest

Supertest



To install deoendancies:

```bash
npm install 
```

Each test will seed and tear down the database. If you want to run all the tests together Jest --inBand is recommended and this has a script in the package.json

Endpoints
For a description of each endpoint see endpoints.json







