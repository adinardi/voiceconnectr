goog.require('goog.events');
goog.require('goog.dom.classes');

goog.provide('thetr.connectr.ui.sms.Main');

thetr.connectr.ui.sms.Main = function() {
    this.dataCache = null;
    
    this.baseElem = goog.dom.createDom('div');
    goog.dom.classes.add(this.baseElem, 'scrollable-content');
    goog.events.listen(thetr.connectr.Base.DATA_LOADER, 'smsupdate', this.handleDataRefresh, undefined, this);
};

thetr.connectr.ui.sms.Main.prototype.getRootNode = function() {
    return this.baseElem;
};

thetr.connectr.ui.sms.Main.prototype.handleDataRefresh = function(e) {
    this.dataCache = e.data.messages;
    
    this.updateUI();
};

thetr.connectr.ui.sms.Main.prototype.updateUI = function() {
    // console.log(e);
    var conversations = this.dataCache;
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
        
        var fakeEntryElem = goog.dom.createDom('div', 'sms-reply-btn');
        fakeEntryElem.phoneNumber = conversations[conversationID].phoneNumber;
        goog.dom.setTextContent(fakeEntryElem, 'Reply');
        goog.events.listen(fakeEntryElem, 'click', this.handleEntryTouch, undefined, this);
        
        var fakeEntryContainerElem = goog.dom.createDom('div');
        goog.dom.appendChild(fakeEntryContainerElem, fakeEntryElem);
        goog.dom.appendChild(convoElem, fakeEntryContainerElem);
        
        goog.dom.appendChild(smsElem, convoElem);
    }
    
    goog.dom.removeChildren(this.baseElem);
    goog.dom.appendChild(this.baseElem, smsElem);
    window.scrollTo(0,1);
};

thetr.connectr.ui.sms.Main.prototype.handleEntryTouch = function(e) {
    // alert('sms to ' + e.target.phoneNumber);
    this.showSMSEntry(e.target.phoneNumber);
    
    return false;
};

thetr.connectr.ui.sms.Main.prototype.showSMSEntry = function(phoneNumber) {
    var entryElem = goog.dom.createDom('div');
    //     var removeOpacity = goog.dom.createDom('div', 'sms-entry-no-opacity');
    //     var inputElem = goog.dom.createDom('textarea');
    //     var sendElem = goog.dom.createDom('div', 'sms-send-btn');
    //     goog.dom.setTextContent(sendElem, 'Send Message');
    //     
    //     goog.dom.appendChild(entryElem, removeOpacity);
    //     goog.dom.appendChild(removeOpacity, inputElem);
    //     goog.dom.appendChild(removeOpacity, sendElem);
    //     
    //     goog.dom.appendChild(document.body, entryElem);
    //     inputElem.focus();
    // var d = new goog.ui.Dialog();
    // d.setTitle('Send SMS');
    // d.setModal(true);
    // var ce = d.getContentElement();
    // 
    
    var backBtn = goog.dom.createDom('div', 'back-btn');
    goog.events.listen(backBtn, 'click', this.handleBackFromEntry, undefined, this);
    goog.dom.setTextContent(backBtn, '< Back');
    
    var inputElem = goog.dom.createDom('textarea');
    var sendElem = goog.dom.createDom('div', 'sms-send-btn');
    sendElem.phoneNumber = phoneNumber;
    goog.events.listen(sendElem, 'click', this.handleSendSMSClick, undefined, this);
    this.smsInputElem = inputElem;
    goog.dom.setTextContent(sendElem, 'Send Message');
    // 
    goog.dom.appendChild(entryElem, backBtn);
    goog.dom.appendChild(entryElem, inputElem);
    goog.dom.appendChild(entryElem, sendElem);
    // 
    // d.setVisible(true);
    
    goog.dom.removeChildren(this.baseElem);
    goog.dom.appendChild(this.baseElem, entryElem);
    inputElem.focus();
    window.scrollTo(0,1);
};

thetr.connectr.ui.sms.Main.prototype.handleSendSMSClick = function(e) {
    var smsText = this.smsInputElem.value;
    
    var xhr = new goog.net.XhrIo();

    goog.events.listen(xhr, goog.net.EventType.COMPLETE, this.handleSMSSent, undefined, this);
    
    xhr.send('processor.php?data=sendSMS', 'POST', 'number=' + encodeURIComponent(e.target.phoneNumber) + '&text=' + encodeURIComponent(this.smsInputElem.value));
};

thetr.connectr.ui.sms.Main.prototype.handleSMSSent = function(e) {
    this.updateUI();
    thetr.connectr.Base.DATA_LOADER.updateRecentSMS();
};

thetr.connectr.ui.sms.Main.prototype.handleBackFromEntry = function(e) {
    this.updateUI();
};

