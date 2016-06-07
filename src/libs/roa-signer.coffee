###
Author: Ansel Chen
Thanks xiaoshan5733
###
crypto = require("crypto")

ACCEPT           = "Accept"
CONTENT_MD5      = "Content-MD5"
CONTENT_TYPE     = "Content-Type"
DATE             = "Date"
QUERY_SEPARATOR  = "&"
HEADER_SEPARATOR = "\n"


###
Header 排序：
http协议Header
计算签名必须包含参数，Accept、Content-MD5、Content-Type、Date的值（没有key）（Content-Length不计入签名），并按顺序排列；若值不存在则以”\n”补齐
### 

exports.replaceOccupiedParameters = (options)->
  result = options.uriPattern
  delete options.uriPattern
  paths = options
  if paths
    for key, value of paths
      target = '{' + key + '}'
      if ~(result.indexOf target)
        result = result.replace target, value
        delete paths[key]
  return result

# change the give headerBegin to the lower() which in the headers
# and change it to key.lower():value
buildCanonicalHeaders = (headers, header_begin)->
  result = ""
  unsortMap = []
  sortMapArr = []
  for key, value of headers
    if ~(key.toLowerCase().indexOf header_begin)
      unsortMap.push [key.toLowerCase(), value]

  sortMapArr = unsortMap.sort (a, b)->a[0] > b[0]

  for value, i in sortMapArr
    result += value[0] + ':' + value[1]
    result += HEADER_SEPARATOR
  return result

deleteHeadersParameters = (headers, header_begin)->
  for key, value of headers
    if ~(key.toLowerCase().indexOf header_begin)
      delete headers[key]
  return headers

buildQueryString = (uri)->
  unSortMap = []
  sortMap = []
  uriArr = uri.split '?'
  result = uriArr[0]
  params = []
  if uriArr[1]?
    params = uriArr[1].split '&'
    sortMap = params.sort()
    result += '?' + sortMap.join QUERY_SEPARATOR
  return result

exports.composeSignString = (options = {})->
  # 先拼装出uri
  signString = ""
  signString += options.method
  signString += HEADER_SEPARATOR
  signString += options[ACCEPT] if options[ACCEPT]
  signString += HEADER_SEPARATOR
  signString += options[CONTENT_MD5] if options[CONTENT_MD5]
  signString += HEADER_SEPARATOR
  signString += options[CONTENT_TYPE] if options[CONTENT_TYPE]
  signString += HEADER_SEPARATOR
  signString += options[DATE] if options[DATE]
  signString += HEADER_SEPARATOR
  # 至此，标准头已经排好序

  # 加入CanonicalizedHeaders
  signString += buildCanonicalHeaders(options, "x-acs-")
  # deleteHeadersParameters(options, "x-acs-")
  signString += buildQueryString options.uri
  return signString

handleParams = (params)->
  keysSorted = Object.keys(params).sort()
  result = []
  i = 0
  len = keysSorted.length
  while i < len
    result.push specialEncode(keysSorted[i]) + "=" + specialEncode(params[keysSorted[i]])
    i++
  result

exports.md5base64  = (text)->
  crypto.createHash('md5').update(text).digest('base64')

exports.sign = (secret, signString) ->
  hmac = crypto.createHmac("sha1", secret)
  hmac.update signString
  ret = hmac.digest "base64"