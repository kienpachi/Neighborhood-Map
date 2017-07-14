// --------------------- Model -------------------------
// Created list of my favorite locations
var locations = [
    {title: 'Technology Innovation and Entrepreneurship Center', location: {lat: 30.06809583, lng: 31.01957291}, description: 'This is where I currently work as an entrepreneure and a freelancer', img: 'img/TIEC_logo.png'},
    {title: 'Smart Village Mosque', location: {lat: 30.06922395, lng: 31.01958364}, description: 'Here is where I pray', img: 'img/mosuqe.png'},
    {title: 'Microsoft Egypt', location: {lat: 30.07111807, lng: 31.01674989}, description: 'This is where my I used to work after college graduation as a UI UX Developer', img: 'img/Microsoft_logo.png'},
    {title: 'Carrefour Dandy Mega Mall', location: {lat: 30.06322569, lng: 31.02743983}, description: 'One of my favorite places for shopping', img: 'img/Carrefour_logo.png'},
    {title: 'QNB Bank', location: {lat: 30.0623807, lng: 31.02832496}, description: 'That is the bank I currently deal with, pretty good one', img: 'img/QNB-logo.png'},
    {title: 'On The Run', location: {lat: 30.0640521, lng: 31.02562129}, description: 'Best place to get morning coffe and snacks', img: 'img/OntheRun_logo.png'}
];

var filteredLocations = [];
var markers = [];

// --------------------- Google Map --------------------
function initMap() {
    // Create the map centered at a point and set default zoom
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.06608559, lng: 31.02295518},
        zoom: 15
    });
    
    // Creates the marker and push it to the array of markers
    function pushMarker(id, position, title) {
        // Create a marker per location
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            id: id,
            icon: 'img/pin.png'
        });
        // push the marker to the array
        markers.push(marker);
        // Create event listener for it to open the info window for each marker
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
    }
    
    // Generate array of the list of markers based on the given filteredLocations
    for (var i = 0; i < filteredLocations.length; i++) {
        var position = filteredLocations[i].location;
        var title = filteredLocations[i].title;
        // push the marker to my array of markers
        pushMarker(i, position, title);
    }
    
    
    // Create the infowindow i'm going to pop up on the marker
    var largeInfowindow = new google.maps.InfoWindow();
    // assign info window to the clicked marker
    function populateInfoWindow(marker, infowindow) {
        // make sure the marker info window is not opened already
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div class="infowindow"><img src="' + filteredLocations[marker.id].img + '"/><h3>' + marker.title + '</h3><p>' + filteredLocations[marker.id].description + '</p></div>');
            infowindow.open(map, marker);
            marker.setIcon('img/pin-selected.png');
            marker.setAnimation(google.maps.Animation.DROP);
            // make sure the marker is cleared if the infowindow is closed
            infowindow.addListener('closeclick', function () {
                infowindow.setMarker(null);
            }
        );}
    }
}


// ------------------- ViewModel -----------------------
var viewModel = {
    init: function() {
        filteredLocations = locations;
        // on load check the window size for filter collapse
        if ($(window).width() < 600) {
            viewModel.collapse();
        }
        // collapse based on screen size
        $(window).on('resize', function () {
            var windowWidth = $(window).width();
            if (windowWidth < 600) {
                viewModel.collapse();
            }
        });
        // render the list of locations
        viewModel.render();
    },
    toggle: function() {
        $('.locations').toggleClass('collapse');
    },
    collapse: function() {
        $('.locations').addClass('collapse');
    },
    filter: function() {
        // empty the filtered locations to add the new locations
        filteredLocations = [];
        // get the keyword from the input
        // i added the .toLowerCase() so the filter isn't case sensitive
        var keyword = $('#location-name').val().toLowerCase();
        // create my new filtered locations
        for (var i = 0; i < locations.length; i++) {
            // in case the title includes the keyword
            if (locations[i].title.toLowerCase().includes(keyword)) {
                // push that array element to the filtered locations
                filteredLocations.push(locations[i]);
            }
        }
        initMap();
        viewModel.render();
    },
    render: function () {
        // empty the list for rendering
        $('.location-list').empty();
        // push the titles of the filteredLocations
        for (var i = 0; i < filteredLocations.length; i++) {
            var HTMLLocationsList = '<p>' + filteredLocations[i].title + '</p>';
            $('.location-list').append(HTMLLocationsList);
        }
    }
};

viewModel.init();

ko.applyBindings(viewModel);