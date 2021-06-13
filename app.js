const express = require('express');
const app = express();
const lang = require('./models/shared/language/language-data-store');

require('dotenv/config');

app.use(express.json());

//Import Routes
const ledgerRoute = require('./routes/ledger');
app.use('/ledger', ledgerRoute);

// Start listening to the server
const port = process.env.PORT;
app.listen(port, () => console.log(lang.messages.portListener, port));