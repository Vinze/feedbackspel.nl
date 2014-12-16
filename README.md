forever start /var/www/feedbackspel.nl/app.js --watch --watchDirectory /var/www/feedbackspel.nl/


# Running tests
- Install mocha globally using `sudo npm install -g mocha`
- Install exprect.js local with `npm install expect.js`
- `mocha tests/game.js`


# Documentation
## Server side
- Express.js - http://expressjs.com/4x/api.html
- NeDB (database) - https://github.com/louischatriot/nedb
- GM (imagemagick wrapper) - https://github.com/aheckmann/gm

## Client side
- Page.js (routing) - http://visionmedia.github.io/page.js
- Ractive.js (Model-View binding) - http://ractivejs.org/
- Cookies.js (for accessing cookies) - https://github.com/ScottHamper/Cookies
- Zepto - http://zeptojs.com/