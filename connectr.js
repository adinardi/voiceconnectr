goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.events');
goog.require('thetr.connectr.ui.sms.Main');
goog.require('thetr.connectr.dataLoader');

goog.provide('thetr.connectr.Base');

thetr.connectr.load = function() {
    var base = new thetr.connectr.Base();
    base.init();
    thetr.base = base;
};

thetr.connectr.Base = function() {
    this.smsUI = null;
};

thetr.connectr.Base.DATA_LOADER = null;

thetr.connectr.Base.prototype.init = function() {
    this.mainElem = goog.dom.createDom('div');
    goog.style.setSize(this.mainElem, 320, 480);
    this.mainElem.style.overflow = 'hidden';
        
    goog.events.listen(this.mainElem, 'touchstart', this.handleTouchStart, undefined, this);
    goog.events.listen(this.mainElem, 'touchmove', this.handleTouchMove, undefined, this);
    window.scrollTo(0,1);

    var refreshBtn = goog.dom.createDom('div');
    goog.style.setSize(refreshBtn, 100, 20);
    goog.dom.setTextContent(refreshBtn, 'Refresh 3');
    refreshBtn.style.backgroundColor = 'green';
    goog.events.listen(refreshBtn, 'click', this.handleRefreshBtnClick, undefined, this);
    
    goog.dom.appendChild(this.mainElem, refreshBtn);
    goog.dom.appendChild(document.body, this.mainElem);
    
    thetr.connectr.Base.DATA_LOADER = new thetr.connectr.dataLoader();
    
    this.smsUI = new thetr.connectr.ui.sms.Main();
    goog.dom.appendChild(this.mainElem, this.smsUI.getRootNode());
};

thetr.connectr.Base.prototype.handleRefreshBtnClick = function(e) {
    thetr.connectr.Base.DATA_LOADER.updateRecentSMS();
};

thetr.connectr.Base.prototype.handleTouchStart = function(e) {
    this.touchStartY = e.getBrowserEvent().targetTouches[0].pageY;
};

thetr.connectr.Base.prototype.handleTouchMove = function(e) {
    e.preventDefault();
    var curY = e.getBrowserEvent().targetTouches[0].pageY;
    this.mainElem.scrollTop = this.mainElem.scrollTop - (curY - this.touchStartY);
    this.touchStartY = curY;
};