module('test-unit', {
	setup: function() {
		$('.test').empty();
		$('.test').append('<div class="wrapper"></div>');
		$('.wrapper').append('<ul>');
		$('.wrapper ul').append('<li>test</li>');
		$('.wrapper ul').append('<li>test2</li>');
		$('.wrapper ul').append('<li>test3</li>');
		$('.wrapper').append('</ul>');
		$('.wrapper').append('<p class="next">next</p>');
		$('.wrapper').append('<p class="prev">prev</p>');
	}
});

test('幅がautoの時は親要素の領域分広がる', function() {
	$('.wrapper').css('width', '300px');
	$('.wrapper ul').waiwaiCarousel();
	equal($('.waiwai-wrapper').width(), 300);
});

test('高さがautoの時は親要素の領域分広がる', function() {
	$('.wrapper').css('height', '300px');
	$('.wrapper ul').waiwaiCarousel({
		direction: 'vertical'
	});
	equal($('.waiwai-wrapper').height(), 300);
});

test('幅を指定したらその領域分のカルーセルが生成される', function() {
	$('.wrapper ul').waiwaiCarousel({
		width: '600px'
	});
	equal($('.waiwai-wrapper').width(), 600);
});

test('高さを指定したらその領域分のカルーセルが生成される', function() {
	$('.wrapper ul').waiwaiCarousel({
		height: '600px',
		direction: 'vertical'
	});
	equal($('.waiwai-wrapper').height(), 600);
});

asyncTest('初期値にいる状態でprevが押されても移動しない', function() {
	var $ul = $('.wrapper ul');
	$ul.waiwaiCarousel({
		next: '.next',
		prev: '.prev',
		transitionSize: 1,
		onTransitionEnd: function(params) {
			equal(params.transitionItemCount, 0);
			equal($ul.css('left'), 'auto');
			start();
		}
	});
	equal($ul.css('left'), 'auto');
	$('.prev').click();
});

asyncTest('最後の項目がに表示されている状態でnextが押されても移動しない', function() {
	var $ul = $('.wrapper ul');
	var $li = $('.wrapper ul').find('li');
	$li.each(function(i, element) {
		$(element).css('width', '300px');
	});
	var tests = new Array();
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 0);
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 0);
		equal($ul.css('left'), '-600px');
		$('.next').click();
	});
	$ul.waiwaiCarousel({
		width: '300px',
		next: '.next',
		prev: '.prev',
		transitionSize: 1,
		onTransitionEnd: function(params) {
			if(tests.length === 0) {
				start();
				return;
			}
			var target = tests.shift();
			target(params.transitionItemCount);
		}
	});
	equal($ul.css('left'), 'auto');
	$('.next').click();
});

asyncTest('項目の横移動ができる', function() {
	var $ul = $('.wrapper ul');
	$ul.append('<li>test4</li>');
	var $li = $('.wrapper ul').find('li');
	$li.each(function(i, element) {
		$element = $(element);
		$element.css('width', '300px');
		if($element.index() === 1) {
			$element.css('margin', '20px');
		}
	});
	var tests = new Array();
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '-300px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '-640px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '-940px');
		$('.prev').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '-640px');
		$('.prev').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '-300px');
		$('.prev').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '0px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '-300px');
		$('.prev').click();
	});
	$ul.waiwaiCarousel({
		width: '300px',
		next: '.next',
		prev: '.prev',
		transitionSize: 1,
		onTransitionEnd: function(params) {
			if(tests.length === 0) {
				start();
				return;
			}
			var target = tests.shift();
			target(params.transitionItemCount);
		}
	});
	equal($ul.css('left'), 'auto');
	$('.next').click();
});

asyncTest('項目の縦移動ができる', function() {
	var $ul = $('.wrapper ul');
	$ul.append('<li>test4</li>');
	var $li = $('.wrapper ul').find('li');
	$li.each(function(i, element) {
		$element = $(element);
		$element.css('height', '300px');
		if($element.index() === 1) {
			$element.css('margin', '20px');
		}
	});
	var tests = new Array();
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '-300px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '-640px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '-940px');
		$('.prev').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '-640px');
		$('.prev').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '-300px');
		$('.prev').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '0px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '-300px');
		$('.prev').click();
	});
	var count = 0;
	$ul.waiwaiCarousel({
		height: '300px',
		next: '.next',
		prev: '.prev',
		direction: 'vertical',
		transitionSize: 1,
		onTransitionEnd: function(params) {
			if(tests.length === 0) {
				start();
				return;
			}
			var target = tests.shift();
			target(params.transitionItemCount);
		}
	});
	equal($ul.css('top'), 'auto');
	$('.next').click();
});

asyncTest('表示領域を見て自動で横の移動量を計算する', function() {
	$('.wrapper').css('width', '300px');
	var $ul = $('.wrapper ul');
	$ul.append('<li>test4</li>');
	$ul.append('<li>test5</li>');
	$ul.append('<li>test6</li>');
	var $li = $('.wrapper ul').find('li');
	$li.each(function(i, element) {
		$(element).css('width', '300px');
	});
	var tests = new Array();
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('left'), '-300px');
		$('.waiwai-wrapper').css('width', '620px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 2);
		$('.waiwai-wrapper').css('width', '620px');
		equal($ul.css('left'), '-900px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 2);
		$('.waiwai-wrapper').css('width', '620px');
		equal($ul.css('left'), '-1500px');
		$('.next').click();
	});
	$ul.waiwaiCarousel({
		width: 'auto',
		next: '.next',
		prev: '.prev',
		transitionSize: 'auto',
		onTransitionEnd: function(params) {
			if(tests.length === 0) {
				start();
				return;
			}
			var target = tests.shift();
			target(params.transitionItemCount);
		}
	});
	equal($ul.css('top'), 'auto');
	$('.next').click();
});

