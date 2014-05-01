angular
.module('angularStickyTableHeader', [])
.value('options', {
	cloneClassName: 'sticky-clone',
	className: 'sticky-stuck',
	interval: 10
})
.directive('stickyTableHeader', function ($timeout, $window, options) {

	return {
		restrict: 'A',
		link: function (scope, element, attrs) {

			angular.extend(scope, {

				clone: null,
				isStuck: false,
				topOffset: 0,

				removeClones: function () {

					scope.isStuck = false;

					element
						.find('.' + options.cloneClassName)
						.remove();

				},

				doClone: function () {

					return $(element.find('tr')[0])
						.clone()
						.addClass(options.cloneClassName)
						.appendTo(element.find('thead'));

				},

				setClonedCellWidths: guard(function () {

					var thClones = scope.clone.find('th');

					angular.forEach(element.find('th'), function(th, n) {
						$(thClones[n]).css('width', $(th).css('width'));
					});

				}),

				setTopOffset: function () {

					scope.topOffset = element
						.find('tr')[0]
						.getBoundingClientRect()
						.top;

				},

				setStuck: function (bool) {

					scope.$apply(function(){
						scope.isStuck = !!bool;
					});

				},

				toggleClone: guard(function (bool) {

					scope.clone[(bool ? 'add' : 'remove') + 'Class'](options.className);

				}),

				sizeClone: guard(function () {

					scope.setTopOffset();
					scope.setClonedCellWidths();

				}),

				checkScroll: guard(function() {

					var scroll = $window.scrollY;

					if (!scope.isStuck && scroll >= scope.topOffset) {
						scope.setStuck(true);
					} else if (scope.isStuck && scroll < scope.topOffset) {
						scope.setStuck(false);
					}

				})

			});
			
			// watch columns, regenerate cloned row when they change
			scope.$watch(function(){
				return scope[attrs.columns];
			}, $timeout.bind(null, function(){

				scope.removeClones();
				scope.clone = scope.doClone();

			}));
			
			// watch rows, and re-measure column widths when they change
			scope.$watch(function(){
				return scope[attrs.rows];
			}, scope.setClonedCellWidths);

			// fired when a clone is created
			scope.$watch('clone', scope.sizeClone);

			// fired when stuck state changes
			scope.$watch('isStuck', scope.toggleClone);

			// listen on window resize event
			angular.element($window).on({
				resize: _.debounce(scope.setClonedCellWidths.bind(scope), options.interval),
				scroll: _.debounce(scope.checkScroll.bind(scope), options.interval)
			});


			// helpers
			
			
			function guard (fn) {
				return function(){
					if (!scope.clone) {
						return;
					}
					fn.apply(this, arguments);
				};
			}

		}
	};

});