'use strict';

describe('Service: GeekService', function () {

  // load the service's module
  beforeEach(module('miniGeekApp'));

  // instantiate service
  var GeekService;
  beforeEach(inject(function (_GeekService_) {
    GeekService = _GeekService_;
  }));

  it('should have the right URL to backend service', function () {
    expect(GeekService.ROOT_URL).toBe('http://mini-geek-service.appspot.com/');
  });

});
