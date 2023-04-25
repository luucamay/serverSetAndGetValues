# Set and get values in a server

This is a program that runs a server that is accessible on http://localhost:4000/ or https://server-set-and-get-values.vercel.app/set?somekey=somevalue

## Features

When your server receives a request on http://localhost:4000/set?somekey=somevalue it should store the passed key and value in memory.

When it receives a request on http://localhost:4000/get?key=somekey it should return the value stored at somekey.

## Set up the application

1. Clone this repository
2. Inside the folder of the repository run `node server.js`

## Limitations

- When url contains the "set" parameter, it does not verify the parameters "key" and "value" are not empty
- The server stores values in memory but not in a file or databse
