const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<html>");
    res.write("<head><title>Home Page</title></head>");
    res.write("<body><h1>Hello, welcome to this site</h1>");
    res.write(
      "<form action='/create-user' method='POST'><input name='username' type='text'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-user" && method === "POST") {
    const body = [];
    let message = "";
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err)
          console.log(
            "Error: " + err + "occured whilst writing to message.txt"
          );
        console.log("Message saved successfully");
      });
    });
    res.writeHead(302, { Location: "/users" });
    return res.end();
  }
  if (url === "/users") {
    const message = fs.readFileSync("message.txt", { encoding: "utf8" });
    console.log(message);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<html>");
    res.write("<head><title>User Page</title></head>");
    res.write("<body><h1>List of Users</h1>");
    res.write("<ul id='usernames'><li>User 1</li>");
    res.write("<li>User 2</li>");
    res.write("<li>User 3</li></ul>");
    res.write(
      "<script> function addUsername() {const usernameList = document.getElementById('usernames'); usernameList.innerHTML += '<li>"
    );
    res.write(message);
    res.write("</li>';}</script>");
    res.write("<button onClick='addUsername()'>Add username");
    res.write("</button>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }
});

server.listen(3000);
