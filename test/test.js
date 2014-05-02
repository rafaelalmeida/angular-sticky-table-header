// Generated by CoffeeScript 1.7.1
describe('angular-sticky-table-header', function() {
  var options;
  options = {
    cloneClassName: 'sticky-clone',
    className: 'sticky-stuck',
    interval: 10
  };
  beforeEach(angular.mock.module('stickyTableHeader'), function($provide) {
    return $provide.value('options', options);
  });
  beforeEach(function() {
    return inject(function($compile, $rootScope) {
      this.$compile = $compile;
      this.scope = $rootScope.$new();
      angular.extend(this.scope, {
        columnCollection: ['foo', 'bar', 'baz'],
        rowCollection: (Array.apply(null, Array(200))).map(function() {
          return ['moo', 'woo', 'zoo'];
        })
      });
      return this.element = angular.element("<div sticky-table-header columns=\"columnCollection\" rows=\"rowCollection\">\n\n	<table class=\"table\">\n		<thead>\n			<tr>\n				<th ng-repeat=\"th in columnCollection\">{{th}}</th>\n			</tr>\n		</thead>\n		<tbody>\n			<tr ng-repeat=\"tr in rowCollection\">\n				<td ng-repeat=\"td in tr\">{{td}}</td>\n			</tr>\n		</tbody>\n	</table>\n\n</div>");
    });
  });
  beforeEach(function() {
    (this.$compile(this.element))(this.scope);
    return this.scope.$digest();
  });
  describe('#doClone', function() {
    it('should clone the first <tr> it finds and append it to the <thead>', function() {
      expect((this.element.find('thead tr')).length).toBe(1);
      this.scope.doClone();
      return expect((this.element.find('thead tr')).length).toBe(2);
    });
    it('should clone the <tr>\'s contents', function() {
      this.scope.doClone();
      return expect(($((this.element.find('thead tr'))[1]).find('th')).length).toBe(this.scope.columnCollection.length);
    });
    it('should mirror the original <tr>\'s className', function() {
      this.element.find('thead tr').addClass('test');
      this.scope.doClone();
      return expect($((this.element.find('thead tr'))[1]).hasClass('test')).toBe(true);
    });
    return it('should assign the clone the className defined in options.cloneClassName', function() {
      this.scope.doClone();
      return expect($((this.element.find('thead tr'))[1]).hasClass(options.cloneClassName)).toBe(true);
    });
  });
  describe('#removeClones', function() {
    it('should set scope.isStuck to false', function() {
      this.scope.doClone();
      this.scope.removeClones();
      return expect(this.scope.isStuck).toBe(false);
    });
    return it('should remove all <tr> clones', function() {
      this.scope.doClone();
      this.scope.doClone();
      this.scope.doClone();
      expect((this.element.find('.' + options.cloneClassName)).length).toBe(3);
      this.scope.removeClones();
      return expect((this.element.find('.' + options.cloneClassName)).length).toBe(0);
    });
  });
  describe('#setOffset', function() {
    it('should call getBoundingClientRect on the first <tr>', function() {
      spyOn((this.element.find('tr'))[0], 'getBoundingClientRect');
      this.scope.setOffset();
      return expect((this.element.find('tr'))[0].getBoundingClientRect).toHaveBeenCalled();
    });
    return it('should set scope.offset equal to the value returned by getBoundingClientRect', function() {
      this.scope.offset = null;
      spyOn((this.element.find('tr'))[0], 'getBoundingClientRect').and.returnValue('foo');
      this.scope.setOffset();
      return expect(this.scope.offset).toEqual('foo');
    });
  });
  return describe('#setStuck', function() {
    it('should set scope.isStuck equal to the boolean passed into it', function() {
      this.scope.isStuck = null;
      this.scope.setStuck(true);
      return expect(this.scope.isStuck).toBe(true);
    });
    return it('should coerce non-boolean values into booleans', function() {
      this.scope.setStuck(true);
      expect(this.scope.isStuck).toBe(true);
      this.scope.setStuck('foo');
      expect(this.scope.isStuck).toBe(true);
      this.scope.setStuck(42);
      expect(this.scope.isStuck).toBe(true);
      this.scope.setStuck(null);
      expect(this.scope.isStuck).toBe(false);
      this.scope.setStuck(0);
      expect(this.scope.isStuck).toBe(false);
      this.scope.setStuck(false);
      return expect(this.scope.isStuck).toBe(false);
    });
  });
});