asyncTest('表示領域を見て自動で縦の移動量を計算する', function() {
	$('.wrapper').css('height', '300px');
	var $ul = $('.wrapper ul');
	$ul.append('<li>test4</li>');
	$ul.append('<li>test5</li>');
	$ul.append('<li>test6</li>');
	var $li = $('.wrapper ul').find('li');
	$li.each(function(i, element) {
		$(element).css('height', '300px');
	});
	var tests = new Array();
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 1);
		equal($ul.css('top'), '-300px');
		$('.waiwai-wrapper').css('height', '620px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 2);
		equal($ul.css('top'), '-900px');
		$('.waiwai-wrapper').css('height', '620px');
		$('.next').click();
	});
	tests.push(function(transitionItemCount) {
		equal(transitionItemCount, 2);
		equal($ul.css('top'), '-1500px');
		$('.waiwai-wrapper').css('height', '620px');
		$('.next').click();
	});
	$ul.waiwaiCarousel({
		height: 'auto',
		next: '.next',
		prev: '.prev',
		direction: 'vertical',
		transitionSize: 'auto',
		onTransitionEnd: function(params) {
			if(tests.length === 0) {
				start();
				return;
			}
			var target = tests.shift();
			target(params.transitionItemCount);
		}
	});
	equal($ul.css('top'), 'auto');
	$('.next').click();
});

asyncTest('コントロールボタンが押された時コールバックされる', function() {
	var $ul = $('.wrapper ul');
	var $li = $('.wrapper ul').find('li');
	$li.each(function(i, element) {
		$(element).css('width', '300px');
	});
	var tests = new Array();
	tests.push(function() {
		$('.prev').click();
	});
	$ul.waiwaiCarousel({
		width: '300px',
		next: '.next',
		prev: '.prev',
		transitionSize: 1,
		onTransitionEnd: function(params) {
			if(tests.length === 0) {
				start();
				return;
			}
			var target = tests.shift();
			target(params.transitionItemCount);
		},
		onNextClick: function() {
			ok(true);
		},
		onPrevClick: function() {
			ok(true);
		}
	});
	$('.next').click();
});

asyncTest('アニメーション時にコールバックされる', function() {
	$('.wrapper').css('width', '300px');
	var $ul = $('.wrapper ul');
	$ul.append('<li>test4</li>');
	$ul.append('<li>test5</li>');
	$ul.append('<li>test6</li>');
	var $li = $('.wrapper ul').find('li');
	$li.each(function(i, element) {
		$(element).css('width', '300px');
	});
	var transitionStartTests = new Array();
	transitionStartTests.push(function(params) {
		equal(params.action, 'next');
		equal($ul.css('left'), 'auto');
	});
	transitionStartTests.push(function(params) {
		equal(params.action, 'next');
		equal($ul.css('left'), '-300px');
	});
	transitionStartTests.push(function(params) {
		equal(params.action, 'prev');
		equal($ul.css('left'), '-900px');
	});
	transitionStartTests.push(function(params) {
		equal(params.action, 'prev');
		equal($ul.css('left'), '-300px');
	});
	var transitionEndTests = new Array();
	transitionEndTests.push(function(params) {
		equal(params.action, 'next');
		equal(params.transitionItemCount, 1);
		equal(params.transitionSize, 300);
		equal($ul.css('left'), '-300px');
		$('.waiwai-wrapper').css('width', '620px');
		$('.next').click();
	});
	transitionEndTests.push(function(params) {
		equal(params.action, 'next');
		equal(params.transitionItemCount, 2);
		equal(params.transitionSize, 600);
		equal($ul.css('left'), '-900px');
		$('.waiwai-wrapper').css('width', '620px');
		$('.prev').click();
	});
	transitionEndTests.push(function(params) {
		equal(params.action, 'prev');
		equal(params.transitionItemCount, 2);
		equal(params.transitionSize, 600);
		equal($ul.css('left'), '-300px');
		$('.waiwai-wrapper').css('width', '620px');
		$('.prev').click();
	});
	$ul.waiwaiCarousel({
		width: 'auto',
		next: '.next',
		prev: '.prev',
		transitionSize: 'auto',
		onTransitionStart: function(params) {
			if(transitionStartTests.length === 0) {
				return;
			}
			var target = transitionStartTests.shift();
			target(params);
		},
		onTransitionEnd: function(params) {
			if(transitionEndTests.length === 0) {
				start();
				return;
			}
			var target = transitionEndTests.shift();
			target(params);
		}
	});
	$('.next').click();
});

test('ul以外が指定された場合は処理しない', function() {
	$('.test').append('<div class="no_ul"></div>');
	$('.no_ul').waiwaiCarousel();
	equal($($('.no_ul').parent('.waiwai-wrapper')).length, 0);
});