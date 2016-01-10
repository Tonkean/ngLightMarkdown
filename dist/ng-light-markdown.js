;/*! ng-light-markdown 10-01-2016 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['angular', 'light-markdown'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('angular'), require('light-markdown'));
    } else {
        // Browser globals (root is window)
        root.ngLightMarkdown = factory(root.angular, root.lightMarkdown);
    }
}(this, function (angular, lightMarkdown) {
    if (typeof angular === 'undefined' || typeof lightMarkdown === 'undefined') {
        throw new Error('ngLightMarkdown was not loaded because one of its dependencies (AngularJS or lightMarkdown) was not met');
    }

    angular.module('ngLightMarkdown', ['ngSanitize'])
        .provider('$lightMarkdown', lightMarkdownProvider)
        .directive('lightMarkdown', ['$lightMarkdown', '$sanitize', lightMarkdownDirective]);

    /**
     * Angular Provider
     * Enables configuration of lightMarkdown via angular.config and Dependency Injection into controllers, views
     * directives, etc... This assures the directives and filters provided by the library itself stay consistent
     * with the user configurations.
     */
    function lightMarkdownProvider() {

        /**
         * Gets the value of the configuration parameter by key
         * @param {string} key The config parameter key
         * @returns {*}
         */
        this.getOption = function (key) {
            return lightMarkdown.getOption(key);
        };

        /**
         * Sets a configuration option
         *
         * @param {string} key Config parameter key
         * @param {string} value Config parameter value
         * @returns {lightMarkdownProvider}
         */
        this.setOption = function (key, value) {
            lightMarkdown.setOption(key, value);
            return this;
        };


        function LMObject() {
            /**
             * Converts a markdown text into HTML
             *
             * @param {string} markdown The markdown string to be converted to HTML
             * @returns {string} The converted HTML
             */
            this.toHtml = function (markdown) {
                return lightMarkdown.toHtml(markdown);
            };
        }

        // The object returned by service provider
        this.$get = function () {
            return new LMObject();
        };
    }


    /**
     * AngularJS Directive to light markdown to HTML transformation
     *
     * Usage example:
     * <div light-markdown="markdownText" ></div>
     *
     * @param {lightMarkdownProvider} $lightMarkdown
     * @param {$sanitize} $sanitize
     * @returns {*}
     */
    function lightMarkdownDirective($lightMarkdown, $sanitize) {
        return {
            restrict: 'A',
            scope: {
                lightMarkdown: '='
            },
            template: '<div ng-bind-html="trustedHtml"></div>',
            link: function (scope) {
                scope.$watch('lightMarkdown', function (newValue) {
                    var html;
                    if (typeof newValue === 'string') {
                        html = $lightMarkdown.toHtml(newValue);
                        scope.trustedHtml = $sanitize(html);
                    } else {
                        scope.trustedHtml = typeof newValue;
                    }
                });
            }
        };
    }

    return angular.module('ngLightMarkdown');
}));

//# sourceMappingURL=ng-light-markdown.js.map