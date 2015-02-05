fabric.Canvas.prototype.getItemByName = function(name) {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].name && objects[i].name === name) {
      object = objects[i];
      break;
    }
  }
  return object;
};

var Detector = function() {
    var baseFonts = ['monospace', 'sans-serif', 'serif'];
    var testString = "mmmmmmmmmmlli";
    var testSize = '72px';
    var h = document.getElementsByTagName("body")[0];
    var s = document.createElement("span");

    s.style.fontSize = testSize;
    s.innerHTML = testString;
    var defaultWidth = {};
    var defaultHeight = {};
    for (var index in baseFonts)
	{
        s.style.fontFamily = baseFonts[index];
        h.appendChild(s);
        defaultWidth[baseFonts[index]] = s.offsetWidth;
        defaultHeight[baseFonts[index]] = s.offsetHeight;
        h.removeChild(s);
    }

    function detect(font) {
        var detected = false;
        for (var index in baseFonts) {
            s.style.fontFamily = font + ',' + baseFonts[index];
            h.appendChild(s);
            var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
            h.removeChild(s);
            detected = detected || matched;
        }
        return detected;
    }
    this.detect = detect;
};

function doBgSearch()
{
	var tomatch = new RegExp($('#searchBg').val() + ".*", "i");
	var allBgs = $(".designer-tmpl > .designer-bg-img");
	allBgs.each(function() {
		if($(this).attr('data-name').match(tomatch))
			$(this).fadeIn(300);
		else
			$(this).fadeOut(300);
	});
	setTimeout(function() {
		$('#bg-container').css('top', '0px');
		$('#bg-container').css('position', 'relative');
	}, 500);

}

$(document).ready(function() {
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
					left: canvas.width / 2,
					top: canvas.height / 2,
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
});
