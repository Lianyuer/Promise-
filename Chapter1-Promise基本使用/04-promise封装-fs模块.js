/**
 * 封装一个函数 mineReadFile 读取文件内容
 * 参数: path 文件路径
 * 返回: promise对象
 */

function mineReadFile(path) {
  return new Promise((resolve, reject) => {
    require("fs").readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

mineReadFile("./01promise.html").then(
  (value) => {
    console.log("value", value.toString());
  },
  (err) => {
    throw err;
  }
);
