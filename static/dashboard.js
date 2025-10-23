async function loadData() {
  const res = await fetch('/api/listings');
  const data = await res.json();

  // Summary stats
  const avgPrice = (data.reduce((sum, d) => sum + d.price, 0) / data.length).toFixed(0);
  const avgBeds = (data.reduce((sum, d) => sum + d.attributes.bedrooms, 0) / data.length).toFixed(1);
  const avgLand = (data.reduce((sum, d) => {
    const size = parseFloat(d.attributes.land_size.replace(' m²', ''));
    return sum + (isNaN(size) ? 0 : size);
  }, 0) / data.length).toFixed(0);

  document.getElementById('stats').innerHTML = `
    <strong>Average Price:</strong> $${avgPrice}<br>
    <strong>Average Bedrooms:</strong> ${avgBeds}<br>
    <strong>Average Land Size:</strong> ${avgLand} m²
  `;

  // Chart: Price comparison
  const ctx = document.getElementById('priceChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.area_name),
      datasets: [{
        label: 'Price ($)',
        data: data.map(d => d.price),
        backgroundColor: ['#3498db', '#2ecc71']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Property Prices' }
      }
    }
  });

  // Map
  const map = L.map('map').setView([-33.014, 151.670], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  data.forEach(d => {
    const marker = L.marker([d.coordinates.latitude, d.coordinates.longitude]).addTo(map);
    marker.bindPopup(`<strong>${d.area_name}</strong><br>Price: $${d.price}<br>Bedrooms: ${d.attributes.bedrooms}`);
  });
}

loadData();
