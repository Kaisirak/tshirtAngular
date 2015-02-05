function queryProd(myArray, myId)
{
	for(var i = 0; i < myArray.length;i++)
	{
		if (myArray[i].id == myId)
		{
			return (myArray[i]);
		}
	}
	return (myArray[0]);
}

(function(){
	var app = angular.module('main-app', ['ngAnimate']);

	app.controller('ProductController', function() {
		this.types = [{name: 'Short Sleeve', id: 1, price: 10, sizes: ['SM', 'LG', 'XL'], img_path: ['crew_front.png', 'crew_back.png']},
									{name: 'Long Sleeve', id: 0, price: 15, sizes: ['SM', 'MED', 'LG'], img_path: ['long_front.png', 'long_back.png']} ,
									{name: 'Hoodie', id: 2, price: 19, sizes: ['SM','MED', 'XL','XXL'], img_path: ['hoodie_front.png', 'hoodie_back.png']},
									{name: 'Tank Top', id: 3, price: 14, sizes: ['XS','SM', 'MED'], img_path: ['tank_front.png', 'tank_back.png']}
								 ];
		this.colors = [	{name: 'Salmon', id: 0, value: '#ffbe9f'},
										{name: 'Night Black', id: 1, value: '#333333'},
										{name: 'White', id: 2, value: '#ffffff'},
										{name: 'Irish Green', id: 3, value: '#12910f'},
										{name: 'pink', id: 4, value: '#f988d1'},
										{name: 'Fushia', id: 5, value:' #de0763'},
										{name: 'Dark Green', id: 6, value: '#347663'},
										{name: 'Cyan', id: 7, value: '#66ebeb'},
										{name: 'Sky Blue', id:8, value: '#04baff'},
										{name: 'Dark Blue', id: 9, value: '#0e3d83'},
										{name: 'Kaki', id: 10, value: '#779416'},
										{name: 'Yellow', id: 11, value: '#faee05'}
									];
		this.frontPrice = 5;
		this.backPrice = 5;
		this.curSelectedId = 0;
		this.isBackDesign = false;
		this.curSelected = this.types[0];
		this.curSelectedSize = this.curSelected.sizes[0];
		this.selectedColor = 2;

		this.cart = [];
		// METHODS

		this.completeName = function() {
			return (this.curSelectedSize + " " + this.colors[this.selectedColor].name + " " + this.curSelected.name);
		};

		this.update = function() {
			this.curSelected = queryProd(this.types, this.curSelectedId);
			if ($("#versoBtn").hasClass('active') == false)
			{
				$("#preloadFront").one('load', function() {
					$(".behind-product").css("background-image", "url('" + $(this).attr('src') + "')");
					$("#preloadBack").attr('src', $(this).attr('src').replace('_front', '_back'));
	        	})
	        	.attr('src', "img/" + this.curSelected.img_path[0]) //Set the source so it caches
	        	.each(function() {
	        		if(this.complete)
	        			$(this).trigger('load');
				});
			}
			else
			{
				$("#preloadFront").one('load', function() {
					$(".behind-product").css("background-image", "url('" + $(this).attr('src') + "')");
					$("#preloadFront").attr('src', $(this).attr('src').replace('_back', '_front'));
	        	})
	        	.attr('src', "img/" + this.curSelected.img_path[1]) //Set the source so it caches
	        	.each(function() {
	        		if(this.complete)
	        			$(this).trigger('load');
				});
			}

			//$(".behind-product").css("background-image", "url('img/" + this.curSelected.img_path[($("#versoBtn").hasClass('active') == true?1:0)] + "')");
			this.curSelectedSize = this.curSelected.sizes[0];
		};

		this.setColor = function(col) {
			this.selectedColor = col;
		};

		this.showFront = function() {
			$(".behind-product").css("background-image", "url('img/" + this.curSelected.img_path[0] + "')");
		};

		this.showBack = function() {
			$(".behind-product").css("background-image", "url('img/" + this.curSelected.img_path[1] + "')");
		};

		this.addToCart = function() {
			var cartObj = {size: this.curSelectedSize, color: this.colors[this.selectedColor].name, prod: this.curSelected.name, back: this.isBackDesign, price: this.curSelected.price + this.frontPrice + (this.isBackDesign === true?this.backPrice:0)};
			this.cart.push(cartObj);
			$('#cartModal').modal('show');
		};

		this.total = function() {
			var mytotal = 0;
			for (var i = 0; i < this.cart.length; i++)
				mytotal += this.cart[i].price;
			return (mytotal);
		};

		this.removeFromCart = function(indextoremove) {
			this.cart.splice(indextoremove, 1);
		};

		this.placeOrder = function() {
			console.log("BOO ORDR PLACED");
		};
	});

	app.controller('TabController', function() {
		this.currentTab = 1;
		this.isSet = function(mytab) {
			return mytab === this.currentTab;
		};
		this.setTab = function(mytab) {
			this.currentTab = mytab;
		};
	});

	app.directive('tableft', function() {
		return ({
			restrict: 'E',
			templateUrl: 'template-tableft.html',
			controller: 'TabController',
			controllerAs: 'tabCtrl'
		});
	});

	app.directive('cart', function() {
		return ({
			restrict: 'E',
			templateUrl: 'template-cart.html'
		});
	});

	app.directive('modalcart', function() {
		return ({
			restrict: 'E',
			templateUrl: 'template-modalcart.html'
		});
	});


})();
