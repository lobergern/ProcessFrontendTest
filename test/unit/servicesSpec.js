'use strict';

/* jasmine specs for services go here */

describe('service', function () {
  beforeEach(module('myApp.services'));

  describe("Unit: Testing Services", function () {
    describe("PageManager Service:", function () {
      var service, $httpBackend;
      beforeEach(inject(function (PageManager, _$httpBackend_) {
        service = PageManager;
        $httpBackend = _$httpBackend_;
      }));

      it('should contain a PageManager service', (function () {
        expect(service).not.toEqual(null);
      }));

      it('should notify page observers when add page is successfully called', function () {
        var callbackTest = {callback: function(){}};
        spyOn(callbackTest, 'callback');
        service.registerPageObserverCallback(callbackTest.callback);
        $httpBackend.when('POST', serverBaseUrl + '/content').respond(200, {status: 200, data: {}});
        service.addPage({}, '');
        $httpBackend.flush();
        expect(callbackTest.callback).toHaveBeenCalled();
      });

      it('should NOT notify page observers when add page is called and returns error', function () {
        var callbackTest = {callback: function(){}};
        spyOn(callbackTest, 'callback');
        service.registerPageObserverCallback(callbackTest.callback);
        $httpBackend.when('POST', serverBaseUrl + '/content').respond(500);
        service.addPage({}, '');
        $httpBackend.flush();
        expect(callbackTest.callback).not.toHaveBeenCalled();
      });
    });
  });

});
