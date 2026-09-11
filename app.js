// Initialize map with OpenFreeMap basemap
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [-98.5795, 39.8283],
  zoom: 3.5
});

// Add navigation controls
map.addControl(new maplibregl.NavigationControl(), 'top-left');

// Load and add airport layer
map.on('load', () => {
  // Add airport source
  map.addSource('airports', {
    type: 'geojson',
    data: 'data/airports.geojson'
  });

  // Add airport layer
  map.addLayer({
    id: 'airports-layer',
    type: 'circle',
    source: 'airports',
    paint: {
      'circle-radius': 8,
      'circle-color': '#3498db',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  // Add waterfront source
  map.addSource('waterfront', {
    type: 'geojson',
    data: 'data/waterfront.geojson'
  });

  // Add waterfront layer
  map.addLayer({
    id: 'waterfront-layer',
    type: 'circle',
    source: 'waterfront',
    paint: {
      'circle-radius': 8,
      'circle-color': '#16a085',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  // Click handlers for popups
  map.on('click', 'airports-layer', (e) => {
    const props = e.features[0].properties;
    const urls = JSON.parse(props.urls || '[]');
    
    let urlsHtml = '';
    if (urls.length > 0) {
      urlsHtml = '<div class="popup-urls">' + 
        urls.map(url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`).join('') +
        '</div>';
    }
    
    const noteHtml = props.note ? `<div class="popup-note">${props.note}</div>` : '';
    
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <div class="popup-title">${props.name}</div>
        <span class="popup-thesis airport">${props.thesis}</span>
        <div class="popup-why">${props.why}</div>
        ${urlsHtml}
        ${noteHtml}
      `)
      .addTo(map);
  });

  map.on('click', 'waterfront-layer', (e) => {
    const props = e.features[0].properties;
    const urls = JSON.parse(props.urls || '[]');
    
    let urlsHtml = '';
    if (urls.length > 0) {
      urlsHtml = '<div class="popup-urls">' + 
        urls.map(url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`).join('') +
        '</div>';
    }
    
    const riskBadge = props.risk ? `<span class="popup-risk ${props.risk}">Risk: ${props.risk}</span>` : '';
    const noteHtml = props.note ? `<div class="popup-note">${props.note}</div>` : '';
    
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <div class="popup-title">${props.name}</div>
        <span class="popup-thesis waterfront">${props.thesis}</span>
        ${riskBadge}
        <div class="popup-why">${props.why}</div>
        ${urlsHtml}
        ${noteHtml}
      `)
      .addTo(map);
  });

  // Change cursor on hover
  map.on('mouseenter', 'airports-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'airports-layer', () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', 'waterfront-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'waterfront-layer', () => {
    map.getCanvas().style.cursor = '';
  });
});

// Layer toggle controls
document.getElementById('toggle-airports').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  map.setLayoutProperty('airports-layer', 'visibility', visibility);
});

document.getElementById('toggle-waterfront').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  map.setLayoutProperty('waterfront-layer', 'visibility', visibility);
});

// About panel toggle
document.getElementById('about-toggle').addEventListener('click', () => {
  const content = document.getElementById('about-content');
  content.classList.toggle('hidden');
});
