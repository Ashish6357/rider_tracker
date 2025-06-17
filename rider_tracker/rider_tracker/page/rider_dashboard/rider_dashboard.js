frappe.pages['rider-dashboard'].on_page_load = function(wrapper) {
  let page = frappe.ui.make_app_page({
	parent: wrapper,
	title: 'Live Rider Tracking',
	single_column: true
  });

  $(page.body).html(`<div id="map" style="height: 600px;"></div>`);

  // Load leaflet
  const leafletCSS = document.createElement("link");
  leafletCSS.rel = "stylesheet";
  leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(leafletCSS);

  const leafletScript = document.createElement("script");
  leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  leafletScript.onload = () => {
	const map = L.map('map').setView([20.5937, 78.9629], 5);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	  attribution: '&copy; OpenStreetMap contributors'
	}).addTo(map);

	frappe.call({
	  method: "rider_tracker.api.api.get_latest_locations",
	  callback: function(r) {
		const locations = r.message || [];
		locations.forEach(loc => {
		  L.marker([loc.lat, loc.lng]).addTo(map)
			.bindPopup(`<b>${loc.rider}</b><br>${frappe.datetime.str_to_user(loc.timestamp)}`);
		});

		if (locations.length > 0) {
		  map.setView([locations[0].lat, locations[0].lng], 12);
		}
	  }
	});
  };

  document.body.appendChild(leafletScript);
};
