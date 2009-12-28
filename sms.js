goog.require('goog.events');
goog.require('goog.dom.classes');

goog.provide('thetr.connectr.ui.sms.Main');

thetr.connectr.ui.sms.Main = function() {
    this.baseElem = goog.dom.createDom('div');
    goog.dom.classes.add(this.baseElem, 'scrollable-content');
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
        var convoElem = goog.dom.createDom('div', 'sms-conversation');
        
        var contactNameElem = goog.dom.createDom('div', 'sms-conversation-contact');
        goog.dom.setTextContent(contactNameElem, conversations[conversationID].contactName);
        goog.dom.appendChild(convoElem, contactNameElem);
        
        for (var messageNum in conversations[conversationID].messages) {
            var msg = conversations[conversationID].messages[messageNum];

            var msgContainer = goog.dom.createDom('div');
            
            // var fromContainer = goog.dom.createDom('span', 'sms-from');
            // goog.dom.setTextContent(fromContainer, msg.from);
            
            var timeContainer = goog.dom.createDom('span', 'sms-time');
            goog.dom.setTextContent(timeContainer, msg.time);

            var className = 'sms-text';
            if (msg.from == 'Me:') {
                className += ' sms-from-me';
            } else {
                className += ' sms-to-me';
            }
            var textContainer = goog.dom.createDom('div', className);
            goog.dom.setTextContent(textContainer, msg.text);
            
            // goog.dom.appendChild(msgContainer, fromContainer);
            goog.dom.appendChild(msgContainer, timeContainer);
            goog.dom.appendChild(msgContainer, textContainer);
            goog.dom.appendChild(convoElem, msgContainer);
        }
        goog.dom.appendChild(smsElem, convoElem);
    }
    
    goog.dom.removeChildren(this.baseElem);
    goog.dom.appendChild(this.baseElem, smsElem);
};

thetr.connectr.ui.sms.Main.prototype.showSMSEntry = function() {
    var entryElem = goog.dom.createDom('div');
    var inputElem = goog.dom.createDom('textarea');
    
    
};