/***
 *
 * Node.js Master Class
 * Assignment # 1
 * Author: Frank Ruiz
 *
 */

var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

var server = http.createServer((req, res) => {
  // Get the URL en parse it
  var parsedUrl = url.parse(req.url, true);
  // Get the current path
  var path = parsedUrl.pathname;
  // Trim de path
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string a an object
  var queryString = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the headers as an object
  var headers = req.headers;

  // Get the payload
  var decoder = new StringDecoder("utf-8");
  var buffer = "";

  req.on("data", data => (buffer += decoder.write(data)));

  req.on("end", () => {
    buffer += decoder.end();

    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryString: queryString,
      method: method,
      headers: headers,
      payload: buffer
    };

    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload called back by the handler, or default to
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to JSON format
      var payloadString = JSON.stringify(payload);

      // Set JSON response
      res.setHeader("Content-Type", "application/json");

      // Set the head status
      res.writeHead(statusCode);

      // Send the response
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});

// Define the handlers
var handlers = {};

// greeting handler
handlers.greeting = (data, callback) => {
  callback(406, { greeting: "Hello evarybody I'm an Node.js API response!" });
};

// not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define routers
var router = {
  hello: handlers.greeting
};
