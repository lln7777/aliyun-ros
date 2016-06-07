
/*
Author: Ansel Chen
Thanks xiaoshan5733
 */
var ACCEPT, CONTENT_MD5, CONTENT_TYPE, DATE, HEADER_SEPARATOR, QUERY_SEPARATOR, buildCanonicalHeaders, buildQueryString, crypto, deleteHeadersParameters, handleParams, specialEncode;

crypto = require("crypto");

ACCEPT = "Accept";

CONTENT_MD5 = "Content-MD5";

CONTENT_TYPE = "Content-Type";

DATE = "Date";

QUERY_SEPARATOR = "&";

HEADER_SEPARATOR = "\n";


/*
Header 排序：
http协议Header
计算签名必须包含参数，Accept、Content-MD5、Content-Type、Date的值（没有key）（Content-Length不计入签名），并按顺序排列；若值不存在则以”\n”补齐
 */

exports.replaceOccupiedParameters = function(options) {
  var key, paths, result, target, value;
  result = options.uriPattern;
  delete options.uriPattern;
  paths = options;
  if (paths) {
    for (key in paths) {
      value = paths[key];
      target = '{' + key + '}';
      if (~(result.indexOf(target))) {
        result = result.replace(target, value);
        delete paths[key];
      }
    }
  }
  return result;
};

buildCanonicalHeaders = function(headers, header_begin) {
  var i, j, key, len1, result, sortMapArr, unsortMap, value;
  result = "";
  unsortMap = [];
  sortMapArr = [];
  for (key in headers) {
    value = headers[key];
    if (~(key.toLowerCase().indexOf(header_begin))) {
      unsortMap.push([key.toLowerCase(), value]);
    }
  }
  sortMapArr = unsortMap.sort(function(a, b) {
    return a[0] > b[0];
  });
  for (i = j = 0, len1 = sortMapArr.length; j < len1; i = ++j) {
    value = sortMapArr[i];
    result += value[0] + ':' + value[1];
    result += HEADER_SEPARATOR;
  }
  return result;
};

deleteHeadersParameters = function(headers, header_begin) {
  var key, value;
  for (key in headers) {
    value = headers[key];
    if (~(key.toLowerCase().indexOf(header_begin))) {
      delete headers[key];
    }
  }
  return headers;
};

buildQueryString = function(uri) {
  var params, result, sortMap, unSortMap, uriArr;
  unSortMap = [];
  sortMap = [];
  uriArr = uri.split('?');
  result = uriArr[0];
  params = [];
  if (uriArr[1] != null) {
    params = uriArr[1].split('&');
    sortMap = params.sort();
    result += '?' + sortMap.join(QUERY_SEPARATOR);
  }
  console.log(result, '..............');
  return result;
};

exports.composeSignString = function(options) {
  var signString;
  if (options == null) {
    options = {};
  }
  console.log(options, '>>>options    2<<<<<');
  signString = "";
  signString += options.method;
  signString += HEADER_SEPARATOR;
  if (options[ACCEPT]) {
    signString += options[ACCEPT];
  }
  signString += HEADER_SEPARATOR;
  if (options[CONTENT_MD5]) {
    signString += options[CONTENT_MD5];
  }
  signString += HEADER_SEPARATOR;
  if (options[CONTENT_TYPE]) {
    signString += options[CONTENT_TYPE];
  }
  signString += HEADER_SEPARATOR;
  if (options[DATE]) {
    signString += options[DATE];
  }
  signString += HEADER_SEPARATOR;
  signString += buildCanonicalHeaders(options, "x-acs-");
  console.log(options, '>>>options    4<<<<<');
  console.log(signString, '>>>>>sing_to_string 1<<<<<');
  signString += buildQueryString(options.uri);
  console.log(signString, '>>>>>sing_to_string 2<<<<<');
  return signString;
};

exports.getPath = function(options) {
  if (options == null) {
    options = {};
  }
};

specialEncode = function(str) {
  return encodeURIComponent(str).replace(/\+/g, "%20").replace(/\*/g, "%2A").replace(/%7E/g, "~");
};

handleParams = function(params) {
  var i, keysSorted, len, result;
  keysSorted = Object.keys(params).sort();
  result = [];
  i = 0;
  len = keysSorted.length;
  while (i < len) {
    result.push(specialEncode(keysSorted[i]) + "=" + specialEncode(params[keysSorted[i]]));
    i++;
  }
  return result;
};

exports.md5base64 = function(text) {
  return crypto.createHash('md5').update(text).digest('base64');
};

exports.sign = function(secret, signString) {
  var hmac, ret;
  hmac = crypto.createHmac("sha1", secret);
  hmac.update(signString);
  return ret = hmac.digest("base64");
};
