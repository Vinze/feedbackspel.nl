# Feedbackspel.nl
## Installation
1. Download or clone this repository
2. Navigate to the **app** folder in your terminal
3. Install the modules with `npm install`
4. Rename or copy **app/libs/config.example.js** to **app/libs/config.js** and set the application variables in this file

## Running the application
1. Navigate to the **app** folder in your terminal
2. Start the application with `node app.js`
3. Go to http://localhost:1337 with your webbrowser

## Running tests
- Install mocha globally using `sudo npm install -g mocha`
- Install expect.js local with `npm install expect.js` (in the 'tests' folder)
- `mocha tests/game.js`