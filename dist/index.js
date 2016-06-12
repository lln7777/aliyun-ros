var Client, Promise, _, config, doRequest, request, roaSigner, uuid;

roaSigner = require('./libs/roa-signer');

request = require('request');

Promise = require('bluebird');

_ = require('lodash');

uuid = require('uuid');

config = {
  protocol: 'http',
  domain: 'ros.aliyuncs.com'
};

doRequest = function(reqOptions, callback) {
  var self;
  self = this;
  if (callback != null) {

  } else {
    return new Promise(function(resolve, reject) {
      request(reqOptions, function(err, res, body) {
        if (err != null) {
          return reject(err);
        } else {
          if ((self.after != null) && (typeof self.after === 'function')) {
            self.after(body);
          }
          return resolve(res);
        }
      });
    });
  }
};


/*
使用原理：
1. 先排序
2. 再签名
 */

Client = (function() {
  Client.prototype.options = {
    "AccessKeyId": '',
    "AccessKeySecret": '',
    "Content-Type": 'application/json;charset=utf-8',
    "Accept": 'application/json',
    "Cache-Control": 'no-cache',
    "Connection": "keep-alive",
    "Pragma": 'no-cache',
    "x-acs-signature-nonce": '',
    "x-acs-signature-method": 'HMAC-SHA1',
    "x-acs-signature-version": '1.0',
    "x-acs-version": '2015-09-01',
    'x-acs-region-id': 'cn-beijing'
  };


  /*
  构建方法
  @params options 应包括基本的Key和Secret
   */

  function Client(options) {
    if (typeof options === 'object') {
      if (options.AccessKeyId && options.AccessKeySecret) {
        _.assign(this.options, options);
      } else {
        throw new Error('请设置AccessKeyId和AccessKeySecret');
      }
    } else {
      throw new Error('实例化参数类型不正确');
    }
  }

  Client.prototype.request = function(options) {
    var KeyId, _options, composeString, ref, reqOptions, signature;
    _options = _.extend({}, this.options, options);
    _options['Date'] = (new Date()).toGMTString();
    _options['x-acs-signature-nonce'] = uuid.v4();
    _options.uri = roaSigner.replaceOccupiedParameters(_options);
    if (_options.body != null) {
      _options['Content-MD5'] = roaSigner.md5base64(_options.body);
    }
    composeString = roaSigner.composeSignString(_options);
    signature = roaSigner.sign(_options.AccessKeySecret, composeString);
    KeyId = _options.AccessKeyId;
    reqOptions = {
      method: (ref = _options.method) != null ? ref : 'GET',
      uri: config.protocol + "://" + config.domain + _options.uri
    };
    if (_options.body != null) {
      reqOptions.body = _options.body;
    }
    delete _options.AccessKeyId;
    delete _options.AccessKeySecret;
    delete _options.body;
    delete _options.method;
    delete _options.uri;
    _options['Authorization'] = "acs " + KeyId + ":" + signature;
    reqOptions.headers = _options;
    console.log(reqOptions, '>>>>>>>>');
    return doRequest.call(this, reqOptions);
  };

  Client.prototype.createStack = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks';
    options.method = 'POST';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getStacks = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks';
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getStack = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks/{StackName}/{StackId}';
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.delStack = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks/{StackName}/{StackId}';
    options.method = 'DELETE';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.abandonStack = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks/{StackName}/{StackId}/abandon';
    options.method = 'DELETE';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getResources = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks/{StackName}/{StackId}/resources';
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getResource = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks/{StackName}/{StackId}/resources/{ResourceName}';
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getResourceTypes = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/resource_types';
    if (options.SupportStatus != null) {
      options.uriPattern += '?SupportStatus=' + options.SupportStatus;
      delete options.SupportStatus;
    }
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getResourceType = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/resource_types/{TypeName}';
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getResourceTypeTemplate = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/resource_types/{TypeName}/template';
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.getStackTemplate = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks/{StackName}/{StackId}/template';
    options.body = {
      Template: options.Template
    };
    delete options.Template;
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  Client.prototype.validateTemplate = function(body) {
    var options;
    options = {};
    options.uriPattern = '/validate';
    options.method = 'POST';
    _.assign(options, this.options, options);
    options.body = body;
    return this.request(options);
  };

  Client.prototype.getEvents = function(options) {
    if (options == null) {
      options = {};
    }
    options.uriPattern = '/stacks/{StackName}/{StackId}/events';
    options.method = 'GET';
    _.assign(options, this.options, options);
    return this.request(options);
  };

  return Client;

})();

exports.Client = Client;
