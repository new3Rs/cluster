OverShadowServerEvent = function OverShadowServerEvent(event, handler) {
  var httpServer = Package.webapp.WebApp.httpServer;
  var oldHttpServerListeners = httpServer.listeners(event).slice(0);
  httpServer.removeAllListeners(event);

  var newListener = function(request, secondArg /*, moreArguments */) {
    if (!secondArg) {
      console.error('The event is neither request nor upgrade.');
      return;
    }
    // Store arguments for use within the closure below
    var args = arguments;
    if(handler.apply(httpServer, args) !== true) {
      _.each(oldHttpServerListeners, function(oldListener) {
        oldListener.apply(httpServer, args);
      });
    }
  };
  httpServer.addListener(event, newListener);
}
