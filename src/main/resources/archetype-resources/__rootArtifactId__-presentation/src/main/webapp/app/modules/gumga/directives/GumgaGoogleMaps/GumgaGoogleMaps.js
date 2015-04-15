define([],function(){

	GumgaGoogleMaps.$inject = ['$timeout']

	function GumgaGoogleMaps($timeout){
		return {
			restrict: 'E',
			template: '<div id="googleMaps" style="width:512px; height:512px"></div>',
			link: function(scope,elm,attrs){
				$timeout(function(){
					var mapOptions = {
						zoom: 0,
						center: new google.maps.LatLng(-34.397, 150.644),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					}
					var map = new google.maps.Map(document.getElementById('googleMaps'),mapOptions);
					console.log(map);
					var marker = new google.maps.Marker({
						position: map.getCenter(),
						map: map,
						title: 'Click to zoom'
					});
				},100)
			}
		}
	}

	return GumgaGoogleMaps;

})