let lenofContent = 0;
let selfId = function () {
    for(let id in _contacts){
        console.log(_contacts[id]);
        if(_contacts[id].isSelf()){
            return id;
        }
    }
}(); //获取自己的id


function sendMessage(userid, text){
    let chat_item = $("div.chat_item[data-username='" + userid + "']")[0];
    chat_item.click()  //选中指定对话
    $("pre#editArea")[0].innerHTML = text //输入回复文字
//由于web微信的内部函数检测机制, 在输入回复文字后直接进行发送不会生效, 所以必须先切换一下会话, 再发送
    chat_item.parentNode.nextElementSibling.firstElementChild.click() //选中下一个对话
    chat_item.click() //换回当前对话
    $("a.btn_send.btn")[0].click() //发送回复
}
window.sendMessage = sendMessage

function checkNewContent() {
    let len = Object.keys(_chatContent).length;
    if(lenofContent < len ){
        for(let content in _chatContent){
            let list = _chatContent[content]
            if(list._push == undefined){
                list._push = list.push;
                list.push = function (){
                    list._push.apply(list, Array.prototype.slice.apply(arguments))
                    if(arguments[0] != undefined && arguments[0].MsgType == 1 && arguments[0].FromUserName != selfId){
                        customCallback(arguments[0]); //调用自定义函数处理获取到的消息
                    }
                }
            }
        }
    }
    lenofContent = len;
}



setInterval(checkNewContent, 3000); //每3秒检查一次是否有新的会话