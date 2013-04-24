'use strict';

describe('Service: GeekService', function () {

  // load the service's module
  beforeEach(module('miniGeekApp'));

  // instantiate service
  var GeekService;
  beforeEach(inject(function (_GeekService_) {
    GeekService = _GeekService_;
  }));

  it('should do something', function () {
    expect(!!GeekService).toBe(true);
  });

});
