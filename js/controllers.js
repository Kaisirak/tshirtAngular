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

function rgbToHsl(rgb){
	var r = parseInt(rgb.slice(0,2), 16);
	var g = parseInt(rgb.slice(2,4), 16);
	var b = parseInt(rgb.slice(4,6), 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;

    }

    return { 'h' : h , 's' : s, 'l' : l};
}

function pathalize(name) {
	return (angular.lowercase(name)).replace(/ /g, "-");
}

(function(){
	var app = angular.module('main-app', ['ngAnimate', 'ngRoute', 'angular-carousel']);

	app.config(["$routeProvider" , "$locationProvider", function($routeProvider, $locationProvider){
		$routeProvider.when("/", {redirectTo: "/home"})
		.when("/home", {templateUrl: "views/home.html"})
		.when("/designer/:category/:product", {templateUrl: "views/detail.html"})
		.when("/product/:slug", {templateUrl: "views/product.html"})
		.when("/artworks", {templateUrl: "views/artworks.html"})
		.when("/catalog", {templateUrl: "views/catalog.html"})
		.when("/order-status", {templateUrl: "views/order-status.html"})
		.when("/delivery-times", {templateUrl: "views/delivery-times.html"})
		.when("/shipping-information", {templateUrl: "views/shipping-information.html"})
		.when("/coupons", {templateUrl: "views/coupons.html"})
		.when("/contact-us", {templateUrl: "views/contact-us.html"})
		.when("/help-and-faq", {templateUrl: "views/help-and-faq.html"})
		.when("/privacy-and-security", {templateUrl: "views/privacy-and-security.html"})
		.when("/terms-and-conditions", {templateUrl: "views/terms-and-conditions.html"});

		$locationProvider.html5Mode(true);
	}]);


	app.directive('ngGridItems', function($window, $timeout) {
		return {
			restrict: 'A',
			scope: {
				ngGridItemsList: '=',
				ngGridItemsWidth: '=?',
				ngGridItemsHeight: '=?',
				ngGridItemsFilter: '=?'
			},
			template: '<ul class="cs-grid-items"><li ng-repeat="item in displayList" style="height: {{itemHeight}}px; width: {{itemWidth}}px; background-color: {{item.color}}; -webkit-transform: translate3D({{item.positionX}}px, {{item.positionY}}px, 0px) scale3D({{item.active?1:0.001}},{{item.active?1:0.001}},{{item.active?1:0.001}}); transform: translate3D({{item.positionX}}px, {{item.positionY}}px, 0px) scale3D({{item.active?1:0.001}},{{item.active?1:0.001}},{{item.active?1:0.001}});opacity: {{item.active?1:0}}"><span class="grid-items-content" ng-bind="item.txt"></span></li></ul>',
			controller: ['$scope', '$timeout', function($scope, $timeout){

				$scope.divWidth = 600;
				$scope.divHeight = 400;
				$scope.divX = 200;
				$scope.divY = 500;
				$scope.itemWidth = 200;
				$scope.itemHeight = 200;
				$scope.itemRightMargin = 5;
				$scope.itemBottomMargin = 5;

				$scope.showAll = function()
				{
					for(var i = 0; i < $scope.displayList.length; i++)
						$scope.displayList[i].active = true;
				};

				if (angular.isDefined($scope.ngGridItemsWidth))
					$scope.itemWidth = $scope.ngGridItemsWidth;

				if (angular.isDefined($scope.ngGridItemsHeight))
					$scope.itemHeight = $scope.ngGridItemsHeight;

				$scope.displayList = angular.copy($scope.ngGridItemsList);

				$scope.$watch(function(scope){
						return scope.ngGridItemsFilter;
				},
				function(newVal){
					if (angular.isDefined($scope.ngGridItemsFilter))
					{
						for(var i = 0; i < $scope.displayList.length; i++)
						{
							if ($scope.displayList[i].txt.indexOf($scope.ngGridItemsFilter) > -1)
								$scope.displayList[i].active = true;
							else
								$scope.displayList[i].active = false;
							}
						}
							else
							{
								$scope.showAll();
							}
							$scope.setSize();
						}
					);

					$scope.unselectItem = function(index){
						$scope.displayList[index].active = false;
						$scope.setSize();
					};

					$scope.updateView = function()
					{
						for (var i = iAct = 0; i < $scope.displayList.length; i++)
						{
							var posX = ((iAct * $scope.itemWidth) % $scope.divWidth) / $scope.itemWidth;
							var posY = Math.floor((iAct * $scope.itemWidth) / $scope.divWidth);

							$scope.displayList[i].positionX = ((iAct * $scope.itemWidth) % $scope.divWidth) + posX * $scope.itemRightMargin + $scope.divX;
							$scope.displayList[i].positionY = (Math.floor((iAct * $scope.itemWidth) / $scope.divWidth) * $scope.itemHeight) + posY * $scope.itemBottomMargin + $scope.divY;

							if ($scope.displayList[i].active)
								iAct++;

								$scope.divHeight = $scope.displayList[i].positionY + $scope.itemHeight + $scope.itemBottomMargin + $scope.itemBottomMargin - $scope.divY;
						}
					};

					$scope.showAll();

						}],
						link: function(scope, iElement, iAttrs, ctrl) {
							scope.setSize = function(){
								$timeout(function(){
									scope.divX = iElement[0].offsetLeft;
									scope.divY = iElement[0].offsetTop;
									scope.divWidth = Math.floor(iElement[0].offsetWidth / scope.itemWidth) * scope.itemWidth;
									scope.updateView();
									iElement.css('height', scope.divHeight);
								}, 100);
							};
							angular.element($window).bind('resize', function() {
								scope.setSize();
							});
							scope.$on("$routeChangeSuccess", function (event){
								scope.setSize();
							});
						}
					}
				});

	app.controller('MainController', ['$http', '$scope', '$location', function($http,$scope,$location) {

		this.cart = [];
		var apiurl = '';

		if ($location.host() == 'store.local') {
			apiurl = 'http://api.garment.local';
		}
		else
		    apiurl = 'http://api.shirtnexus.com';

		$scope.main = {
		    brand: "ShirtNexus",
			api_url: apiurl
		};


		this.productList = [];

		$scope.artworkList = [{color: '#fefefe', txt: 'Alien'},
													{color: '#fefefe', txt: 'Plane'},
													{color: '#fefefe', txt: 'Dog'},
													{color: '#fefefe', txt: 'Thing'},
													{color: '#fefefe', txt: 'Lel'},
													{color: '#fefefe', txt: 'Games'},
													{color: '#fefefe', txt: 'Other Things'}]

		var mainProductList = [ 'Hoodies','Short Sleeve Shirts','Long Sleeve Shirts','Mugs','Phone cases','Sweatshirts' ];
		this.productCompleteList = [];
		myThis = this;

		//$http.get('http://api.shirtfull.com/products').
		$http.get($scope.main.api_url+'/products').
		  	success(function(data, status, headers, config) {
		  		var products = angular.fromJson(data);
		    	angular.forEach(products, function(product, key) {
		    		angular.forEach(product, function(value, key2) {
		    			if (typeof value['image'] !== 'undefined' && typeof value['image'].url !== 'undefined')
		    				console.log('Url undefined');
		    			//myThis.productCompleteList.push( { category: key, name: value['name'], path : value['productId'],
				  			//'image' : (typeof value['image'] !== 'undefined')? value['image']:'http://placehold.it/180' } );
		    		});

				});
				$scope.productList= myThis.productList = myThis.productCompleteList;
			}).
		  	error(function(data, status, headers, config) {
		    	console.log(data);
	  		});


		// METHODS
		this.openCart = function(){
			$('#cartModal').modal('show');
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
	}]);

	app.filter('unique', ['$parse', function ($parse) {
  'use strict';

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

      var extractValueToCompare = function (item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function (item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  	};
	}]);

	app.controller('DesignerController', ["$http", "$routeParams", "$scope", function($http,$routeParams,$scope) {

		this.productsSameCategory = [];
		this.selectedDescription = "";
		this.colors = [];
		this.images = [];
		this.sizes = [];
		this.selectedColor = 0;
		this.possibleSizes = [];
		//var mainProductList = [ 'Hoodies','Short Sleeve Shirts','Long Sleeve Shirts','Mugs','Phone cases','Sweatshirts' ];
		//console.log('Params: '+$routeParams.product);
		var myThis = this;

		$http.get($scope.main.api_url+'/products/'+$routeParams.product).
			success(function(data, status, headers, config) {
				console.log(data);
				angular.forEach(data.colors, function(color, key) {
					myThis.colors.push( { name : color.name, id : color.hex, value: '#'+color.hex, hsl : rgbToHsl(color.hex) } );
					myThis.images[color.hex] = [];
					myThis.sizes[color.hex] = color.sizes;
					angular.forEach(color.images, function(image, key) {
						myThis.images[color.hex][angular.lowercase(image.label)] = image.url;
					});
					if (!myThis.selectedColor)
						//myThis.setColor(color.hex);
					if (!myThis.possibleSizes.length)
						myThis.possibleSizes = color.sizes;
				});
				myThis.selectedDescription = data.description;
				console.log(myThis.sizes);
				console.log(myThis.possibleSizes);
			}).
			error(function(data, status, headers, config) {
			 	console.log(data);
	  	});

		this.types = [
			{name: 'Short Sleeve', id: 1, price: 10, sizes: ['SM', 'LG', 'XL'], img_path: ['crew_front.png', 'crew_back.png']},
			{name: 'Long Sleeve', id: 0, price: 15, sizes: ['SM', 'MED', 'LG'], img_path: ['long_front.png', 'long_back.png']} ,
			{name: 'Hoodie', id: 2, price: 19, sizes: ['SM','MED', 'XL','XXL'], img_path: ['hoodie_front.png', 'hoodie_back.png']},
			{name: 'Tank Top', id: 3, price: 14, sizes: ['XS','SM', 'MED'], img_path: ['tank_front.png', 'tank_back.png']}
		];


		/*this.frontPrice = 5;
		this.backPrice = 5;
		this.curSelectedId = 0;
		this.isBackDesign = false;
		this.curSelected = this.types[0];
		this.curSelectedSize = this.curSelected.sizes[0];
		this.selectedColor = 2;*/

		this.designerImgUrl = "";

		this.setColor = function(hex) {
			this.selectedColor = '#'+hex;
			//this.setImage(hex, 'front');
			this.setSizes(hex, 'front');
		};

		this.showFront = function() {
			$(".behind-product").css("background-image", "url('img/" + this.curSelected.img_path[0] + "')");
		};

		this.showBack = function() {
			$(".behind-product").css("background-image", "url('img/" + this.curSelected.img_path[1] + "')");
		};

		this.completeName = function() {
			return (this.curSelectedSize + " " + this.colors[this.selectedColor].name + " " + this.curSelected.name);
		};

		this.setImage = function(hex, position) {
			this.designerImgUrl = this.images[hex][position];
			$(".behind-product").css("background-image", "url('" + this.designerImgUrl + "')");
		};

		this.setSizes = function(hex) {

		}

		this.update = function() {
			console.log(this.selectedProduct);
			/*
			this.curSelected = queryProd(this.types, this.curSelectedId);
			if ($("#versoBtn").hasClass('active') == false) {
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
			else {
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
			this.curSelectedSize = this.curSelected.sizes[0];*/
		};
	}]);

	app.controller('SliderController', ["$http", "$scope",
		function($http, $scope) {
			$scope.top12_part1 = [];
			$scope.top12_part2 = [];
			$scope.top12_part3 = [];

			$http.get($scope.main.api_url+'/admin/top_12_products').then(
				function(response){
					if (typeof response.data !== undefined) {
						var data = response.data;
						console.log(data);
						var i = 0;
						angular.forEach(data, function(product, key) {
							if (i < 4)
								$scope.top12_part1.push( { 'image'  : product.thumbnail, 'url' : '/product/'+product.product.id , 'price' : product.price});
							if (i >= 4 && i < 8)
								$scope.top12_part2.push( { 'image'  : product.thumbnail, 'url' : '/product/'+product.product.id , 'price' : product.price});
							if (i >= 8)
								$scope.top12_part3.push( { 'image'  : product.thumbnail, 'url' : '/product/'+product.product.id , 'price' : product.price});
							i++;
						});


						console.log($scope.top12_part1);
						console.log($scope.top12_part2);
						console.log($scope.top12_part3);
					}
				}, function(error){
					console.log(error);
				}
			);

	}]);

	app.controller('ProductController', ["$http", "$routeParams", "$scope", "$sce",
	function($http, $routeParams, $scope, $sce) {
		$scope.currentProd = {};
		$scope.colorSize = {};
		$scope.goodProd = {};
		$scope.selectedVariant = 0;
		$scope.selectedSize = "med";

		$scope.setSelectedVariant = function(index){
			$scope.selectedVariant = index;
			console.log($scope.currentProd.product_variants[$scope.selectedVariant].color_hex);
		};

		$scope.getProd = function(){
			$http.get('http://api.shirtnexus.com/admin/products/' + $routeParams.slug).then(
				function(response){
					$scope.currentProd = response.data;
					console.log($scope.currentProd);
					for (var i = 0; i < $scope.currentProd.product_variants.length; i++)
					{
						if (!$scope.colorSize[$scope.currentProd.product_variants[i].color_hex])
							$scope.colorSize[$scope.currentProd.product_variants[i].color_hex] = {};
						$scope.colorSize[$scope.currentProd.product_variants[i].color_hex][$scope.currentProd.product_variants[i].size] = $scope.currentProd.product_variants[i].price;
					}
					console.log($scope.colorSize);
				}, function(error){
					console.log(error);
				}
			);
		};

	}]);


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
			templateUrl: 'views/template-tableft.html',
			controller: 'TabController',
			controllerAs: 'tabCtrl'
		});
	});

	app.directive('cart', function() {
		return ({
			restrict: 'E',
			templateUrl: 'views/template-cart.html'
		});
	});

	app.directive('modalcart', function() {
		return ({
			restrict: 'E',
			templateUrl: 'views/template-modalcart.html'
		});
	});

