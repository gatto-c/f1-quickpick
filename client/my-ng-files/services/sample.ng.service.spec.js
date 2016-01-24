/* eslint-disable */
describe('sample.ng.service unit tests', function(){
    beforeEach(module("f1Quickpick"));

    var SampleProxy;

    beforeEach(inject(function(_SampleProxy_) {
      SampleProxy = _SampleProxy_;
    }));

    it('should have an existing SampleProxy service', function() {
        //expect(SampleProxy).to.exist;
    });

    it('should have an existing SampleProxy.mySample method', function() {
        //expect(SampleProxy.mySample).to.exist;
    });
});
/* eslint-enable */
