describe('LightMarkdown', function () {
  var expect = window.expect,
    lightMarkdownProvider,
    markdown = 'This should be *bold*',
    parsedHtml = '<p>This should be <b>bold</b></p>';

  beforeEach(function () {

    module('ngLightMarkdown', function ($lightMarkdownProvider) {
      lightMarkdownProvider = $lightMarkdownProvider;
    });

  });

  describe('lightMarkdown directive', function () {
    var scope,
      compile,
      element,
      validTemplate = '<div light-markdown="someData"></div>';

    beforeEach(function () {
      // Inject in angular constructs otherwise,
      //  you would need to inject these into each test
      inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
      });
    });

    // JavaScript
    it('should have expected isolated scope', function () {
      element = createDirective(markdown);
      var isolated = element.isolateScope();
      expect(isolated.lightMarkdown).to.be.equal(markdown);
    });

    it('should parse markdown', function () {
      element = createDirective(markdown);
      expect(element.html()).to.be.equal('<div ng-bind-html="trustedHtml" class="ng-binding">' + parsedHtml + '</div>');
    });

    function createDirective(data, template) {
      var elm;

      // Setup scope state
      scope.someData = data;

      // Create directive
      elm = compile(template || validTemplate)(scope);

      // Trigger watchers
      scope.$apply();

      // Return
      return elm;
    }
  });

  describe('LightMarkdown Provider', function () {

    it('should set light markdown config variables', function () {
      lightMarkdownProvider.setOption('foo', 'bar');
      expect(lightMarkdownProvider.getOption('foo')).to.be.true();
    });


    it('should parse markdown', function () {
      expect(lightMarkdownProvider.$get().toHtml(markdown)).to.be.equal(parsedHtml);
    });

  });
});
