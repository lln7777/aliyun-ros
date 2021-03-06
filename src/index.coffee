roaSigner = require './libs/roa-signer'
request   = require 'request'
_         = require 'lodash'
uuid      = require 'uuid'

config = 
  protocol: 'http'
  domain: 'ros.aliyuncs.com'

# ###
#   调用方式：
#   doRequest 'ecs.CreateInstance', options, cb
#   doRequest 'ecs:CreateInstance', options, cb
# ###
doRequest = (reqOptions, callback)->
  self = this
  if callback?
    # @TODO
  else
    return new Promise (resolve, reject)->
      request reqOptions, (err, res, body)->
        if err?
          reject err
        else
          if self.after? and (typeof self.after is 'function')
            self.after body
          resolve res
      return


###
使用原理：
1. 先排序
2. 再签名
### 

class Client

  options :
    "AccessKeyId":             ''
    "AccessKeySecret":         ''
    "Content-Type":            'application/json;charset=utf-8'
    "Accept":                  'application/json'
    "Cache-Control":           'no-cache'
    "Connection":              "keep-alive"
    "Pragma":                  'no-cache'
    "x-acs-signature-nonce":   ''
    "x-acs-signature-method":  'HMAC-SHA1'
    "x-acs-signature-version": '1.0'
    "x-acs-version":           '2015-09-01'
    'x-acs-region-id':         'cn-beijing'

  ###
  构建方法
  @params options 应包括基本的Key和Secret
  ###
  constructor: (options)->
    # 用用户自定义的参数替代默认参数
    if typeof options is 'object'
      if options.AccessKeyId and options.AccessKeySecret
        _.assign @options, options
      else
        throw new Error '请设置AccessKeyId和AccessKeySecret'
    else
      throw new Error '实例化参数类型不正确'


  request: (options)->
    _options = _.extend {}, @options, options
    # 写入调用时间
    _options['Date'] = (new Date()).toGMTString()
    # 如果没有指定，那么写入调用随机数
    _options['x-acs-signature-nonce'] = uuid.v4()

    # 拼接URI
    _options.uri = roaSigner.replaceOccupiedParameters(_options)
    # md5内容
    if _options.body?
      _options['Content-MD5'] = roaSigner.md5base64 _options.body
    # 组织签名字符串
    composeString = roaSigner.composeSignString(_options)
    signature = roaSigner.sign _options.AccessKeySecret, composeString

    KeyId = _options.AccessKeyId
    reqOptions =
      method: _options.method ? 'GET'
      # json: true
      uri: "#{config.protocol}://#{config.domain}#{_options.uri}"
    reqOptions.body = _options.body if _options.body?
    delete _options.AccessKeyId
    delete _options.AccessKeySecret
    delete _options.body
    delete _options.method
    delete _options.uri

    _options['Authorization'] = "acs #{KeyId}:#{signature}"
    
    reqOptions.headers = _options

    doRequest.call(this, reqOptions)

  # 创建资源栈
  createStack: (options = {})->
    if options.body
      options.body = JSON.stringify options.body
    else
      options.body = {}
      options.body.Name = options.Name if options.Name?
      options.body.Template = options.Template if options.Template?
      options.body.Parameters = options.Parameters if options.Parameters?
      options.body.DisableRollback = options.DisableRollback if options.DisableRollback?
      options.body.TimeoutMins = options.TimeoutMins if options.TimeoutMins?
      delete options.Name
      delete options.Template
      delete options.Parameters
      delete options.DisableRollback
      delete options.TimeoutMins
      options.body = JSON.stringify options.body
    if options.RegionId?
      options['x-acs-region-id'] = options.RegionId
      delete options.RegionId
    options.uriPattern = '/stacks'
    options.method = 'POST'
    options = _.assign {}, @options, options

    @request options

  # 查询堆栈列表
  getStacks: (options = {})->
    options.uriPattern = '/stacks'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询堆栈信息
  getStack: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询堆栈信息
  putStack: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}'
    options.method = 'PUT'

    if options.body
      options.body = JSON.stringify options.body
    else
      options.body = {}
      options.body.Template = options.Template if options.Template?
      options.body.Parameters = options.Parameters if options.Parameters?
      options.body.DisableRollback = options.DisableRollback if options.DisableRollback?
      options.body.TimeoutMins = options.TimeoutMins if options.TimeoutMins?
      delete options.Template
      delete options.Parameters
      delete options.DisableRollback
      delete options.TimeoutMins
      options.body = JSON.stringify options.body
    if options.RegionId?
      options['x-acs-region-id'] = options.RegionId
      delete options.RegionId
    options =_.assign {}, @options, options
    @request options
  # 删除堆栈
  delStack: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}'
    options.method = 'DELETE'
    options =_.assign {}, @options, options
    @request options
  # 废弃堆栈
  abandonStack: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}/abandon'
    options.method = 'DELETE'
    options =_.assign {}, @options, options
    @request options
  # 预览资源栈
  previewStack: (options = {})->
    options.uriPattern = '/stacks/preview'
    options.method = 'POST'
    if options.body
      options.body = JSON.stringify options.body
    else
      options.body = {}
      options.body.Name = options.Name if options.Name?
      options.body.Template = options.Template if options.Template?
      options.body.Parameters = options.Parameters if options.Parameters?
      options.body.DisableRollback = options.DisableRollback if options.DisableRollback?
      options.body.TimeoutMins = options.TimeoutMins if options.TimeoutMins?
      delete options.Name
      delete options.Template
      delete options.Parameters
      delete options.DisableRollback
      delete options.TimeoutMins
      options.body = JSON.stringify options.body
    if options.RegionId?
      options['x-acs-region-id'] = options.RegionId
      delete options.RegionId

    options =_.assign {}, @options, options
    @request options
  # 查询资源列表
  getResources: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}/resources'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询资源信息
  getResource: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}/resources/{ResourceName}'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询资源类型列表
  getResourceTypes: (options = {})->
    options.uriPattern = '/resource_types'
    if options.SupportStatus?
      options.uriPattern += '?SupportStatus=' + options.SupportStatus
      delete options.SupportStatus
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询资源类型信息
  getResourceType: (options = {})->
    options.uriPattern = '/resource_types/{TypeName}'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询资源类型模板信息
  getResourceTypeTemplate: (options = {})->
    options.uriPattern = '/resource_types/{TypeName}/template'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询模板信息
  getStackTemplate: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}/template'
    options.body = 
      Template : options.Template
    delete options.Template
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 验证模板信息
  validateTemplate: (body)->
    options = {}
    options.uriPattern = '/validate'
    options.method = 'POST'
    options =_.assign {}, @options, options
    if typeof body is 'string'
      try
        body = JSON.parse body
      catch e
        throw new Error '无法解析模板'
    tpl =
      template: body
    options.body = JSON.stringify tpl
    @request options
  # 查询事件列表
  getEvents: (options = {})->
    options.uriPattern = '/stacks/{StackName}/{StackId}/events'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options
  # 查询地域列表
  getRegions: (options = {})->
    options.uriPattern = '/regions'
    options.method = 'GET'
    options =_.assign {}, @options, options
    @request options

exports.Client = Client
