var s = function(){
  var _j = NEJ.P('nej.j');
  console.log(arguments)
  var _eventdispatcher = arguments[3];
  var p = {};
  console.log(_eventdispatcher);
  /*
    task 结构
    {
      id: number,
      content: string,
      state: active|complete
    }
  */
  var _tasks       = [];
  var _engineCycle = 500;
  /*

  */
  var _PENDING = 2;
  var _IDLE    = 1;

  var _engine_state = _IDLE;
  var _engineOB = null;

  function _addTask(_task){
    console.log(_task);
    if(_engine_state === _IDLE){
      _tasks.push(_task);
    }else{
      _holdon = _addTask.bind(null, _task);
      _holdon.removed = true;
      _engineOB.addEventListener('ok', _holdon);
    }
  }

  function _engine() {
    if(_tasks.length > 0){
      var _json =JSON.stringify(_tasks)
      console.log(_json);
      // send to server
      _j._$request('/crud',{
        sync: false,
        type: 'json',
        data: _json,
        method: 'post',
        timeout: 3000,
        mode:0||1||2||3,
        onload:function(_data){
          _engineOB.dispatchEvent('ok');
          _engine_state = _IDLE;
          _tasks = [];
        },
        onerror:function(_error){
          // 操作回滚，加入下一轮新请求  

        },
        onbeforerequest:function(_data){
          _engine_state = _PENDING;
        }
      });
    }
    setTimeout(_engine, _engineCycle);
  }
  _engineOB = new _eventdispatcher();
  console.log(_engineOB);

  function _startEngine(options){
    _engineCycle = (options && options._engineCycle) || _engineCycle;
    _engine();
  }

  p.addTask = _addTask;
  p.startEngine = _startEngine;

  function _initialize(_loaded, _err){
    _j._$request('/r',{
      sync: false,
      type: 'json',
      data: 'find',
      method: 'post',
      timeout: 3000,
      mode:0||1||2||3,
      onload: _loaded,
      onerror: _err,
    });
  }
  p.initialize = _initialize
  /*p.default = {
    completeTask: function(task){
      return Object.assign()
    }
  }*/
  return p;
};
NEJ.define([
  '{lib}base/constant.js',
  '{lib}base/util.js',
  '{lib}util/ajax/xdr.js',
  './event.js'
  ], s);
