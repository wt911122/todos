if (typeof I$==="undefined"){I$=(function() {
    var o = {},
        f = function() {return !1;},
        cache = {};
    var is = function(data,type){
        return o.toString.call(data)==='[object '+type+']';
    };
    return function(key,func) {
        var result = cache[key],
            isfunc = is(func,'Function');
        // func is data
        if (func!=null&&!isfunc){
            result = func;
        }
        // do function defined
        if (isfunc){
            var arr = [];
            for(var i=2,l=arguments.length;i<l;i++){
                arr.push(arguments.callee(arguments[i]));
            }
            var exports = {};
            arr.push.call(arr,exports,{},f,[]);
            var ret = func.apply(null,arr)||exports;
            if (!result||!is(ret,'Object')){
                // for non-object return
                result = ret;
            }else{
                // for namespace return
                // bad performance for-in in v8 for instance
                if (!!Object.keys){
                    for(var ls=Object.keys(ret),i=0,l=ls.length,x;i<l;i++){
                        x = ls[i];
                        result[x] = ret[x];
                    }
                }else{
                    for(var x in ret){
                        result[x] = ret[x];
                    }
                }
            }
        }
        // init data
        if (result==null){
            result = {};
        }
        cache[key] = result;
        // return
        return result;
    };
})();;}
cant read file /Users/TonyWang/netease/homework/lib/nej-framework/src/base/global.js for utf-8, cause:
{"errno":-2,"code":"ENOENT","syscall":"open","path":"/Users/TonyWang/netease/homework/lib/nej-framework/src/base/global.js"}
cant read file /Users/TonyWang/netease/homework/lib/nej-framework/src/base/event.js for utf-8, cause:
{"errno":-2,"code":"ENOENT","syscall":"open","path":"/Users/TonyWang/netease/homework/lib/nej-framework/src/base/event.js"}
cant read file /Users/TonyWang/netease/homework/lib/nej-framework/src/util/template/jst.js for utf-8, cause:
{"errno":-2,"code":"ENOENT","syscall":"open","path":"/Users/TonyWang/netease/homework/lib/nej-framework/src/util/template/jst.js"}
cant read file /Users/TonyWang/netease/homework/lib/nej-framework/src/util/query/nes.js for utf-8, cause:
{"errno":-2,"code":"ENOENT","syscall":"open","path":"/Users/TonyWang/netease/homework/lib/nej-framework/src/util/query/nes.js"}
cant read file /Users/TonyWang/netease/homework/lib/nej-framework/src/util/query/query.js for utf-8, cause:
{"errno":-2,"code":"ENOENT","syscall":"open","path":"/Users/TonyWang/netease/homework/lib/nej-framework/src/util/query/query.js"}
I$('11ef1e5af6b3b0cf6d4cbe0ba3f60c9b',function (){
      var _ = NEJ.P,
          _e = _('nej.e'),
          _v = _('nej.v'),
          _j = _('nej.j'),
          _u = _('nej.u'),
          _p = _('nej.ut');
      // 获取节点
      var _parent = _e._$get('todos');
      var _new_todo_el = _e._$getByClassName(_parent, "new-todo")[0];
      var _todo_list_el = _e._$getByClassName(_parent, "todo-list")[0];
      var _toggle_all_el = _e._$getByClassName(_parent, "toggle-all")[0];
      var _todo_count_el = _e._$one("footer > span > strong", _parent);
      var _clear_completed_el = _e._$one("footer > button.clear-completed", _parent);
      var _main_el = _e._$one(".main", _parent);
      var _footer_el = _e._$one(".footer", _parent);
      var _all_el = _e._$one(".filters > li:nth-child(1) > a", _parent);
      var _active_el = _e._$one(".filters > li:nth-child(2) > a", _parent);
      var _complete_el = _e._$one(".filters > li:nth-child(3) > a", _parent);
      // todo模板
      var _todo_seed =  _e._$addHtmlTemplate('\
        <li class="">\
          <div class="view">\
            <input class="toggle" type="checkbox" />\
            <label>${name}</label>\
            <button class="destroy"></button>\
          </div>\
          <input class="edit" value="${name}">\
        </li>');
      // todo状态
      var _ACTIVE = 1;
      var _COMPLETE = 2;
      // editing状态
      var _editing = null;
      // todo数组
      var _todolist = [];
      var _addNewTodo = function(_todo) {
        var _id = _u._$uniqueID();
        var _obj = {
          id: _id,
          state: _ACTIVE,
          el: _templateFactory(_todo, _id),
        }
        _todo_list_el.insertBefore(_obj.el, _todo_list_el.firstChild);
        _todolist.push(_obj);
      }

      var _templateFactory = function(_todo, _id){
        var _html = _e._$getHtmlTemplate(_todo_seed, {
          name: _todo,
          id: _id,
        });
        var _node = _e._$html2node(_html)
        _e._$dataset(_node, 'todo_id', _id);
        _v._$addEvent(_node, 'click', 
          _handlerWrapWithConsquence(_node, _clickHandlerForTodo));
        _v._$addEvent(_node, 'dblclick', 
          _handlerWrapWithConsquence(_node, _dbclickHandlerForTodo));
        _v._$addEvent(_node, 'keypress',
          _handlerWrapWithConsquence(_node, _keypressHandlerForTodo));
        return _node;
      }



      var _handlerWrapWithConsquence = function(_context, _handler){
        return function(){
          _handler.apply(_context, arguments);
          _finnaly();
        }
      }

      var _finnaly = function(){
        _refreshStateWithHash();
        _refreshTodoCount();
        _refreshToggleAll();
        _refreshVisible();
      }

      var _clickHandlerForTodo = function(_event){
        if(_event.target.type === "checkbox"){
          var _obj = _getCurrentTodoFromEvent(_event);
          if(_obj.state === _ACTIVE) {
            _completeTodo(_obj);
          }else{
            _activateTodo(_obj);
          }
        }
        if(_event.target.nodeName.toUpperCase() === "BUTTON"){
          var _obj = _getCurrentTodoFromEvent(_event);
          _destroyTodo(_obj);
        }
        if(_editing){
          _e._$delClassName(_editing,'editing');
          _editing = null;
        }
      }
      var _dbclickHandlerForTodo = function(_event){
        if(_event.target.nodeName.toUpperCase() === "LABEL"){
          _editing = _event.currentTarget;
          _e._$addClassName(_event.currentTarget,'editing');
          _e._$one(".edit", _event.currentTarget).focus();
        }
      }

      var _keypressHandlerForTodo = function(_event){
        if(event.target.type === 'text'){
          var _el = event.target;
          var _obj = _getCurrentTodoFromEvent(_event);
          if(_isEnter(_event)){
            if(_el.value.trim() === ''){
              _destroyTodo(_obj);
            }else{
              var _label = _e._$one(".view > label", _obj.el);
              _label.innerText = _el.value.trim();
              _e._$delClassName(_event.currentTarget,'editing');
            }
          }
        }
      }

      function _getCurrentTodoFromEvent(_event){
          var _curr = _event.currentTarget;
          var _id = _e._$dataset(_curr, 'todo_id');
          var _obj = _todolist.find(function(_todo){
            return _todo.id === _id;
          });
          return _obj;
      }

      function _completeTodo(_obj){
        _obj.state = _COMPLETE;
        console.log(_obj.el)
        _e._$addClassName(_obj.el,'completed');
      }
      function _activateTodo(_obj){
        _obj.state = _ACTIVE;
        _e._$delClassName(_obj.el,'completed');
      }
      function _destroyTodo(_obj){
        _e._$remove(_obj.el, false);
        _todolist.splice(_todolist.indexOf(_obj), 1);
      }

      function _isEnter(_event){
        return _event.keyCode === 13;
      }

      function _refreshTodoList(state){
        _todolist.forEach(function(_obj) {
          if(!state){
            _e._$delClassName(_obj.el,'hidden');
          }else{
            _obj.state === state 
              ? _e._$delClassName(_obj.el,'hidden')
              : _e._$addClassName(_obj.el,'hidden');
          }
        });
      }

      function _refreshStateSelected(){
        _e._$delClassName(_all_el,'selected');
        _e._$delClassName(_active_el,'selected');
        _e._$delClassName(_complete_el,'selected');
      }
      function _refreshStateWithHash(){
        _refreshStateSelected();
        switch(location.hash){
          case '#/':
            _refreshTodoList();
            _e._$addClassName(_all_el,'selected');
          break;
          case '#/active':
            _refreshTodoList(_ACTIVE);
            _e._$addClassName(_active_el,'selected');
          break;
          case '#/completed':
            _refreshTodoList(_COMPLETE);
            _e._$addClassName(_complete_el,'selected');
          break;
          default: 
            _refreshTodoList();
            _e._$addClassName(_all_el,'selected');
        }
      }

      function _refreshTodoCount(){
        var _count = _todolist.reduce(function(_accum, _obj){
          return _accum + (_obj.state === _ACTIVE ? 1 : 0);
        }, 0);
        if(+_todo_count_el.innerText !== _count){
          _todo_count_el.innerText = _count;
        }
        if(_count < _todolist.length){
          if(_e._$hasClassName(_clear_completed_el, "hidden")){
            _e._$delClassName(_clear_completed_el, "hidden");
          }
        }else{
          if(!_e._$hasClassName(_clear_completed_el, "hidden")){
            _e._$addClassName(_clear_completed_el, "hidden");
          }
        }
      }

      function _refreshToggleAll(){
        if(_todolist.length === 0 && _toggle_all_el.checked){
          _toggle_all_el.checked = false;
        }
      }

      function _refreshVisible(){
        var _exist = _todolist.length > 0;
        if(_exist){
          if(_main_el.style.display === "none" || _footer_el.style.display === "none" ){
            _main_el.style.display = "block"; 
            _footer_el.style.display = "block";
          }
        }else{
          if(_main_el.style.display === "block" || _footer_el.style.display === "block" ){
            _main_el.style.display = "none"; 
            _footer_el.style.display = "none";
          }
        }
      }

      // todo显示状态
      _v._$addEvent(
        window, 'hashchange', _refreshStateWithHash, false);

      // 添加回车监听事件
      _v._$addEvent(
          _new_todo_el, 'keypress', 
          _handlerWrapWithConsquence(_new_todo_el, function(_event){
            if(_isEnter(_event) && _new_todo_el.value){
              _addNewTodo(_new_todo_el.value);
              _new_todo_el.value = "";
            }
          }),false
      );

      // toggle all
      _v._$addEvent(
        _toggle_all_el, 'click',
        _handlerWrapWithConsquence(_toggle_all_el, function(_event) {
          var _state = _toggle_all_el.checked ? _COMPLETE: _ACTIVE;
          _todolist.forEach(function(_obj){
            if(_state !== _obj.state){
              _e._$one(".view > input.toggle", _obj.el).click();
            }
          })
        }), false
      );

      // delete completed
      _v._$addEvent(
        _clear_completed_el, 'click',
        _handlerWrapWithConsquence(_clear_completed_el, function(){
          var _frag = document.createDocumentFragment();
          _todolist = _todolist.filter(function(_obj){
            return _obj.state === _ACTIVE;
          })
          _todolist.forEach(function (_obj){
            _frag.append(_obj.el);
          });
          _e._$clearChildren(_todo_list_el)
          _todo_list_el.append(_frag); 
        }), false
      );

      _finnaly();
    },'e7e4e235ceae8e3838ccafc56d295464','969649a4ff0816d1694efb2b41fe4848','c929bcfaf294c504e4aea4e7650f7486','a0025ae9c11a7f9271733056c89bfd1e','c47e39721f2df6334947464118e69c51');