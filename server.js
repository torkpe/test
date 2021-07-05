var express = require('express'); // Using var here simply means we can easily override the express variable anywhere in the codebase as this is now globally scoped. It is best to use const or let or for this case an import statement is actually preferrable

import { request, abort, } from 'request-promise';

const port = process.env.PORT || 1337;

const app = express();

async function incoming2outgoingPayload(payload) {
  import jsontoxml from 'jsontoxml'; //  Why not move all imports to the top of the codeblock? This only means that we always have to import jsontoxml everytime this function is called, which could lead to performance issues. Another reason would be to make the code easier to read.
  const itemsToXML = {}
  for(let i = 0; i <= payload.items.length; i++) {
    const startDate = new Date(payload.items[i].start);
    const endDate = new Date(payload.items[i].end);
    itemsToXML[`vacation-${startDate.toString()}-${endDate.toString()}`] = payload.items[i].approved == true ? true : false; // we could make this shorter and neater by by using !!payload.items[i].approved instead of the ternary.
  }
  return jsontoxml(itemsToXML)
}

async function fetch(url, payload) {
  console.log("Triggering url " + url); // For production purpose, we are better off using a logger as ooposed to console.log since console.log is a development tool. Also, es6's string literals feature could help make this more readable.

  body = incoming2outgoingPayload(payload); // looks like body was not declared here.

  return request({ url: url, method: 'Post', body: body }) // we could take advantage of es6's destruturing feature here since the keys and values for url and body are the same.
}

async function cancel(request) { // for easier readability, I think it's best to takeout codeblocks that are not being used.
  return await abort(request);
}

const isValidVacationRequest = (payload) => payload.employee !== undefined && payload.items.every((item) => item["end"] > item["start"]) // In order to avoid breakage, it's actually safer to check if the payload contains the "items" key.
// Also, breaking the code blocks into more lines instead of having one long line will help to boost the readability of the code.

function index(req, res) {
  /* Employe can send a webrequest to this endpoint to request vacation.

  The request will be forwarded to internal systems to register the
  vacation. The format of the reuqest should be

  Example:
      $ curl \
          -XPOST \
          -H "Content-Type: application/json" \
          localhost:5000/vacation \
          -d '{"employee":"tom", items: [{"start": 1549381557, "end": 1549581523, "approved": true}]}'

  */
  const payload = JSON.parse(request.body);
  if (!isValidVacationRequest(payload)) {
    res.status(404).send('Invalid vacation request');
    return;
  }

  const responses = await Promise.all([
    fetch("https://api.hr-management.com/webhook", payload),
    fetch("https://api.hr-management.com/webhook", payload),
    fetch("https://api.sprintboard.com/notify", payload),
  ]);

  return notified(responses); // Since the notified function isn't making use of the passed argument, I don't think it's necessary passing the responses to it. Unless it's being utilised.
  // We don't seem to be handling errors here. This will definitely lead to a 5xx error which we do not want because of poor error handling, should incase something goes wrong\.
}

app.get('/health', function (req, res) {
  res.send('ok!');
});

app.post('/vacation', index)

function notified(responses) { return "I notifed everyone - you are ready to go on vacation 🏖" }

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});