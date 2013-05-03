'use strict';

describe('Service: UiService', function () {

  // load the service's module
  beforeEach(module('miniGeekApp'));

  // instantiate service
  var UiService;
  beforeEach(inject(function (_UiService_) {
    UiService = _UiService_;
  }));

  it('should do something', function () {
    expect(!!UiService).toBe(true);
  });

});
