// --------------------- Model -------------------------
// Created list of my favorite locations
var locations = [
    {title: 'Technology Innovation and Entrepreneurship Center', location: {lat: 30.06809583, lng: 31.01957291}, description: 'This is where I currently work as an entrepreneure and a freelancer', img: 'img/TIEC_logo.png'},
    {title: 'Smart Village Mosque', location: {lat: 30.06922395, lng: 31.01958364}, description: 'Here is where I pray', img: 'img/mosuqe.png'},
    {title: 'Microsoft Egypt', location: {lat: 30.07111807, lng: 31.01674989}, description: 'This is where my I used to work after college graduation as a UI UX Developer', img: 'img/Microsoft_logo.png'},
    {title: 'Carrefour', location: {lat: 30.06322569, lng: 31.02743983}, description: 'One of my favorite places for shopping', img: 'img/Carrefour_logo.png'},
    {title: 'QNB Bank', location: {lat: 30.0623807, lng: 31.02832496}, description: 'That is the bank I currently deal with, pretty good one', img: 'img/QNB-logo.png'},
    {title: 'On The Run', location: {lat: 30.0640521, lng: 31.02562129}, description: 'Best place to get morning coffe and snacks', img: 'img/OntheRun_logo.png'}
];

var filteredLocations = ko.observableArray([]);
var markers = ko.observableArray([]);

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
    
    // Generate array of the list of markers based on the given locations
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        // push the marker to my array of markers
        pushMarker(i, position, title);
    }
    
    // Create the infowindow i'm going to pop up on the marker
    var largeInfowindow = new google.maps.InfoWindow();
}

// Handle error of displaying the Google map
function mapError() {
    $('.mapError').addClass('display-block');
}

// assign info window to the clicked marker
function populateInfoWindow(marker, infowindow) {
    
    // make sure the marker info window is not opened already
    if (infowindow.marker != marker) {
        // if not, then open it
        infowindow.marker = marker;
        
        // Wikipedia AJAX request
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
        
        var url;
        // handle faild request error
        var wikiRequestTimeout = setTimeout(function() {
            alert("Failed to get wikipedia resources");
        }, 8000);
        
        // run AJAX request to wikipedia
        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            
            success: function(response) {
                // get array of articles in Wiki with my search
                var articleList = response[1];
                // create only 1 article link, that's all I need for this project
                var url = 'http://en.wikipedia.org/wiki/' + articleList[0];
                
                /* since not all the locations I selected with this project has a wikipedia page
                *  I made this funcution to exclude getting undefined results when the AJAX responds
                *  current case scenario (4 out of 6) places has wiki page */
                if(!url.includes('undefined')) {
                    // build the infowindow content
                    infowindow.setContent('<div class="infowindow"><img src="' + locations[marker.id].img + '"/><h3>' + marker.title + '</h3><p>' + locations[marker.id].description + '</p><a href="' + url + '"  target="_blank">' + marker.title + ' <span> Wiki</span></a></div>');
                }
                // otherwise only get the basic information
                else {
                    infowindow.setContent('<div class="infowindow"><img src="' + locations[marker.id].img + '"/><h3>' + marker.title + '</h3><p>' + locations[marker.id].description + '</p></div>');
                }
                // clear the timeout if everything goes well
                clearTimeout(wikiRequestTimeout);
            }
        });
        // the the rest of the infowindow options
        infowindow.open(map, marker);
        marker.setIcon('img/pin-selected.png');
        marker.setAnimation(google.maps.Animation.DROP);
        
        // make sure the marker is cleared if the infowindow is closed
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker(null);
        }
    );}
}


// ------------------- ViewModel -----------------------
var viewModel = {
    filteredLocations: ko.observableArray(locations),
    // bind the filter input with this observable
    keywords: ko.observable(''),
    init: function() {
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
    },
    // toggle the filter menu
    toggle: function() {
        $('.locations').toggleClass('collapse');
    },
    // close the filter menu
    collapse: function() {
        $('.locations').addClass('collapse');
    },
    // triggeres whenever keywords change
    filter: function(value) {
        // create my new filtered locations
        for (var i = 0; i < locations.length; i++) {
            // in case the title includes the keyword
            if (!locations[i].title.toLowerCase().includes(viewModel.keywords().toLowerCase())) {
                // Hide the markers that is not part of the filter search
                markers()[i].setVisible(false);
            } else {
                markers()[i].setVisible(true);
            }
        }
        // empty the filter to add the new locations which are filtered
        viewModel.filteredLocations([]);
        // search through locations for the input keyword
        for(var index in locations) {
            if(locations[index].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                // add them to the observable array filteredLocations
                viewModel.filteredLocations.push(locations[index]);
            }
        }
    },
    // display the marker info when clicking on an item inside the filter list
    info: function(title) {
        var allMarkers = markers();
        // select the marker that has a matching title and open it
        for (var i in allMarkers) {
            if(allMarkers[i].title === title) {
                google.maps.event.trigger(markers()[i], 'click');
            }
        }
    }
};


viewModel.init();

// apply knockout bindings
ko.applyBindings(viewModel);
// triggers the filter function whenever keywords change
viewModel.keywords.subscribe(viewModel.filter);