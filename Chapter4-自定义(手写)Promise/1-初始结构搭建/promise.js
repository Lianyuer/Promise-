// 声明构造函数
function Promise(executor) {
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // 声明属性
  this.callbacks = [];
  // // 保存实例对象的 this 的值
  // const self = this;
  // // resolve 函数
  // function resolve(data) {
  //   //  1. 修改对象的状态（PromiseState）
  //   self.PromiseState = "fulfilled"; // resolved
  //   //  2. 设置对象结果值（PromiseResult）
  //   self.PromiseResult = data;
  // }
  // // reject 函数
  // function reject(data) {
  //   //  1. 修改对象的状态（PromiseState）
  //   self.PromiseState = "rejected";
  //   //  2. 设置对象结果值（PromiseResult）
  //   self.PromiseResult = data;
  // }

  /*
   * 或者用箭头函数，直接能把 this 指向实例对象
   *
   */
  // resolve 函数
  const resolve = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    //  1. 修改对象的状态（PromiseState）
    this.PromiseState = "fulfilled";
    //  2. 设置对象结果值（PromiseResult）
    this.PromiseResult = data;
    // 调用成功的回调函数
    setTimeout(() => {
      this.callbacks.forEach((item) => {
        item.onResolved(data);
      });
    });
  };
  // reject 函数
  const reject = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    //  1. 修改对象的状态（PromiseState）
    this.PromiseState = "rejected";
    //  2. 设置对象结果值（PromiseResult）
    this.PromiseResult = data;
    // 调用失败的回调函数
    setTimeout(() => {
      this.callbacks.forEach((item) => {
        item.onRejected(data);
      });
    });
  };
  // 同步执行 【执行器函数】
  try {
    executor(resolve, reject);
  } catch (e) {
    // 修改 promise 对象状态为 【失败】
    reject(e);
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  // 判断回调函数参数,第二个参数不传实现异常穿透
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }
  if (typeof onResolved !== "function") {
    onResolved = (value) => value;
  }
  // 同步任务 then 返回 Promise 对象
  return new Promise((resolve, reject) => {
    // 封装函数
    const callback = (type) => {
      try {
        // 获取回调函数的执行结果
        let result = type(this.PromiseResult);
        // 判断
        if (result instanceof Promise) {
          // 如果是 Promise 类型的对象
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          // 结果的对象状态为 【成功】
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    };
    // 调用回调函数   PromiseState
    if (this.PromiseState === "fulfilled") {
      setTimeout(() => {
        callback(onResolved);
      });
    }
    if (this.PromiseState === "rejected") {
      setTimeout(() => {
        callback(onRejected);
      });
    }
    // 异步任务 then 方法实现，判断pending状态
    if (this.PromiseState === "pending") {
      // 保存回调函数
      this.callbacks.push({
        // 异步修改状态 then 方法结果返回
        onResolved: () => {
          callback(onResolved);
        },
        onRejected: () => {
          callback(onRejected);
        },
      });
    }
  });
};

// 添加 catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

// 添加 resolve 方法
Promise.resolve = function (value) {
  // 返回 promise 对象
  return new Promise((resolve, reject) => {
    // 判断
    if (value instanceof Promise) {
      value.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    } else {
      // 状态设置成功
      resolve(value);
    }
  });
};

// 添加 reject 方法
Promise.reject = function (reason) {
  // 返回 promise 对象
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

// 添加 all 方法
Promise.all = function (promises) {
  // 返回结果为 promise 对象
  return new Promise((resolve, reject) => {
    // 声明变量
    let count = 0;
    let arr = [];
    // 遍历
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          // 得知对象的状态是成功
          // 每个 promise 对象 都成功
          count++;
          // 将当前 promise 对象成功的结果 存入到数组中
          arr[i] = v;
          // 判断
          if (count == promises.length) {
            // 修改状态
            resolve(arr);
          }
        },
        (r) => {
          reject(r);
        }
      );
    }
  });
};

// 添加 race 方法
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          // 修改返回对象的状态为 【成功】
          resolve(v);
        },
        (r) => {
          // 修改返回对象的状态为 【失败】
          reject(r);
        }
      );
    }
  });
};
