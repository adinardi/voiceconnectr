goog.require('goog.dom');
goog.require('goog.style');
goog.require('thetr.connectr.ui.sms.Main');
goog.require('thetr.connectr.dataLoader');

goog.provide('thetr.connectr.Base');

thetr.connectr.load = function() {
    var base = new thetr.connectr.Base();
    base.init();
};

thetr.connectr.Base = function() {
    this.smsUI = null;
};

thetr.connectr.Base.DATA_LOADER = null;

thetr.connectr.Base.prototype.init = function() {
    var mainElem = goog.dom.createDom('div');
    var refreshBtn = goog.dom.createDom('div');
    goog.style.setSize(refreshBtn, 100, 20);
    goog.dom.setTextContent(refreshBtn, 'Refresh');
    refreshBtn.style.backgroundColor = 'green';
    goog.events.listen(refreshBtn, 'click', this.handleRefreshBtnClick, undefined, this);
    
    goog.dom.appendChild(mainElem, refreshBtn);
    goog.dom.appendChild(document.body, mainElem);
    
    thetr.connectr.Base.DATA_LOADER = new thetr.connectr.dataLoader();
    
    this.smsUI = new thetr.connectr.ui.sms.Main();
    goog.dom.appendChild(mainElem, this.smsUI.getRootNode());
};

thetr.connectr.Base.prototype.handleRefreshBtnClick = function(e) {
    thetr.connectr.Base.DATA_LOADER.updateRecentSMS();
};