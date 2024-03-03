/**
 * recource 1.txt 2.txt 3.txt 文件内容
 */

const fs = require("fs");
const util = require("util");
const mineReadFile = util.promisify(fs.readFile); // 将 API 转化成 promise 形态的函数

// 回调函数的方式
// fs.readFile("./recource/1.txt", (err, data1) => {
//   if (err) throw err;
//   fs.readFile("./recource/2.txt", (err, data2) => {
//     if (err) throw err;
//     fs.readFile("./recource/3.txt", (err, data3) => {
//       if (err) throw err;
//       console.log(data1 + data2 + data3);
//     });
//   });
// });

// async 和 await
async function main() {
  try {
    let data1 = await mineReadFile("./recource/1.txt");
    let data2 = await mineReadFile("./recource/2.txt");
    let data3 = await mineReadFile("./recource/3.txt");
    console.log(data1 + data2 + data3);
  } catch (error) {
    console.log(error);
  }
}

main();
