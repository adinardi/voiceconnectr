goog.require('goog.events');
goog.require('goog.dom.classes');

goog.provide('thetr.connectr.ui.sms.Main');

thetr.connectr.ui.sms.Main = function(baseController) {
    this.dataCache = null;
    this.baseController = baseController;
    this.baseElem = goog.dom.createDom('div');
    goog.dom.classes.add(this.baseElem, 'scrollable-content');
    goog.events.listen(thetr.connectr.Base.DATA_LOADER, 'smsupdate', this.handleDataRefresh, undefined, this);
};

thetr.connectr.ui.sms.Main.prototype.getRootNode = function() {
    return this.baseElem;
};

thetr.connectr.ui.sms.Main.prototype.handleDataRefresh = function(e) {
    // this.dataCache = e.data.messages;
    this.dataCache = e.data.messagesByNumber;
    
    this.updateUI();
};

thetr.connectr.ui.sms.Main.prototype.updateUI = function() {
    var messagesByNumber = this.dataCache;

    var smsListElem = goog.dom.createDom('div');    
    for (var number in messagesByNumber) {
        var meta = messagesByNumber[number]['meta'];

        var nameElem = goog.dom.createDom('div', 'sms-contact-list-item');
        goog.dom.setTextContent(nameElem, meta.contactName);
        goog.dom.appendChild(smsListElem, nameElem);
        nameElem.phoneNumber = number;
        goog.events.listen(nameElem, 'click', this.handleContactClick, undefined, this);
    }
    
    this.baseController.showRefreshButton(true);
    goog.dom.removeChildren(this.baseElem);
    goog.dom.appendChild(this.baseElem, smsListElem);
    window.scrollTo(0,1);
};

thetr.connectr.ui.sms.Main.prototype.handleContactClick = function(e) {
    this.renderConversationUI(e.target.phoneNumber);
};

thetr.connectr.ui.sms.Main.prototype.renderConversationUI = function(number) {
    var messagesByNumber = this.dataCache;
    
    var conversation = messagesByNumber[number]['messages'];
    var meta = messagesByNumber[number]['meta'];
    
    var smsElem = goog.dom.createDom('div');
    
    // for (var conversationID in conversations) {
        var convoElem = goog.dom.createDom('div', 'sms-conversation');
        
        var contactNameElem = goog.dom.createDom('div', 'sms-conversation-contact');
        goog.dom.setTextContent(contactNameElem, meta.contactName);
        goog.dom.appendChild(convoElem, contactNameElem);
        
        // for (var miter = conversation.length - 1; miter >= 0; miter--) {
        var miterMax = conversation.length;
        for (var miter = 0; miter < miterMax; miter++) {
            var msg = conversation[miter];

            var msgContainer = goog.dom.createDom('div');
            
            // var fromContainer = goog.dom.createDom('span', 'sms-from');
            // goog.dom.setTextContent(fromContainer, msg.from);
            
            var timeContainer = goog.dom.createDom('span', 'sms-time');
            goog.dom.setTextContent(timeContainer, msg.time);

            var className = 'sms-text';
            if (msg.from == 'Me:') {
                className += ' sms-from-me';
            } else if (msg.from == 'TIME_CHANGE') {
                className += ' sms-time-change';
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
        fakeEntryElem.phoneNumber = number;
        fakeEntryElem.contactName = meta.contactName;
        goog.dom.setTextContent(fakeEntryElem, 'Reply');
        goog.events.listen(fakeEntryElem, 'click', this.handleEntryTouch, undefined, this);
        
        var fakeEntryContainerElem = goog.dom.createDom('div');
        goog.dom.appendChild(fakeEntryContainerElem, fakeEntryElem);
        goog.dom.appendChild(convoElem, fakeEntryContainerElem);
        
        goog.dom.appendChild(smsElem, convoElem);
    // }
    
    var topElem = goog.dom.createDom('div');
    var backElem = goog.dom.createDom('div', 'top-btn');
    goog.dom.setTextContent(backElem, '< Back');
    goog.dom.appendChild(topElem, backElem);
    var replyElem = goog.dom.createDom('div', 'top-btn');
    goog.dom.setTextContent(replyElem, 'Reply >');
    replyElem.phoneNumber = number;
    replyElem.contactName = meta.contactName;
    goog.dom.appendChild(topElem, replyElem);
    
    this.baseController.setTopBar(topElem);
    goog.events.listen(backElem, 'click', this.handleBackFromContactClick, undefined, this);
    goog.events.listen(replyElem, 'click', this.handleEntryTouch, undefined, this);
    
    // this.baseController.showRefreshButton(false);
    goog.dom.removeChildren(this.baseElem);
    goog.dom.appendChild(this.baseElem, smsElem);
    window.scrollTo(0,1);
    this.baseController.scrollTo(999999);
};

thetr.connectr.ui.sms.Main.prototype.handleBackFromContactClick = function(e) {
    this.updateUI();
};

thetr.connectr.ui.sms.Main.prototype.handleEntryTouch = function(e) {
    this.showSMSEntry(e.target.phoneNumber, e.target.contactName);
    
    return false;
};

thetr.connectr.ui.sms.Main.prototype.showSMSEntry = function(phoneNumber, contactName) {
    var entryElem = goog.dom.createDom('div');

    var numberElem = goog.dom.createDom('div', 'sms-phone-number');
    var displayNumber = this.dataCache[phoneNumber].meta.displayNumber;
    goog.dom.setTextContent(numberElem, contactName + ' [' + displayNumber + ']');
    
    var inputElem = goog.dom.createDom('textarea', {'rows': '9', 'cols': '40'});
    var sendBtnWrapper = goog.dom.createDom('div', 'btn-wrapper');
    var sendElem = goog.dom.createDom('span', 'sms-send-btn');
    sendElem.phoneNumber = phoneNumber;
    goog.events.listen(sendElem, 'click', this.handleSendSMSClick, undefined, this);
    this.smsInputElem = inputElem;
    goog.dom.setTextContent(sendElem, 'Send Message');
    goog.dom.appendChild(sendBtnWrapper, sendElem);

    goog.dom.appendChild(entryElem, numberElem);
    goog.dom.appendChild(entryElem, inputElem);
    goog.dom.appendChild(entryElem, sendBtnWrapper);

    var backElem = goog.dom.createDom('div', 'top-btn');
    backElem.phoneNumber = phoneNumber;
    goog.dom.setTextContent(backElem, '< Back');
    goog.events.listen(backElem, 'click', this.handleBackFromEntry, undefined, this);
    
    this.baseController.setTopBar(backElem);

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
    this.renderConversationUI(e.target.phoneNumber);
};

