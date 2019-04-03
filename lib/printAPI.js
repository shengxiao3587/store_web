export function doConnect(callback) {
  let socket;
  const httpType = document.location.protocol;
  if (httpType === 'http:') {
    socket = new WebSocket('ws://localhost:13528');
  } else {
    socket = new WebSocket('wss://localhost:13529');
  }
  // 如果是https的话，端口是13529
  // socket = new WebSocket('wss://localhost:13529');
  // 打开Socket
  socket.onopen = function () {
    // 监听消息
    socket.onmessage = callback;
    // 监听Socket的关闭
    socket.onclose = function (event) {
    };
  };
  return socket;
}
/**
*
* 获取请求的UUID，指定长度和进制,如
* getUUID(8, 2) //"01001010" 8 character (base=2)
* getUUID(8, 10) // "47473046" 8 character ID (base=10)
* getUUID(8, 16) // "098F4D35"。 8 character ID (base=16)
*
*/
export function getUUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}
export function doPrint(socket, printData) {
  var request = JSON.parse(printData);
  request.task.taskID =  getUUID(8, 16);
  request = JSON.stringify(request);
  socket.send(request);
}
