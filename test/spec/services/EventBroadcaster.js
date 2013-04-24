'use strict';

describe('Service: EventBroadcaster', function () {

  // load the service's module
  beforeEach(module('miniGeekApp'));

  // instantiate service
  var EventBroadcaster;
  beforeEach(inject(function (_EventBroadcaster_) {
    EventBroadcaster = _EventBroadcaster_;
  }));

  it('should do something', function () {
    expect(!!EventBroadcaster).toBe(true);
  });

});
