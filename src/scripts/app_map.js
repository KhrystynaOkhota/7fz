// Створюємо глобальну функцію-ініціалізатор для Google Maps
window.initializeMap = function () {
    var element = document.getElementById('map');

    // Захист від помилок, якщо карти немає на сторінці
    if (!element) return;

    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error("Google Maps API не завантажився.");
        return;
    }

    var options = {
        zoom: 15,
        center: { lat: 50.47253296158417, lng: 30.443476447314264 },
        disableDefaultUI: false,
        scrollwheel: false,
        styles: [
            { "elementType": "geometry", "stylers": [{ "color": "#F4F4F4" }] },
            { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#F4F4F4" }] },
            { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#dddee2" }] },
            { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ccd4db" }] },
            { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#ccd4db" }] },
            { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#cad2d8" }] },
            { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
            { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }
        ]
    };

    var myMap = new google.maps.Map(element, options);
    var sharedInfoWindow = new google.maps.InfoWindow();

    var markers = [
        {
            coordinates: { lat: 50.47253296158417, lng: 30.443476447314264 },
            image: "assets/img/pin.png",
            info: "<div class='map-info'><h4>test</h4><div>test</div><a href='tel:354678'>346577ijhgfv</a></div>"
        }
    ];

    function addMarker(properties) {
        var markerOptions = {
            position: properties.coordinates,
            map: myMap
        };

        if (properties.image) {
            markerOptions.icon = properties.image;
        }

        var marker = new google.maps.Marker(markerOptions);

        if (properties.info) {
            marker.addListener('click', function () {
                sharedInfoWindow.setContent(properties.info);
                sharedInfoWindow.open(myMap, marker);
            });
        }
    }

    markers.forEach(function (markerData) {
        addMarker(markerData);
    });
};

// Безпечний місток, який викликає Google Maps при завантаженні
window.initMapBridge = function () {
    // Якщо jQuery вже завантажив DOM і наша функція готова — запускаємо
    if (typeof window.initializeMap === 'function') {
        window.initializeMap();
    } else {
        // Якщо Google Maps прилетів швидше, ніж виконався наш JS, чекаємо готовності сторінки
        jQuery(function ($) {
            if (typeof window.initializeMap === 'function') {
                window.initializeMap();
            }
        });
    }
};