# Set and get values in a server

This is a program that runs a server that is accessible on http://localhost:4000/.

## Features

When your server receives a request on http://localhost:4000/set?somekey=somevalue it should store the passed key and value in memory.

When it receives a request on http://localhost:4000/get?key=somekey it should return the value stored at somekey.

## Limitations

- When url contains the "set" parameter, it does not verify the parameters "key" and "value" are not empty
- The server stores values in memory but not in a file or databse
