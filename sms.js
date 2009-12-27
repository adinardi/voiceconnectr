goog.require('goog.events');

goog.provide('thetr.connectr.ui.sms.Main');

thetr.connectr.ui.sms.Main = function() {
    this.baseElem = goog.dom.createDom('div');
    goog.events.listen(thetr.connectr.Base.DATA_LOADER, 'smsupdate', this.updateUI, undefined, this);
};

thetr.connectr.ui.sms.Main.prototype.getRootNode = function() {
    return this.baseElem;
};

thetr.connectr.ui.sms.Main.prototype.updateUI = function(e) {
    // console.log(e);
    var conversations = e.data.messages;
    var smsElem = goog.dom.createDom('div');
    for (var conversationID in conversations) {
        var convoElem = goog.dom.createDom('div');
        convoElem.style.marginBottom = '5px';
        convoElem.style.border = '1px solid blue';
        
        for (var messageNum in conversations[conversationID].messages) {
            var msg = conversations[conversationID].messages[messageNum];

            var msgContainer = goog.dom.createDom('div');
            var textContainer = goog.dom.createDom('span');
            goog.dom.setTextContent(textContainer, msg.text);
            
            var fromContainer = goog.dom.createDom('span');
            goog.dom.setTextContent(fromContainer, msg.from);
            
            var timeContainer = goog.dom.createDom('span');
            goog.dom.setTextContent(timeContainer, msg.time);
            
            goog.dom.appendChild(msgContainer, fromContainer);
            goog.dom.appendChild(msgContainer, textContainer);
            goog.dom.appendChild(msgContainer, timeContainer);
            goog.dom.appendChild(convoElem, msgContainer);
        }
        goog.dom.appendChild(smsElem, convoElem);
    }
    
    goog.dom.removeChildren(this.baseElem);
    goog.dom.appendChild(this.baseElem, smsElem);
};