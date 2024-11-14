var filename = 'test_turbinelist';

LukeBrowser.runJasmine(filename, function (filename) {
  describe(filename, function () {
    beforeAll(function () {
      this.client = LukeBrowser.init();
      this.selector = '.c3-metadata-id-windturbine-turbinesgrid .c3-card-title span';
      this.client.goto('windturbines');
    });

    it('Has the word "Turbines" in the data grid', function() {
      this.client.search(this.selector).text().assert('toEqual', 'Turbines');
    });
  });
});
