goog.require('goog.net.XhrIo');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.net.EventType');

goog.provide('thetr.connectr.dataLoader');

thetr.connectr.dataLoader = function() {
    goog.events.EventTarget.call(this);
};
goog.inherits(thetr.connectr.dataLoader, goog.events.EventTarget);

thetr.connectr.dataLoader.prototype.updateRecentSMS = function() {
    var xhr = new goog.net.XhrIo();

    goog.events.listen(xhr, goog.net.EventType.COMPLETE, this.handleRecentSMS, undefined, this);
    
    xhr.send('processor.php?data=recentSMS');
};

thetr.connectr.dataLoader.prototype.handleRecentSMS = function(e) {
    // console.log(e);
    // console.log(e.target.getResponseJson().SMS.data.messages['6cd379ccdd58bfa8c468c71bfe57f4ca53758b40'].messages[2].text)
    
    var data = e.target.getResponseJson().SMS.data;
    this.dispatchEvent({type: 'smsupdate', data: data});
};
