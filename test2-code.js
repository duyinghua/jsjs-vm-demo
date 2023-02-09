function randomstring(n) {
  var charts = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  var res = "";
  for (var i = 1; i <= n; i++) {
    res = res + charts[parseInt(Math.random() * charts.length)];
  }
  return res;
}

/**
 * author：xuxincheng
 * file：加密签名方法，每次接口请求都要带上签名头，不然会被拒绝
 */
// 加密算法
var hmacSha256Signer = function (stringToSign, accessKeySecret) {
  // var hmac = crypto.createHmac('sha256', accessKeySecret)
  // hmac.update(stringToSign)
  // return hmac.digest('base64')
  return stringToSign + "___base64_" + accessKeySecret;
};

// 排序
var sortByFirstLetter = function (queryStr) {
  var arr = queryStr.split("&");
  arr.sort();
  return arr.join("&");
};

var getQueryParams = function (options) {
  // 只有uri里面的query参与计算，如果post请求就query都不参与计算了
  if (["GET", "get"].indexOf(options.method) > -1) {
    var uriSplit = options.uri.split("?");
    var queryString = uriSplit.length > 1 ? uriSplit[1] : "";
    if (queryString) {
      return "&query=" + sortByFirstLetter(queryString) || "";
    } else {
      return "";
    }
  } else if (["POST", "post"].indexOf(options.method) > -1) {
    return "";
  }
};
var requestWithSign = function (options, conf) {
  // 签名参数
  var params = {
    // 签名id，固定
    accessKeyId: conf.id,
    // 签名秘钥，测试环境和线上环境不同
    accessKeySecret: conf.secret,
    nonce: randomstring(32),
    timestamp: Math.ceil(new Date().getTime() / 1000),
  };

  var host = options.uri.split("//")[1].split("/")[0];
  var path = options.uri.split("?")[0].split("//")[1].replace(host, "");
  var query = getQueryParams(options);
  // try {
  //   query = (query + '').replace(/%2B/g, '%20')
  // } catch (err) {
  //   query = query.replace(/\+/g, '%20')
  // }
  // query = decodeURI(query)
  // 拼接待签字符串，参考http://wiki.lianjia.com/pages/viewpage.action?pageId=196970204&focusedCommentId=264439842#comment-264439842
  var signstring = "accessKeyId="
    .concat(params.accessKeyId, "&host=")
    .concat(host, "&method=")
    .concat(options.method.toUpperCase(), "&nonce=")
    .concat(params.nonce, "&path=")
    .concat(path)
    .concat(query, "&timestamp=")
    .concat(params.timestamp);
  // 拼接签名内容
  var hashSignString = hmacSha256Signer(signstring, params.accessKeySecret);
  var authorization = "LJ-HMAC-SHA256 accessKeyId="
    .concat(params.accessKeyId, "; nonce=")
    .concat(params.nonce, "; timestamp=")
    .concat(params.timestamp, "; signature=")
    .concat(hashSignString);
  return authorization;
};
var options = {
  uri: "https://app-center-test-demo-osiris-csr-node.ttb.test.ke.com/api?id=123&type=op",
  method: "get",
};
var conf = { id: "89757", secret: "duyinghua" };
var res = requestWithSign(options, conf);
console.log(res);
