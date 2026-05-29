// Оголошуємо змінну в глобальній області або просто об'єднуємо все в один блок,
// щоб подія window.load мала доступ до функції.
jQuery(function ($) {

  function initializeMap() {
    var element = document.getElementById('map');

    // Захист від помилок у консолі, якщо елемента немає на поточній сторінці
    if (!element) return;

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

    // Створюємо ОДИН загальний екземпляр InfoWindow для всієї карти
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

      // Додаємо вікно з інформацією при кліку
      if (properties.info) {
        marker.addListener('click', function () {
          sharedInfoWindow.setContent(properties.info);
          sharedInfoWindow.open(myMap, marker);
        });
      }
    }

    // Рендеринг маркерів
    markers.forEach(function (markerData) {
      addMarker(markerData);
    });
  }

  $(window).on('load', function () {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
      initializeMap();
    } else {
      console.error("Google Maps API не завантажився. Перевірте підключення скрипта в HTML.");
    }
  });

});