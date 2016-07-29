(function(){

	var myMarker = null;
	var venue1;
	var map;
	var favorited = [];
	var currentEvent;
	var myLatLng = {lat: 0, lng: 0};
	var venueLatLng;


	var directionsDisplay;
	var directionsService;

	// Initial map on page

	function initialize()
	{
		directionsService = new google.maps.DirectionsService;
		directionsDisplay = new google.maps.DirectionsRenderer;
		var mapOpt = {
			center:new google.maps.LatLng(37.779657, -122.418778),
			zoom:10,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById("googleMap"),mapOpt);
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('right_panel'));
		var onClickHandler = function() {
			$('#right_panel').css('background', 'white');
			calculateAndDisplayRoute(directionsService, directionsDisplay);
		};
		document.getElementById('get_directions').addEventListener('click', onClickHandler);

	}
	

	function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	// Provide start and end direction
		var start = myLatLng;
		var end = venueLatLng;
		directionsService.route({
	          origin: start,
	          destination: end,
	          travelMode: 'WALKING'
	        }, function(response, status) {
	          if (status === 'OK') {
	            directionsDisplay.setDirections(response);
	          } else {
	            window.alert('Directions request failed due to ' + status);
	          }
	        });
	      }


	google.maps.event.addDomListener(window, 'load', initialize);



	// <!-- Make the request to GeoLocations -->

	// On document ready, do the following
		$(document).ready(function(){

			$('#favorited').click(function() {
				var $this = $(this);
// $this will contain a reference to the checkbox   
				if ($this.is(':checked')) {
				// the checkbox was checked
				// Save event ID to database
					favorited.push(currentEvent);
					console.log('list of favorites' + favorited);
				}
				else {
				// the checkbox was unchecked
				// Delete event ID to database
					favorited.pop();
					console.log('list of favorites' + favorited);
				}
			});



			var bounds = new google.maps.LatLngBounds();
			var markers = [];


	// On user click "Events around me button"
			$('#NextButton').click(function(){
	//	clear checkbox
				$('#favorited').prop('checked', false);

	//clear markers

				if(myMarker){
					console.log(myMarker);
					myMarker.setMap(null);
				}
				// venue1.setMap(null);
				// google.maps.event.addDomListener(window, 'load', initialize);

				// get user location
				console.log('hello');
				var userLocationURL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDSV4vD0VAxAlvUua3gv-2zPQgBFUMAZdc';
				$.post(userLocationURL, function(myLocation){
					// Pull lat and lng out of the location
					myLatLng['lat'] = myLocation.location.lat;
					myLatLng['lng'] = myLocation.location.lng;

					// Center on my location, and Drop Pin
					map.setCenter(myLatLng);
					var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
					
					myMarker = new google.maps.Marker({
						position: myLatLng,
						title:"You're Here!",
						icon:image
					});

					// map = initialize();
					// Drop flag on current user location
					myMarker.setMap(map);
					console.log(myMarker);
					bounds.extend(myMarker.getPosition());
					map.fitBounds(bounds);
					map.setZoom(14);

	//Now get event from API. Should extract event name, event venue, event time

					var event_lat = 0;
					var event_lng = 0;
					var venueID;
					var eventQueryURL;
					if($('#isFreeSelected').prop('checked')) {
						eventQueryURL = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.within=7mi&location.latitude='+myLatLng['lat']+'&location.longitude='+myLatLng['lng']+'&categories=103,110,113,105,104,111,116,106,119,118&price=free&start_date.keyword=this_week&token=Q37ZUKDAULQQVUGTPQUW';
					} else {
						eventQueryURL = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.within=7mi&location.latitude='+myLatLng['lat']+'&location.longitude='+myLatLng['lng']+'&categories=103,110,113,105,104,111,116,106,119,118&price=paid&start_date.keyword=this_week&token=Q37ZUKDAULQQVUGTPQUW';
					}

					$.get(eventQueryURL, function(eventObject) {
						var num_of_events = eventObject['events'].length;
						var rand = Math.floor(Math.random() * num_of_events);
						while(eventObject['events'][rand]['venue_id'] == null){
							rand = Math.floor(Math.random() * num_of_events);
						}
						eventChosen = eventObject['events'][rand];
						currentEvent = eventChosen;
						eventName = eventChosen['name']['text'];
						eventDescription = eventChosen['description']['text'];
						eventLogo = eventChosen['logo']['url'];
// put logo into
						$("#left").html("<img src="+eventLogo+">");
						// console.log(eventChosen);
						console.log('event name:'+eventName);
						// console.log('event description'+eventDescription);
						venueID = eventChosen['venue_id'];

						var venueQueryURL = 'https://www.eventbriteapi.com/v3/venues/'+venueID+'/?token=Q37ZUKDAULQQVUGTPQUW';
						// var venue1lat;
						// var venue1lng;
						// var venueName;

// Now get venue from API

						$.get(venueQueryURL, function(venueObject) {
							// map = null;
							// console.log(venueObject);
							venue1lat = parseFloat(venueObject['latitude']);
							venue1lng = parseFloat(venueObject['longitude']);
							venueName = venueObject['name'];
							venueAddress = venueObject['address']['localized_address_display'];
							venueLatLng = {lat: venue1lat, lng: venue1lng};

							if(venue1){
								venue1.setMap(null);	
							}
	// Drop pin on 

							venue1 = new google.maps.Marker({
							    position:venueLatLng,
							    animation:google.maps.Animation.DROP,
							    title:"Venue 1"
							});
							venue1.setMap(map);
							bounds.extend(venue1.getPosition());
							map.fitBounds(bounds);

	// Set information about the event
							
							var nameString = '<h4>'+eventName+'</h4>';
							var contentString = eventDescription;
							var infoWindowString = nameString + venueAddress;

							$("#middle").html(infoWindowString);							
							$('#bottom').css('border', '1px white solid');
							$("#eventDescription").html(contentString);
	// On click, do the following:
	// Show address
	// On side bar, show directions to it
							google.maps.event.addListener(venue1, 'click', function() {
								infowindow.open(map,venue1);
							});


						}, 'json'); //close bracket for eventbrite venue get



					}, 'json'); // close bracket for eventbrite event get




				}, 'json'); //Close bracket for post (get user location)



			}); //Close bracket for "events around me button"


		}); //Close bracket on document ready

})(document);