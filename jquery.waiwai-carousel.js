;(function($) {
	$.fn.waiwaiCarousel = function(overrideOptions) {
		var defaultOptions = {
			width: 'auto',
			height: 'auto',
			direction: 'horizontal',
			next: null,
			prev: null,
			animationDuration: 500,
			transitionSize: 'auto',
			onNextClick: null,
			onPrevClick: null,
			onTransitionStart: null,
			onTransitionEnd: null,
			loop: false
		}

		var options = $.extend(defaultOptions, overrideOptions);
		return this.each(function() {
			if(this.tagName.toLowerCase() !== 'ul') {
				// console.log('must be ul tag');
				return true;
			}
			new Carousel(options, this);
		});
	}

	var Carousel = (function() {
		function Carousel(options, element) {
			this.$ul = $(element);
			this.$li = this.$ul.find('li');

			this.$ul.wrap($('<div></div>').addClass('waiwai-wrapper'));
			this.$wrapper = this.$ul.parent('.waiwai-wrapper');

			if(options.direction === 'horizontal') {
				this.setupHorizontal(options);
			} else {
				this.setupVertical(options);
			}
		}

		Carousel.prototype.setupHorizontal = function(options) {
			this.$wrapper.css({
				width: this.getWidth(options),
				margin: 0,
				padding: 0,
				overflow: 'hidden'
			});
			this.$ul.css({
				width: '100%',
				listStyle: 'none',
				whiteSpace: 'nowrap',
				position: 'relative'
			});
			this.$li.css({
				maxWidth: this.getWidth(options),
				overflow: 'hidden'
			});
			this.setupProperties({
				getOuterSize: function(element) {
					return $(element).outerWidth(true);
				}
			});
			var self = this;
			this.setupEvents(options, {
				navigate: function(action) {
					self.navigateHorizontal(options, action);
				}
			});
		}

		Carousel.prototype.setupVertical = function(options) {
			this.$wrapper.css({
				width: this.getWidth(options),
				height: this.getHeight(options),
				margin: 0,
				padding: 0,
				overflow: 'hidden'
			});
			this.$ul.css({
				height: '100%',
				listStyle: 'none',
				position: 'relative'
			});
			this.$li.css({
				maxHeight: this.getHeight(options),
				overflow: 'hidden'
			});
			this.setupProperties({
				getOuterSize: function(element) {
					return $(element).outerHeight(true);
				}
			});
			var self = this;
			this.setupEvents(options, {
				navigate: function(action) {
					self.navigateVertical(options, action);
				}
			});
		}

		Carousel.prototype.setupProperties = function(functions) {
			this.stash = this.createStash(functions);
			this.moving = false;
			this.currentPosition = 0;
		}

		Carousel.prototype.createStash = function(functions) {
			var stash = new Array();
			this.$li.each(function() {
				stash.push(functions.getOuterSize(this));
			});
			return new CarouselStash(stash);
		}

		Carousel.prototype.getWidth = function(options) {
			var parentWidth = this.$wrapper.parent().width();
			return options.width === 'auto' ? parentWidth : options.width;
		}

		Carousel.prototype.getHeight = function(options) {
			var parentHeight = this.$wrapper.parent().height();
			return options.height === 'auto' ? parentHeight : options.height;
		}

		Carousel.prototype.setupEvents = function(options, functions) {
			var self = this;
			$(window).resize(function() {
				self.updateLayout(options);
			});
			if(options.next === null || options.prev === null) {
				return;
			}
			this.setupControlEvent(options, functions);
		}

		Carousel.prototype.setupControlEvent = function(options, functions) {
			var $controlNext = $(options.next);
			var $controlPrev = $(options.prev);

			var self = this;

			$controlNext.click(function() {
				if(!self.hasNext(options) || self.moving) {
					self.callback(options.onTransitionEnd, {
						transitionItemCount: 0
					});
					return;
				}
				self.moving = true;
				functions.navigate('next');
				self.callback(options.onNextClick);
			});

			$controlPrev.click(function() {
				if(!self.hasPrev(options) || self.moving) {
					self.callback(options.onTransitionEnd, {
						transitionItemCount: 0
					});
					return;
				}
				self.moving = true;
				functions.navigate('prev');
				self.callback(options.onPrevClick);
			});
		}

		Carousel.prototype.hasNext = function(options) {
			return !this.within(options, this.$li.last());
		}

		Carousel.prototype.hasPrev = function(options) {
			return !this.within(options, this.$li.first());
		}

		Carousel.prototype.within = function(options, element) {
			if(options.direction === 'horizontal') {
				return this.withinHorizontal(element);
			} else if(options.direction === 'vertical') {
				return this.withinVertical(element);
			}
			return false;
		}

		Carousel.prototype.withinHorizontal = function(element) {
			return this.withinWrapper(element, {
				wrapperStart: function($wrapper) {
					return $wrapper.offset().left;
				},
				wrapperEnd: function($wrapper) {
					return $wrapper.offset().left + $wrapper.width();
				},
				elementStart: function($element) {
					return $element.offset().left;
				},
				elementEnd: function($element) {
					return $element.offset().left + $element.width();
				}
			});
		}

		Carousel.prototype.withinVertical = function(element) {
			return this.withinWrapper(element, {
				wrapperStart: function($wrapper) {
					return $wrapper.offset().top;
				},
				wrapperEnd: function($wrapper) {
					return $wrapper.offset().top + $wrapper.height();
				},
				elementStart: function($element) {
					return $element.offset().top;
				},
				elementEnd: function($element) {
					return $element.offset().top + $element.height();
				}
			});
		}

		Carousel.prototype.withinWrapper = function(element, functions) {
			var wrapperStart = functions.wrapperStart(this.$wrapper);
			var wrapperEnd = functions.wrapperEnd(this.$wrapper);

			var $element = $(element);
			var elementStart = functions.elementStart($element);
			var elementEnd = functions.elementEnd($element);

			var withinStart = wrapperStart <= elementStart && elementStart <= wrapperEnd;
			var withinEnd = wrapperStart <= elementEnd && elementEnd <= wrapperEnd;
			return withinStart && withinEnd;
		}

		Carousel.prototype.navigateHorizontal = function(options, action) {
			var self = this;
			this.navigate(options, action, {
				getTransitionSize: function() {
					return self.calculateHorizontalTransitionSize(options, action);
				},
				getTransition: function(transition) {
					return action === 'next' ? {"left": '-=' + transition + 'px'} : {"left": '+=' + transition + 'px'};
				}
			});
		}

		Carousel.prototype.calculateHorizontalTransitionSize = function(options, action) {
			return this.calculateTransitionSize(options, action, {
				getWrapperSize: function($wrapper) {
					return $wrapper.width();
				},
				getElementSize: function($target) {
					return $target.outerWidth(true);
				}
			});
		}

		Carousel.prototype.navigateVertical = function(options, action) {
			var self = this;
			this.navigate(options, action, {
				getTransitionSize: function() {
					return self.calculateVerticalTransitionSize(options, action);
				},
				getTransition: function(transition) {
					return action === 'next' ? {"top": '-=' + transition + 'px'} : {"top": '+=' + transition + 'px'};
				}
			});
		}

		Carousel.prototype.calculateVerticalTransitionSize = function(options, action) {
			return this.calculateTransitionSize(options, action, {
				getWrapperSize: function($wrapper) {
					return $wrapper.height();
				},
				getElementSize: function($target) {
					return $target.outerHeight(true);
				}
			});
		}

		Carousel.prototype.calculateTransitionSize = function(options, action, functions) {
			var wrapperSize = functions.getWrapperSize(this.$wrapper);
			var size = 0;
			var total = 0;
			var $target = $(this.$li.eq(this.currentPosition));
			while(size < this.$li.length) {
				total += functions.getElementSize($target);
				$target = (action === 'next') ? $target.next() : $target.prev();
				if(this.requireBreak(options, action, total, wrapperSize, $target, size)) {
					break;
				}
				size++;
			}
			return size;
		}

		Carousel.prototype.requireBreak = function(options, action, total, wrapperSize, $target, size) {
			if(options.transitionSize === 'auto') {
				return total > wrapperSize || $target.index() === -1;
			} else {
				if(action === 'next') {
					return (this.currentPosition + size) >= (this.$li.length - 1) || size >= options.transitionSize;
				} else {
					return (this.currentPosition - size) <= 0 || size >= options.transitionSize;
				}
			}
		}

		Carousel.prototype.navigate = function(options, action, functions) {
			var targetItems = action === 'next' ? this.stash.navigateNext(functions.getTransitionSize()) : this.stash.navigatePrev(functions.getTransitionSize());
			this.currentPosition = action === 'next' ? this.currentPosition + targetItems.length : this.currentPosition - targetItems.length;
			var transition = 0;
			$.each(targetItems, function(i, size) {
				transition += size;
			});
			var self = this;
			self.callback(options.onTransitionStart, {
				transitionItemCount: targetItems.length,
				transitionSize: transition,
				action: action
			});
			this.$ul.animate(functions.getTransition(transition), options.animationDuration, function() {
				self.moving = false;
				self.callback(options.onTransitionEnd, {
					transitionItemCount: targetItems.length,
					transitionSize: transition,
					action: action
				});
			});
		}

		Carousel.prototype.updateLayout = function(options) {
			var width = this.getWidth(options);
			this.$wrapper.css('width', width);
		}

		Carousel.prototype.callback = function(callback, params) {
			if(!this.isFunction(callback)) {
				return;
			}
			callback(params);
		}

		Carousel.prototype.isFunction = function(value) {
			return value != null && typeof value === 'function';
		}

		return Carousel;
	})();

	var CarouselStash = (function() {
		function CarouselStash(array) {
			this.stash = array;
		}

		CarouselStash.prototype.navigateNext = function(offset) {
			var size = typeof offset !== 'undefined' ? offset : 1;
			if(this.stash.length < size) {
				return new Array();
			}
			var result = new Array();
			for(var i = 0; i < size; i++) {
				result.push(this.stash.shift());
			}
			this.stash = this.stash.concat(result);

			return result;
		}

		CarouselStash.prototype.navigatePrev = function(offset) {
			var size = typeof offset !== 'undefined' ? offset : 1;
			if(this.stash.length < size) {
				return new Array();
			}
			var result = new Array();
			for(var i = 0; i < size; i++) {
				result.push(this.stash.pop());
			}
			this.stash = result.reverse().concat(this.stash);

			return result;
		}

		CarouselStash.prototype.size = function() {
			return this.stash.length;
		}

		return CarouselStash;
	})()

})(jQuery);