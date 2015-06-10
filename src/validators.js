angular.module('textAngular.validators', [])
.directive('taMaxText', function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl){
			var max = parseInt(scope.$eval(attrs.taMaxText));
			if (isNaN(max)){
				throw('Max text must be an integer');
			}
			scope.charlimit = max;
			attrs.$observe('taMaxText', function(value){
				max = parseInt(value);
				if (isNaN(max)){
					throw('Max text must be an integer');
				}
				if (ctrl.$dirty){
					ctrl.$validate();
				}
			});
			ctrl.$validators.taMaxText = function(viewValue){
				var source = angular.element('<div/>');
				source.html(viewValue);
				return source.text().length <= max;
			};
		}
	};
})
.directive('taMinText', function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl){
			var min = parseInt(scope.$eval(attrs.taMinText));
			if (isNaN(min)){
				throw('Min text must be an integer');
			}
			attrs.$observe('taMinText', function(value){
				min = parseInt(value);
				if (isNaN(min)){
					throw('Min text must be an integer');
				}
				if (ctrl.$dirty){
					ctrl.$validate();
				}
			});
			ctrl.$validators.taMinText = function(viewValue){
				var source = angular.element('<div/>');
				source.html(viewValue);
				return !source.text().length || source.text().length >= min;
			};
		}
	};
}).directive('taMaxWords', function(){
 return {
   restrict: 'A',
   require: 'ngModel',
   link: function(scope, elem, attrs, ctrl){
     var max = parseInt(scope.$eval(attrs.taMaxWords));
     if (isNaN(max)){
       throw('Max words must be an integer');
     }
     scope.wordlimit = max;
     attrs.$observe('taMaxWords', function(value){
       max = parseInt(value);
       if (isNaN(max)){
         throw('Max words must be an integer');
       }
       if (ctrl.$dirty){
         ctrl.$validate();
       }
     });
     ctrl.$validators.taMaxWords = function(viewValue){
       var wordcount = 0;
       if (viewValue.replace(/\s*<[^>]*?>\s*/g, '') !== '') {
					wordcount = viewValue.replace(/<\/?(b|i|em|strong|span|u|strikethrough|a|img|small|sub|sup|label)( [^>*?])?>/gi, '') // remove inline tags without adding spaces
										.replace(/(<[^>]*?>\s*<[^>]*?>)/ig, ' ') // replace adjacent tags with possible space between with a space
										.replace(/(<[^>]*?>)/ig, '') // remove any singular tags
										.replace(/\s+/ig, ' ') // condense spacing
										.match(/\S+/g).length; // count remaining non-space strings
			}
       return wordcount <= max;
     };
   }
 };
});