/*** CANVAS DIRECTIVE ***/

	app.directive('fabricCanvas', function() {
			return ({
				restrict: 'A',
				link: function(scope, element, attrs){
						var timer = 0;
						var canvas = this.__canvas = new fabric.Canvas('c');
						var rectoJSON = -1;
						var versoJSON = -1;
						var imgArray = new Array();
						var grid = 1.0;
						var fontSelect = $("#fontSelector");
						var fontList = ["Andale Mono", "Amaranth", "American Typewriter", "Apple Chancery", "Arial", "Arial Black", "Baskerville", "Big Caslon", "Bookman Old Style", "Brush Script", "Charter", "Century", "Century Gothic", "Clean", "Comic Sans MS", "Copperplate", "Courier", "Courier New", "cursive",
						"Fantasy", "Fixed", "Futura", "Georgia", "Gentium", "Herculanum", "Helvetica", "Impact", "Lucida", "Lucida Console", "Lucida Sans Unicode", "Marlett", "Marker Felt", "Minion Web", "Modena", "monospace", "New Century Schoolbook", "Optima", "Papyrus",
						"Symbol", "Tahoma", "Terminal", "Textile", "Techno", "Trebuchet MS", "Times", "Times New Roman",
						"Utopia", "Verdana", "Verona", "Webdings"];

						d = new Detector();			// Font checker
						for (var i = 0; i < fontList.length; i++)
						{
							if (d.detect(fontList[i]))
								fontSelect.append("<li><a class='select-font' style='font-family:\"" + fontList[i] + "\", serif;'>" + fontList[i] + "</a></li>");
							}


							canvas.setBackgroundColor('rgba(255, 255, 255, 0.0)', canvas.renderAll.bind(canvas));	// Default Background Color
							//canvas.setOverlayImage('../img/overlayRound.png', function(){
							//		canvas.setOverlayImage('../img/overlay.png', canvas.renderAll.bind(canvas));		// Preload Both Overlay Images
							//	});

							$("#onlinedesigner").on('click', '#crtBtn', function() {
								var addedTxt = new fabric.IText('edit text', {
									left: canvas.getWidth() / 2,
									top: canvas.getHeight() / 2,
									fill: '#000000'
								});
								canvas.add(addedTxt).setActiveObject(addedTxt);
							});

							$("#onlinedesigner").on('change', '#btnBack', function() {
								if ($("#rectoBtn").hasClass("active") == false)
								{
									$("#versoBtn").removeClass("active");
									$("#rectoBtn").addClass("active");
									$(".behind-product").css("background-image", "url('img/crew_front.png')");
									versoJSON = JSON.stringify(canvas.toJSON());
									canvas.clear();
									canvas.backgroundImage = false;
									if (rectoJSON != -1)
									{
										canvas.loadFromJSON(JSON.parse(rectoJSON), function () {
											if (canvas.backgroundImage)
											{
												canvas.backgroundImage.setHeight(canvas.height);
												canvas.backgroundImage.setWidth(canvas.width);
											}
											canvas.renderAll();
										});
									}
									else
										canvas.renderAll();
									}
								});

								$("#onlinedesigner").on('change', '#imgLoader', function(e) {
									var reader = new FileReader();
									reader.onload = function (event) {
										var imgObj = new Image();
										imgObj.src = event.target.result;
										imgObj.onload = function () {
											var image = new fabric.Image(imgObj);
											image.set({
												left: canvas.width / 100,
												top: canvas.height / 20,
												scaleY: canvas.width / image.width,
    											scaleX: canvas.width / image.width,
												angle: 0,
												padding: 0,
												cornersize: 0
											});
											if ($("#rectoBtn").hasClass("active") == false && $("#3").val() == 15)
											{
												image.filters.push(new fabric.Image.filters.Grayscale());
												image.applyFilters(canvas.renderAll.bind(canvas));
											}
											canvas.add(image);
											$('#imgLoader').val("");
										}
									}
									reader.readAsDataURL(e.target.files[0]);
								});

								$("#onlinedesigner").on('click', '#delBtn', function() {
									canvas.remove(canvas.getActiveObject());
								});

								$("#txtColor").colpick({
									layout:'hex',
									submit:0,
									colorScheme:'light',
									onChange:function(hsb,hex,rgb,el,bySetColor){
										if ($("#rectoBtn").hasClass("active") == false && $("#3").val() == 15)
										{
											hex = $.colpick.hexToHsb(hex);
											hex.s = 0;
											hex = $.colpick.hsbToHex(hex)
										}
										$("#colorpick-outer").css('background-color', '#'+hex);
										canvas.getActiveObject().setFill('#'+hex);
										canvas.renderAll();
									}
								});

								$("#txtDeco").click(function() {
									if (!$(this).hasClass("active"))
									{
										canvas.getActiveObject().setTextDecoration("underline");
										$(this).addClass("active");
									}
									else
									{
										canvas.getActiveObject().setTextDecoration("");
										$(this).removeClass("active");
									}
									canvas.renderAll();
								});

								$("#txtWeight").click(function() {
									if (!$(this).hasClass("active"))
									{
										canvas.getActiveObject().setFontWeight("bold");
										$(this).addClass("active");
									}
									else
									{
										canvas.getActiveObject().setFontWeight("normal");
										$(this).removeClass("active");
									}
									canvas.renderAll();
								});

								$("#txtStyle").click(function() {
									if (!$(this).hasClass("active"))
									{
										canvas.getActiveObject().setFontStyle("italic");
										$(this).addClass("active");
									}
									else
									{
										canvas.getActiveObject().setFontStyle("normal");
										$(this).removeClass("active");
									}
									canvas.renderAll();
								});

								$("#onlinedesigner").on('click', '.select-font', function() {
									$("#txtFont").text($(this).text());
									canvas.getActiveObject().setFontFamily($(this).text());
									canvas.renderAll();
								});

								$("#txtSize").change(function() {
									canvas.getActiveObject().setFontSize($(this).val());
									canvas.renderAll();
								});

								$("#stfBtn").click(function() {
									if (canvas.getActiveObject() != null)
										canvas.getActiveObject().bringToFront();
									});

									$("#stbBtn").click(function() {
										if (canvas.getActiveObject() != null)
											canvas.getActiveObject().sendToBack();
										});

										$("#mkCpy").click(function() {
											if (canvas.getActiveObject() != null)
											{
												var currentObj = canvas.getActiveObject();
												if (currentObj.isType('i-text'))
												{
													var mysyncpy = currentObj.clone();
													mysyncpy.set("top", mysyncpy.top+16);
													mysyncpy.set("left", mysyncpy.left+16);
													canvas.add(mysyncpy);
													canvas.renderAll();
												}
												else
												{
													currentObj.clone(function(o){
														mycpy = o;
														mycpy.set("top", mycpy.top+16);
														mycpy.set("left", mycpy.left+16);
														canvas.add(mycpy);
														canvas.renderAll();
													});
												}
											}
										});

										$("#gridSize").change(function() {
											grid = $(this).val();
										});

										canvas.on('selection:cleared', function() {
											$("#stbBtn").prop("disabled", true);
											$("#stfBtn").prop("disabled", true);
											$("#mkCpy").prop("disabled", true);
											$("#txtColor").prop("disabled", true);
											$("#txtDeco").prop("disabled", true);
											$("#txtFamily").prop("disabled", true);
											$("#txtWeight").prop("disabled", true);
											$("#txtStyle").prop("disabled", true);
											$("#txtSize").prop("disabled", true);
										});

										canvas.on('object:selected', function(e) {
											var activeObject = e.target;
											$("#stbBtn").prop("disabled", false);
											$("#stfBtn").prop("disabled", false);
											$("#mkCpy").prop("disabled", false);
											if (activeObject.isType('i-text'))
											{
												$("#txtColor").prop("disabled", false);
												$("#txtDeco").prop("disabled", false);
												$("#txtFamily").prop("disabled", false);
												$("#txtWeight").prop("disabled", false);
												$("#txtStyle").prop("disabled", false);
												$("#txtSize").prop("disabled", false);
												$("#colorpick-outer").css('background-color', activeObject.get('fill'));
												$("#txtColor").colpickSetColor(activeObject.get('fill'));
												$("#txtDeco").val(activeObject.get('textDecoration') == "underline"?true:false);
												$("#txtFamily > #txtFont").text(activeObject.get('fontFamily'));
												$("#txtWeight").val(activeObject.get('fontWeight') == "bold"?true:false);
												$("#txtStyle").val(activeObject.get('fontStyle') == "italic"?true:false);
												$("#txtSize").val(activeObject.get('fontSize'));
												activeObject.get('textDecoration') == "underline"? $("#txtDeco").addClass("active"):$("#txtDeco").removeClass("active");
												activeObject.get('fontStyle') == "italic"? $("#txtStyle").addClass("active"):$("#txtStyle").removeClass("active");
												activeObject.get('fontWeight') == "bold"? $("#txtWeight").addClass("active"):$("#txtWeight").removeClass("active");
											}
											else
											{
												$("#txtColor").prop("disabled", true);
												$("#txtDeco").prop("disabled", true);
												$("#txtFamily").prop("disabled", true);
												$("#txtWeight").prop("disabled", true);
												$("#txtStyle").prop("disabled", true);
												$("#txtSize").prop("disabled", true);
											}
										});

										canvas.on('object:moving', function(options) {
											options.target.set({
												left: Math.round(options.target.left / grid) * grid,
												top: Math.round(options.target.top / grid) * grid
											});
										});

										$("#versoBtn").click(function() {
											if ($(this).hasClass("active") == false)
											{
												$("#rectoBtn").removeClass("active");
												$(this).addClass("active");
												rectoJSON = JSON.stringify(canvas.toJSON());
												canvas.clear();
												canvas.backgroundImage = false;
												if (versoJSON != -1)
												{
													canvas.loadFromJSON(JSON.parse(versoJSON), function () {
														if (canvas.backgroundImage)
														{
															canvas.backgroundImage.setHeight(canvas.height);
															canvas.backgroundImage.setWidth(canvas.width);
														}
														canvas.renderAll();
													});
												}
												else
													canvas.renderAll();
												}
											});

											$("#rectoBtn").click(function() {
												if ($(this).hasClass("active") == false)
												{
													$("#versoBtn").removeClass("active");
													$(this).addClass("active");
													versoJSON = JSON.stringify(canvas.toJSON());
													canvas.clear();
													canvas.backgroundImage = false;
													if (rectoJSON != -1)
													{
														canvas.loadFromJSON(JSON.parse(rectoJSON), function () {
															if (canvas.backgroundImage)
															{
																canvas.backgroundImage.setHeight(canvas.height);
																canvas.backgroundImage.setWidth(canvas.width);
															}
															canvas.renderAll();
														});
													}
													else
														canvas.renderAll();
													}
												});

												$("#onlinedesigner").on("click", ".designer-bg-img", function() {
													var url = $(this).attr('data-bg');
													canvas.setBackgroundImage(url, function(){
														if (canvas.backgroundImage)
														{
															canvas.backgroundImage.setHeight(canvas.height);
															canvas.backgroundImage.setWidth(canvas.width);
														}
														if (canvas.backgroundImage != false && $("#versoBtn").hasClass("active") && $("#3").val() == 15)
														{
															canvas.backgroundImage.filters.push(new fabric.Image.filters.Grayscale());
															canvas.backgroundImage.applyFilters(canvas.renderAll.bind(canvas));

														}
														canvas.renderAll();
													});
													$("#sbgBtn").popover('hide');
												});

												$("#onlinedesigner").on("keyup", "#searchBg", function() {
													if (timer)
														clearTimeout(timer);
														timer = setTimeout(doBgSearch, 400);
													});

													/*$("#onlinedesigner").on("keyup", "#searchTmpl", function() {
													var tomatch = new RegExp($(this).val() + ".*", "i");
													var allTmpl = $(".designer-tmpl > .designer-tmpl-img");
													allTmpl.each(function() {
													if($(this).attr('data-name').match(tomatch))
													$(this).fadeIn();
													else
													$(this).fadeOut();
												});
											});*/

											$("#addTemplate").click(function() {
												$("#classicBusiness").parent().before("<label style=\"margin-right: 5px;\"><button class=\"btn btn-primary\" type=\"button\" id=\"" + $("#nameTemplate").val() + "\">" + $("#nameTemplate").val() + "</button></label>");
												if ($("#versoBtn").hasClass("active"))
												{
													var cRec = rectoJSON;
													var cVer = JSON.stringify(canvas.toJSON());
												}
												else
												{
													var cRec = JSON.stringify(canvas.toJSON());
													var cVer = versoJSON;
												}
												$(document).on('click', '#' + $("#nameTemplate").val(), function() {
													versoJSON = cVer;
													rectoJSON = cRec;
													canvas.clear();
													canvas.backgroundImage = false;
													$("#rectoBtn").addClass("active");
													$("#versoBtn").removeClass("active");
													canvas.loadFromJSON(JSON.parse(rectoJSON), function () {
														canvas.renderAll();
													});
												});
											});

											$("#addtocart").click(function(event) {
												event.preventDefault();
												$.post(ROOT,{AJAX:'isConnected'},function(user_id){
													//If connected
													var product_id = $('#product_id').val();
													var category_id = $('#category_id').val();
													if (user_id != -1 && product_id && category_id) {
														var design_boxtype = $('input[name=design-type]:checked').val();
														switch(design_boxtype) {
															case 'make':
																makeDesign(user_id,category_id,product_id);
																break;
																case 'upload':
																	uploadDesign(user_id,category_id,product_id);
																	break;
																	case 'custom':
																		customDesign(canvas, user_id,category_id,product_id);
																		break;
																		default:
																			break;
																		}
																	}
																	else {
																		$("#signinModal").modal('show');
																	}
																});
															});

															function customDesign(canvas, user_id,category_id,product_id) {
																$("body").addClass("loading");
																if ($("#rectoBtn").hasClass("active"))
																	rectoJSON = JSON.stringify(canvas.toJSON());
																	else if ($("#versoBtn").hasClass("active"))
																		versoJSON = JSON.stringify(canvas.toJSON());
																		canvas.loadFromJSON(JSON.parse(versoJSON), function () {
																			canvas.setOverlayImage(null, canvas.renderAll.bind(canvas));
																			var imgverso = canvas.toDataURLWithMultiplier("jpg", 2.0, 1.0);
																			canvas.loadFromJSON(JSON.parse(rectoJSON), function () {
																				canvas.setOverlayImage(null, canvas.renderAll.bind(canvas));
																				var imgrecto = canvas.toDataURLWithMultiplier("jpg", 2.0, 1.0);
																				$.post(ROOT,{AJAX:'SendSelectionCustomDesign',user_id:user_id,category_id:category_id,
																				product_id:product_id,imgverso:imgverso,imgrecto:imgrecto,
																				rectoJSON:rectoJSON,versoJSON:versoJSON}, function(data){
																					if (data == 1) {
																						window.location = '/cart';
																					}
																					else {
																						$("body").removeClass("loading");
																						$('html,body').animate({ scrollTop: 0 }, 'slow');
																						showAlert('We were not able to send your request. Please, contact us or try again later.');
																					}
																				});
																			});
																		});
																	}
																	$(".btn-tooltip").tooltip({container: 'body'});

																	$("#onlinedesigner").on('click', '.color-preview', function() {
																		$(".behind-product").css('background-color', $(this).css('background-color'));
																	});
				}
			});
	});

})();
