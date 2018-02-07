
function customCallback( content ) {
    //do something

    //if(_contacts[content.FromUserName].getDisplayName() == "华为煞笔们"){
        //console.log(content);
        //window.content = content;
        window.sendMessage(content.FromUserName, "收到信息来自: "+getRoomDisplayName(content)+", 内容为: "+ content.MMActualContent);


    //}
}

//获取群聊内昵称
function getRoomDisplayName(content) {
    if(_strangerContacts[content.MMActualSender] != undefined){
        return _strangerContacts[content.MMActualSender].getDisplayName();
    } else {
        return _contacts[content.MMActualSender].getDisplayName()
    }
}