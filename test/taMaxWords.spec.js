describe('taMaxWords', function(){
	'use strict';
	var $rootScope, $compile, $timeout;
	beforeEach(module('textAngular'));
	beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$timeout = _$timeout_;
	}));

	it('should fail without ngmodel', function(){
		expect(function () {
			$compile('<div ta-max-words></div>')($rootScope);
			$rootScope.$digest();
		}).toThrow();
	});

	it('should fail without a value', function(){
		expect(function () {
			$compile('<div ng-model="test" ta-max-words></div>')($rootScope);
			$rootScope.$digest();
		}).toThrow('Max words must be an integer');
	});

	it('should fail without a numeric value', function(){
		expect(function () {
			$compile('<div ng-model="test" ta-max-words="worldspawn"></div>')($rootScope);
			$rootScope.$digest();
		}).toThrow('Max words must be an integer');
	});

	describe('when validating', function(){
		var $scope;
		beforeEach(function(){
			$scope = $rootScope.$new();
			$scope.maxWords = 3;
			var form = angular.element('<form name="form"><input type="text" ng-model="model.html" ta-max-words="{{maxWords + 1}}" name="html" /></form>');
			$scope.model = { html : '' };
			$compile(form)($scope);
			$scope.$digest();
		});

		it('should fail when text exceeds limit', function(){
			$scope.form.html.$setViewValue('<strong>angular</strong> <p> is super awesome framework </p>');
			$timeout.flush();
			expect($scope.form.$error.taMaxWords).toBeDefined();
		});

		it('should pass when text is within limit', function(){
			$scope.form.html.$setViewValue('<strong>textAngular</strong>');
			$timeout.flush();
			expect($scope.form.html.$error.taMaxWords).toBe(undefined);
		});

		it('behaviour should change when max words limit is changed', function(){
			$scope.form.html.$setViewValue('<strong>angular</strong> <p> is super awesome framework </p>');
			$timeout.flush();
			expect($scope.form.$error.taMaxWords).toBeDefined();
			$scope.$apply(function(){
				$scope.maxWords = 5;
			});
			$scope.$digest();
			expect($scope.form.$error.taMaxWords).toBe(undefined);
		});

		it('should fail when max words limit is changed to non numeric value', function(){
			$scope.form.html.$setViewValue('<strong>textAngular__</strong>');
			$timeout.flush();
			expect($scope.form.$error.taMaxWords).toBe(undefined);
			expect(function() {
				$scope.$apply(function(){
					$scope.maxWords = 'worldspawn';
				});
			}).toThrow('Max words must be an integer');
		});
	});
});