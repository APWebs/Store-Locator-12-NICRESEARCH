var stores = [
    { lat: 15.15434472863961, lng: 120.59618407957196, name: "312 1st Street Store", description: "A wide variety of essentials.", image: "images/placeholder1.jpg" },
    { lat: 15.15380917697232, lng: 120.59653363524617, name: "317 J Valdez Ave", description: "Groceries and more.", image: "images/placeholder2.jpg" },
    { lat: 15.153308588036433, lng: 120.59687568187331, name: "Mianroa Store", description: "Local goods and products.", image: "images/placeholder3.jpg" },
    { lat: 15.15358099908826, lng: 120.59747531745523, name: "Cely's Carenderia and Indian Food", description: "Dine-in and takeout options.", image: "images/placeholder4.jpg" },
    { lat: 15.153266335172741, 120.5954253587857, name: "Astoria Ave", description: "Essentials and more.", image: "images/placeholder5.jpg" },
    { lat: 15.15292724150735, lng: 120.59507195010993, name: "Jayson Store", description: "Local delicacies and snacks.", image: "images/placeholder6.jpg" },
    // Add more stores similarly
];

stores.forEach(function(store) {
    var marker = L.marker([store.lat, store.lng]).addTo(map);
    var popupContent = `<b>${store.name}</b><br>${store.description}<br>
                        <img src="${store.image}" alt="${store.name}" style="width: 100%; height: auto;"><br>
                        <button onclick="showMoreInfo('${store.description}', '${store.image}')">More Information</button>
                        <button onclick="getDirections(${store.lng}, ${store.lat})">Get Directions</button>`;
    marker.bindPopup(popupContent);
});

function getDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    var R = 6371; // km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function updateSearchResults(filter) {
    var resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'block';

    var filteredStores = stores.filter(store => store.name.toLowerCase().includes(filter));
    filteredStores.sort((a, b) => getDistance(theoreticalLocation[0], theoreticalLocation[1], a.lat, a.lng) - getDistance(theoreticalLocation[0], theoreticalLocation[1], b.lat, b.lng));

    filteredStores.slice(0, 3).forEach(store => {
        var li = document.createElement('li');
        li.textContent = store.name + " - " + Math.round(getDistance(theoreticalLocation[0], theoreticalLocation[1], store.lat, store.lng) * 1000) + "m";
        li.onclick = function() {
            map.setView([store.lat, store.lng], 17);
            showMoreInfo(store.description, store.image);
        };
        resultsContainer.appendChild(li);
    });
}

function getDirections(endLng, endLat) {
    var start = theoreticalLocation;
    var url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624873b608f1a8de44e2846eceed55bef1e7&start=${start[1]},${start[0]}&end=${endLng},${endLat}`;

    fetch(url).then(response => response.json()).then(data => {
        var coords = data.features[0].geometry.coordinates;
        var latlngs = coords.map(coord => [coord[1], coord[0]]);
        L.polyline(latlngs, {color: 'blue'}).addTo(map);
        map.fitBounds(latlngs);
    }).catch(error => {
        console.error('Error fetching directions:', error);
        alert('Failed to retrieve directions.');
    });
}

function showMoreInfo(description, image) {
    var infoContent = document.getElementById('info-content');
    infoContent.innerHTML = `<span>${description}</span>
                             <img src="${image}" alt="Store Image" style="max-width: 100%; height: auto;">
                             <p>Additional information about the store...</p>`;
    toggleInfoWindow(true);
}

function toggleInfoWindow(open) {
    var infoWindow = document.getElementById('info-window');
    var toggleButton = document.querySelector('.toggle-button');
    if (open) {
        infoWindow.style.transform = 'translateY(0)';
        toggleButton.innerHTML = '&#x25BC;'; // Change to down arrow when open
    } else {
        infoWindow.style.transform = 'translateY(100%)';
        toggleButton.innerHTML = '&#x25B2;'; // Change to up arrow when closed
    }
}
