$(document).ready(function() {
	$(".btn-tooltip").tooltip({container: 'body'});
	
	$("#onlinedesigner").on('click', '.color-preview', function() {
		$(".behind-product").css('background-color', $(this).css('background-color'));	
	});
	
	$(".show-cart").click(function() {
		$('#cartModal').modal('show');	
	});
	
});