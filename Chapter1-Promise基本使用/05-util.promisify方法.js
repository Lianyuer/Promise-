/**
 * util.promisify 方法
 */

// 引入 util 模块
const util = require("util");

// 引入 fs 模块
const fs = require("fs");

// 返回一个新的函数
let mineReadFIle = util.promisify(fs.readFile);

mineReadFIle("./01promise.html").then(
  (value) => {
    console.log(value.toString(), "132123");
  },
  (err) => {
    throw err;
  }
);
