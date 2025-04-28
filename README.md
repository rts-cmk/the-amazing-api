# The Amazing API
A RESTful API made with ExpressJS, Prisma and SQLite.

[How to contribute](./CONTRIBUTE.md) | [Changelog](./CHANGELOG.md)


## What it is
TAA is a RESTful API meant for teaching students how to communicate with a real API that follows
the principles of REST as defined by the [Richardson Maturity Model](https://restfulapi.net/richardson-maturity-model/) as well as
industry standards for authentication and authorization.

## How to work it
Once you've cloned the API repository to your computer, run these commands

**Install all dependencies**
```console
npm install
```

**Reset the database**. This will do a complete reset of all data and seed the database with a few startup records.
```console
npm run reset-db
```

**Run the API**
```console
npm start
```

The API comes with a documentation website, which you can open in your web browser: http://localhost:4000.