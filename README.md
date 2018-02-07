# WeChatChromePlugin
微信自动回复谷歌插件

## 内部变量
* window._contacts 保存了通讯录
    1. 使用isSelf() 函数, 确定是否是自己
    2. 使用isRoomContact()函数, 确定是否是群聊
    3. 使用getDisplayName()获取当前设置的备注名称
    4. 使用NickName获取当前对方设置的昵称
    5. 使用Signature获取签名
* window._chatContent 保存了已有的对话列表中的对话记录
    1. MsgType: 1时表示是文字信息, MsgType: 10000表示是通知信息
    2. MMDisplayTime 表示发送的时间戳
    3. FromUserName 为selfId 的时候, 表示是自己发出的信息, 发出到哪个会话则看ToUserName
    4. FromUserName 不为selfId 的时候, 表示是在哪个会话发出的信息, 此时ToUserName必然是selfId
    5. MMActualSender表示在群聊中是谁发出的信息
    6. MMDigest表示简要, 包括发送人名字及部分信息, 如果是图片, 则会显示为'[图片]'
    7. MMActualContent表示信息内容(不包含发送人名字), 而Content会包含发送人id+信息内容(如果是自己发送的则没有发送人id)

* window._chatRoomMemberDisplayNames 保存了群聊的成员, 只包含当前的群聊

* window._strangerContacts 保存了跟自己在群聊中的陌生人的信息


### 内部实现
1. 首先通过重写_chatContent中会话记录的push方法, 使得可以实时监听到新消息, 而所有的新消息接收/发送都交给微信原有js实现, 实现中只监听变量的变化
2. 当得到对应的新消息后, 根据对应规则去发送消息
3. 发送信息的方法为:使用js模拟切换到对应的会话框后, 输入信息, 点击发送按钮(切换对话框只能选中当前展示出来的对话框, 滚动条未拉到的位置无法选中)

### 对话列表
所有的会话信息都存放在$("div#J_NavChatScrollBody")下, 其中, 单个会话信息存放在`$("div.chat_item[data-username='" + userid + "']")`内

当收到未读信息时, 得到一个`<i class="icon web_wechat_reddot_middle ng-binding ng-scope" ng-class="{web_wechat_reddot_middle: chatContact.NoticeCount < 99, web_wechat_reddot_bbig: chatContact.NoticeCount >=99}" ng-if="chatContact.NoticeCount &amp;&amp; !chatContact.isMuted()">2</i>`
`<span ng-if="chatContact.NoticeCount>1 &amp;&amp; chatContact.isMuted()" class="ng-binding ng-scope">[6条]</span>`的状态

发送信息时, 使用`$("pre#editArea").html("测试")`输入回复文字, 并且使用`$("a.btn_send.btn").click()`发送回复

### 如何扩展该插件
1. 修改重写`js/customInject.js`中的`customCallback`函数, 添加自定义的回复数据即可


### 发送消息的js示例
```
$("div [data-username='@9092f8b6dc28fcd948d0858c8c302cbd7821cb849bf95f29ced28006d0903b00']").click() //选中指定对话
$("pre#editArea").html("测试") //输入回复文字
//由于web微信的内部函数检测机制, 在输入回复文字后直接进行发送不会生效, 所以必须先切换一下会话, 再发送
$("div.chat_item[data-username='@9092f8b6dc28fcd948d0858c8c302cbd7821cb849bf95f29ced28006d0903b00']").parent().next().children().click()
$("div [data-username@9092f8b6dc28fcd948d0858c8c302cbd7821cb849bf95f29ced28006d0903b00']").click()
$("a.btn_send.btn").click() //发送回复
```




### <span color='red'>如何重写方法 </span>
```
var list = []
list._push = list.push
list.push = function (){
    if(arguments[0] != undefined && arguments[0].MsgType == 1){
        console.log(arguments[0])
    }
    list._push.apply(list, Array.prototype.slice.apply(arguments))
}

var l = []
Array._push = Array.prototype.push
Array.prototype.push = function (){
    if(
    console.log('inject before')
    Array._push.apply(this, Array.prototype.slice.apply(arguments))
    console.log('inject after')
    }
}
l.push("aaa")
```