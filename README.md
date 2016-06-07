# 方法

* ros.createStack
* ros.getStacks
* ros.getStack
* ros.delStack
* ros.abandonStack
* ros.getResources
* ros.getResource
* ros.getResourceTypes
* ros.getResourceType
* ros.getResourceTypeTemplate
* ros.getStackTemplate 
* ros.validateTemplate 
* ros.getEvents

# 用法

ros.getStack(options, data);

# 用法

```javascript
var AliRos, _options, aliRos, options;

AliRos = require('../src/');

options = {
  AccessKeyId: '<AccessKeyId>',
  AccessKeySecret: '<AccessKeySecret>'
};

aliRos = new AliRos.Client(options);

_options = {
  SupportStatus: 'UNKNOWN'
};

aliRos.getResourceTypes(_options).then(function(res) {
  return console.log(res.headers, res.body);
})["catch"](function(err) {
  return console.log(err);
});

```