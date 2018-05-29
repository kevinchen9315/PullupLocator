let gps = document.getElementById('gps');
let lat = document.getElementById('lat');
let lng = document.getElementById('lng');

function initMap() {
	let map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.7392, lng: -104.9903},
		zoom: 12
	});

	let marker = new google.maps.Marker({
		title: 'Location'
	})

	map.addListener('click', (event) => {
		marker.setPosition(event.latLng)
		marker.setMap(map)
		gps.value=event.latLng
		lat.value=event.latLng.lat()
		lng.value=event.latLng.lng()
	})

	marker.addListener('click', ()=> {
		marker.setMap(null)
		gps.value=null
		lat.value=null
		lng.value=null
	});

}
