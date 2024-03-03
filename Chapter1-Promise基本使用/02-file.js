const fs = require("fs");

// fs.readFile("./promise.html", (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

const p = new Promise((resolve, reject) => {
  fs.readFile("./promise.html", (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

p.then(
  (value) => {
    console.log(value.toString());
  },
  (err) => {
    console.log(err);
  }
);
