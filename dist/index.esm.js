import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Observable, ApolloLink } from '@apollo/client';
import JwtDecode from 'jwt-decode';
var OperationQueue = /*#__PURE__*/function () {
  function OperationQueue() {
    _classCallCheck(this, OperationQueue);
    _defineProperty(this, "queue", []);
    this.queue = [];
  }
  _createClass(OperationQueue, [{
    key: "createObservable",
    value: function createObservable(req) {
      var _this = this;
      return new Observable(function (observer) {
        _this.queue.push(req);
        if (typeof req.subscriber === 'undefined') req.subscriber = {};
        req.subscriber.next = req.next || observer.next.bind(observer);
        req.subscriber.error = req.error || observer.error.bind(observer);
        req.subscriber.complete = req.complete || observer.complete.bind(observer);
      });
    }
  }, {
    key: "enqueueRequest",
    value: function enqueueRequest(request) {
      var req = _objectSpread({}, request);
      req.observable = req.observable || this.createObservable(req);
      return req.observable;
    }
  }, {
    key: "consumeQueue",
    value: function consumeQueue() {
      this.queue.forEach(function (req) {
        return req.forward(req.operation).subscribe(req.subscriber);
      });
      this.queue = [];
    }
  }]);
  return OperationQueue;
}();
var ApolloLinkTokenRefresh = /*#__PURE__*/function (_ApolloLink) {
  _inherits(ApolloLinkTokenRefresh, _ApolloLink);
  var _super = _createSuper(ApolloLinkTokenRefresh);
  function ApolloLinkTokenRefresh(_ref) {
    var _this2;
    var safety = _ref.safety,
      getAccessToken = _ref.getAccessToken,
      beforeRefresh = _ref.beforeRefresh,
      refresh = _ref.refresh;
    _classCallCheck(this, ApolloLinkTokenRefresh);
    _this2 = _super.call(this);
    _defineProperty(_assertThisInitialized(_this2), "safety", 60);
    _defineProperty(_assertThisInitialized(_this2), "beforeRefresh", function () {
      return null;
    });
    _defineProperty(_assertThisInitialized(_this2), "getAccessToken", void 0);
    _defineProperty(_assertThisInitialized(_this2), "refresh", void 0);
    _defineProperty(_assertThisInitialized(_this2), "fetching", false);
    _defineProperty(_assertThisInitialized(_this2), "queue", new OperationQueue());
    if (safety) _this2.safety = safety;
    if (beforeRefresh) _this2.beforeRefresh = beforeRefresh;
    _this2.getAccessToken = getAccessToken;
    _this2.refresh = refresh;
    return _this2;
  }
  _createClass(ApolloLinkTokenRefresh, [{
    key: "request",
    value: function request(operation, forward) {
      var _this3 = this;
      if (!this.isExpired()) return forward(operation);
      if (!this.fetching) {
        this.fetching = true;
        this.beforeRefresh();
        this.refresh({
          onFinally: function onFinally() {
            _this3.fetching = false;
            _this3.queue.consumeQueue();
          }
        });
      }
      return this.queue.enqueueRequest({
        operation: operation,
        forward: forward
      });
    }
  }, {
    key: "isExpired",
    value: function isExpired() {
      var accessToken = this.getAccessToken();
      if (!accessToken) return false;
      try {
        var exp = (JwtDecode(accessToken).exp || 0) - this.safety;
        return Date.now() >= exp * 1000;
      } catch (_unused) {
        return true;
      }
    }
  }]);
  return ApolloLinkTokenRefresh;
}(ApolloLink);
export { ApolloLinkTokenRefresh };
