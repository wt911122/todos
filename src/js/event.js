var e = function(){
 /* function Event(type){
    this.type = type;
    this.removed = false;
  }
  Event.prototype.remove = function(){this.removed = true;} // 监听一次就删*/

  function EventDispatcher(){
    this._listeners = null;

  }
  var _p = EventDispatcher.prototype;
  _p.addEventListener = function(type, listener){
    var _listeners = this._listeners = this._listeners||{};
    var arr = _listeners[type];
    if (arr) {
      this.removeEventListener(type, listener);
    }
    if (!arr) { 
      _listeners[type] = [listener];
    }else { 
      arr.push(listener);
    }
    return listener;
  }
  _p.removeEventListener = function(type, listener){
    var _listeners = this._listeners;
    if (!_listeners) { return; }
    var arr = _listeners[type];
    if (!arr) { return; }
    for (var i=0,l=arr.length; i<l; i++) {
      if (arr[i] == listener) {
        if (l==1) { delete(_listeners[type]); }
        else { arr.splice(i,1); }
        break;
      }
    }
  }
  _p.dispatchEvent = function(eventObj){
    if (typeof eventObj == "string") {
      var listeners = this._listeners;
      if(!listeners || !listeners[eventObj]) return true;
      this._dispatchEvent(eventObj);
    }
  }
  _p._dispatchEvent = function(eventObj){
    var l,
        listeners = this._listeners;
    if (eventObj && listeners) {
      var arr = listeners[eventObj];
      if (!arr||!(l=arr.length)) { return; }
      arr = arr.slice(); //避免在事件通知时改变dispatch
      for(var i=0; i<l; i++){
        var o = arr[i];
        if (o.handleEvent) {
          o.handleEvent(eventObj); 
        }else { 
          o(eventObj); 
        }

        if (o.removed) {
          this.removeEventListener(eventObj, o);
        }
      }

    }
  }

  return EventDispatcher;
}
NEJ.define([], e);