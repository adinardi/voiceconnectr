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
    goog.style.setSize(this.mainElem, 320, 15);
    // this.mainElem.style.overflow = 'hidden';
        
    goog.events.listen(document.body, 'touchstart', this.handleTouchStart, undefined, this);
    goog.events.listen(document.body, 'touchmove', this.handleTouchMove, undefined, this);
    window.scrollTo(0,1);

    var refreshBtn = goog.dom.createDom('div');
    this.refreshButton = refreshBtn;
    goog.style.setSize(refreshBtn, 100, 20);
    goog.dom.setTextContent(refreshBtn, 'Refresh');
    refreshBtn.style.backgroundColor = 'green';
    goog.events.listen(refreshBtn, 'click', this.handleRefreshBtnClick, undefined, this);
    
    goog.dom.appendChild(this.mainElem, refreshBtn);
    goog.dom.appendChild(document.body, this.mainElem);
    
    this.contentElem = goog.dom.createDom('div');
    goog.style.setSize(this.contentElem, 320, 465);
    this.contentElem.style.overflow = 'hidden';
    this.contentElem.style.clear = 'both';
    
    goog.dom.appendChild(document.body, this.contentElem);
    
    thetr.connectr.Base.DATA_LOADER = new thetr.connectr.dataLoader();
    
    this.smsUI = new thetr.connectr.ui.sms.Main(this);
    goog.dom.appendChild(this.contentElem, this.smsUI.getRootNode());
    
    setTimeout(function() {
        thetr.connectr.Base.DATA_LOADER.updateRecentSMS();
    }, 100);
};

thetr.connectr.Base.prototype.showRefreshButton = function(show) {
    // goog.style.showElement(this.refreshButton, show);
    if (show) {
        goog.dom.removeChildren(this.mainElem);
        goog.dom.appendChild(this.mainElem, this.refreshButton);
    } else {
        goog.dom.removeChildren(this.mainElem);
    }
};

thetr.connectr.Base.prototype.setTopBar = function(content) {
    this.showRefreshButton(false);
    goog.dom.appendChild(this.mainElem, content);
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
    this.contentElem.scrollTop = this.contentElem.scrollTop - (curY - this.touchStartY);
    this.touchStartY = curY;
};

thetr.connectr.Base.prototype.scrollTo = function(pos) {
    this.contentElem.scrollTop = pos;
};