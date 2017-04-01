jQuery(document).ready(function($){
	$('.cd-cart-trigger').css('backgroundColor','#fff')
	var cartWrapper = $('.cd-cart-container');
	var cartBody = cartWrapper.find('.body');
	var cartList = cartBody.find('ul').eq(0);
	var cartImgSrc = '';
	var cartBookName = '';
	var cartBookCost = '';
	//product id - you don't need a counter in your real project but you can use your real product id
	var productId = 0;
	var price1 = 0;

	var bookName1 = '';
	var bookSrc = '';

	if( cartWrapper.length > 0 ) {
		//store jQuery objects

		var cartTotal = cartWrapper.find('.checkout').find('span');
		var cartTrigger = cartWrapper.children('.cd-cart-trigger');
		var cartCount = cartTrigger.children('.count');
		var addToCartBtn = $('.cd-add-to-cart');
		var undo = cartWrapper.find('.undo');
		var undoTimeoutId;
		var storage = window.localStorage;
		var userName = storage.getItem('userName');
		// 刷新时从本地存储中读取数据
		if (storage.getItem(userName)) {
			var userBookName = storage.getItem(userName);
			var userBookNameArr = userBookName.split(',');
			$.ajax({
				url: 'script/commodityInformation.json',
				success: function (data) {
					var a = 0;
					for (var j = 0;j<userBookNameArr.length;j++) {
						for (var i=0;i<data.length;i++) {
							if (userBookNameArr[j] == data[i].bookName) {

								var costN = data[i].cost.split('.');
								var cost1 = costN[0].split('');
								var integer = cost1[1]+cost1[2];

								var cost2 = costN[1].split('');

								var decimals = cost2[0]+cost2[1];

								var fullNum = parseFloat((integer + '.' + decimals)).toFixed(2);



								productId = productId + 1;
								var productAdded = $('<li class="product"><div class="product-image"><a href="#0"><img src="'+data[i].smallImg+'" alt="placeholder"></a></div><div class="product-details"><h3><a href="#0">'+userBookNameArr[j]+'</a></h3><span class="price">'+fullNum+'</span><div class="actions"><div class="quantity"><label for="cd-product-'+ productId +'">数量</label><span class="select"><select id="cd-product-'+ productId +'" name="quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span></div></div></div></li>');
								cartList.prepend(productAdded);
							}
						}
					}

					$('.count').find('li').eq(0).text($('.product').length);
					$('.count').find('li').eq(1).text($('.product').length+1);
					var zongjiaArr = [];
					$('.price').each(function (index,ele) {
						zongjiaArr.push(parseFloat($(this).text()).toFixed(2))
						//console.log(zongjiaArr)
					});
					var zongjiaNum = 0;
					for (var i=0;i<zongjiaArr.length;i++) {
						zongjiaNum += Number(parseFloat(zongjiaArr[i]).toFixed(2));
					}
					//console.log(zongjiaNum)
					$('.checkout span').text(zongjiaNum.toFixed(2))
				}
			})
			setTimeout(function(){
				cartWrapper.removeClass('empty');
			}, 500);
		}

			//add product to cart
		addToCartBtn.on('click', function(event){

			if (!storage.getItem('userName')) {
				$.notify({
					// options
					message: '请先登录'
				},{
					// settings
					type: 'warning',
					placement: {
						from: "top",
						align: "center"
					},
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
				return false
			}

			//if (storage.getItem(userName)) {
			//	if (!storage.getItem(userName) == '') {
			//		var cartBookName = storage.getItem(userName);
			//	}
            //
			//}
			var cartBookName = storage.getItem(userName);
			var $parPrev = $(this).parent().prev();
			bookName1 = $parPrev.find('span').text();
			bookSrc = $parPrev.find('img').attr('src');

			var $par = $(this).parent().prev();
			if (cartBookName == '') {
				cartBookName = $par.find('span').text();
			} else {
				cartBookName += ',' + $par.find('span').text();

			}
			console.log(cartBookName)
			storage.setItem(userName,cartBookName);

			event.preventDefault();
			price1 = Number(parseFloat($(this).attr('data-price')).toFixed(2));
			addToCart($(this));


		});

		//open/close cart
		cartTrigger.on('click', function(event){
			var storage = window.localStorage;
			if (!storage.getItem('userName')) {
				$.notify({
					// options
					message: '请先注册'
				},{
					// settings
					type: 'warning',
					placement: {
						from: "top",
						align: "center"
					},
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
			}
			event.preventDefault();
			toggleCart();
		});

		//close cart when clicking on the .cd-cart-container::before (bg layer)
		cartWrapper.on('click', function(event){
			if( $(event.target).is($(this)) ) toggleCart(true);
		});

		//delete an item from the cart
		cartList.on('click', '.delete-item', function(event){
			event.preventDefault();
			removeProduct($(event.target).parents('.product'));
		});

		//update item quantity
		cartList.on('change', 'select', function(event){
			quickUpdateCart();
		});

		//reinsert item deleted from the cart
		undo.on('click', 'a', function(event){
			clearInterval(undoTimeoutId);
			event.preventDefault();
			cartList.find('.deleted').addClass('undo-deleted').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$(this).off('webkitAnimationEnd oanimationend msAnimationEnd animationend').removeClass('deleted undo-deleted').removeAttr('style');
				quickUpdateCart();
			});
			undo.removeClass('visible');
		});
	}

	function toggleCart(bool) {
		var cartIsOpen = ( typeof bool === 'undefined' ) ? cartWrapper.hasClass('cart-open') : bool;
		
		if( cartIsOpen ) {
			cartWrapper.removeClass('cart-open');
			//reset undo
			clearInterval(undoTimeoutId);
			undo.removeClass('visible');
			cartList.find('.deleted').remove();

			setTimeout(function(){
				cartBody.scrollTop(0);
				//check if cart empty to hide it
				if( Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
			}, 500);
		} else {
			cartWrapper.addClass('cart-open');
		}
	}

	function addToCart(trigger) {
		var cartIsEmpty = cartWrapper.hasClass('empty');
		//update cart product list
		addProduct(trigger);
		//update number of items 
		updateCartCount(cartIsEmpty);
		//update total price
		updateCartTotal(trigger.data('price'), true);
		//show cart
		cartWrapper.removeClass('empty');
	}

	function addProduct(trigger) {
		//this is just a product placeholder
		//you should insert an item with the selected product info
		//replace productId, productName, price and url with your real product info

		productId = productId + 1;
		var productAdded = $('<li class="product"><div class="product-image"><a href="#0"><img src="'+bookSrc+'" alt="placeholder"></a></div><div class="product-details"><h3><a href="#0">'+bookName1+'</a></h3><span class="price">'+price1.toFixed(2)+'</span><div class="actions"><div class="quantity"><label for="cd-product-'+ productId +'">数量</label><span class="select"><select id="cd-product-'+ productId +'" name="quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span></div></div></div></li>');
		cartList.prepend(productAdded);
	}

	function removeProduct(product) {
		clearInterval(undoTimeoutId);
		cartList.find('.deleted').remove();
		
		var topPosition = product.offset().top - cartBody.children('ul').offset().top ,
			productQuantity = Number(product.find('.quantity').find('select').val()),
			productTotPrice = Number(product.find('.price').text()) * productQuantity;
		product.css('top', topPosition+'px').addClass('deleted');

		//update items count + total price
		updateCartTotal(productTotPrice, false);
		updateCartCount(true, -productQuantity);
		undo.addClass('visible');

		//wait 8sec before completely remove the item
		undoTimeoutId = setTimeout(function(){
			undo.removeClass('visible');
			cartList.find('.deleted').remove();
		}, 8000);
	}

	function quickUpdateCart() {
		var quantity = 0;
		var price = 0;
		
		cartList.children('li:not(.deleted)').each(function(){
			var singleQuantity = Number($(this).find('select').val());
			quantity = quantity + singleQuantity;
			price = price + Number(quantity*$(this).find('.price').text());
		});

		cartTotal.text(price.toFixed(2) + '￥');
		cartCount.find('li').eq(0).text(quantity);
		cartCount.find('li').eq(1).text(quantity+1);
	}

	function updateCartCount(emptyCart, quantity) {
		if( typeof quantity === 'undefined' ) {
			var actual = Number(cartCount.find('li').eq(0).text()) + 1;
			var next = actual + 1;
			
			if( emptyCart ) {
				cartCount.find('li').eq(0).text(actual);
				cartCount.find('li').eq(1).text(next);
			} else {
				cartCount.addClass('update-count');

				setTimeout(function() {
					cartCount.find('li').eq(0).text(actual);
				}, 150);

				setTimeout(function() {
					cartCount.removeClass('update-count');
				}, 200);

				setTimeout(function() {
					cartCount.find('li').eq(1).text(next);
				}, 230);
			}
		} else {
			var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
			var next = actual + 1;
			
			cartCount.find('li').eq(0).text(actual);
			cartCount.find('li').eq(1).text(next);
		}
	}

	function updateCartTotal(price, bool) {
		bool ? cartTotal.text( (parseFloat(cartTotal.text()) + parseFloat(price)).toFixed(2))  : cartTotal.text( (Number(cartTotal.text()) - price).toFixed(2) );
	}

	$('.cd-cart-trigger').click(function () {
		$('.cd-cart-trigger').css('backgroundColor','#fff')
	})
});