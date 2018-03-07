# API 接口对照表
![API 接口对照表](https://help.aliyun.com/document_detail/28899.html)

# 方法

* ros.createStack 创建资源栈
* ros.getStacks   查询资源栈列表
* ros.getStack    查询资源栈信息
* ros.putStack    更新资源栈
* ros.delStack    删除资源栈
* ros.abandonStack 废弃资源栈
* ros.previewStack 预览资源栈
* ros.getResources
* ros.getResource
* ros.getResourceTypes
* ros.getResourceType
* ros.getResourceTypeTemplate
* ros.getStackTemplate 
* ros.validateTemplate 
* ros.getEvents   查询事件列表
* ros.getRegions  查询地域列表

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