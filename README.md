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

```coffeescript
AliRos = require '../src/'

options = 
  AccessKeyId: 'xxxxx'
  AccessKeySecret: 'xxxxxxxxxxxxxx'

aliRos = new AliRos.Client options

_options = 
  SupportStatus: 'UNKNOWN'
aliRos.getResourceTypes _options
.then (res)->
  console.log res.headers, res.body
.catch (err)->
  console.log err
```