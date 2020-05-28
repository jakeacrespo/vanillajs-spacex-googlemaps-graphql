let content = {
  query: `{
      launchpads {
        id
        name
        details
        location {
          latitude
          longitude
          name
          region
        }
        successful_launches
        status
        vehicles_launched {
          id
          name
          active
        }
        wikipedia
      }
      landpads {
        id
        full_name
        landing_type
        location {
          latitude
          longitude
          name
          region
        }
        status
        successful_landings
        attempted_landings
        details
        wikipedia
      }
    }`,
};
let map = undefined;

function setLaunchesPoints(places) {
  places.data.launchpads.map(x=> {
    const latLng = { lat: x.location.latitude, lng: x.location.longitude };
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: x.name,
    });
    const contentString = `<div class="infobox-content"><h2>${x.name}</h2><p>${x.details}</p><a class="wikipedia-link" href="${x.wikipedia}" target="_blank">Read More on Wikipedia</a></div>`;
    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });
}

function initMap() {
  let body = JSON.stringify(content);
  fetch('https://api.spacex.land/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
    .then(response => response.json())
    .then(data => setLaunchesPoints(data));

  var mapOptions = {
    center: new google.maps.LatLng(
      45.1484444,
      7.9187083
    ),
    zoom: 2,
    minZoom: 2
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
