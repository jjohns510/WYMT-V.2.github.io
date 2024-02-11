// Prices for each category
const prices = {
  hsd: 13,
  vid: 25,
  xm: 20,
  xfi: 10,
  srw: 20
};

// Initial sales counters
let salesCounters = {
  hsd: 0,
  vid: 0,
  xm: 0,
  xfi: 0,
  srw: 0
};

// Function to animate the counter
function animateCounter(counterElement) {
  counterElement.classList.add('counter-animated');
  counterElement.addEventListener('animationend', () => {
    counterElement.classList.remove('counter-animated');
  });
}

// Function to update the counter for a category
function updateCounter(category, change) {
  // Update the counter for a category
  salesCounters[category] = Math.max(0, salesCounters[category] + change);
  
  // Update the display
  const counterElement = document.getElementById(`${category}-counter`);
  counterElement.textContent = salesCounters[category];
  animateCounter(counterElement); // Animate the counter

  // Recalculate and update the total sales and chart
  updateTotalSales();
  updateChart();
}

// Function to reset all counters to zero
function resetCounters() {
  for (const category in salesCounters) {
    salesCounters[category] = 0;
    const counterElement = document.getElementById(`${category}-counter`);
    counterElement.textContent = '0';
    animateCounter(counterElement); // Animate the counter
  }
  updateTotalSales();
  updateChart();
}

// Function to calculate and update the total sales amount
function updateTotalSales() {
  let total = 0;
  for (const category in salesCounters) {
    total += salesCounters[category] * prices[category];
  }
  document.getElementById('total-amount').textContent = total.toFixed(2);
}

// Initialize chart variables
let salesChart;
const chartColors = {
  hsd: '#ff6384',
  vid: '#36a2eb',
  xm: '#cc65fe',
  xfi: '#ffce56',
  srw: '#4bc0c0'
};

// Function to initialize the pie chart
function initializeChart() {
  const ctx = document.getElementById('sales-chart').getContext('2d');
  salesChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(prices),
      datasets: [{
        data: Object.keys(salesCounters).map(key => salesCounters[key] * prices[key]),
        backgroundColor: Object.values(chartColors)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                let value = salesCounters[label.toLowerCase()] * prices[label.toLowerCase()];
                label += ': $' + value.toFixed(2);
              }
              return label;
            }
          }
        },
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Sales Distribution'
        }
      }
    }
  });
}

// Function to update the pie chart with current sales data
function updateChart() {
  if (salesChart) {
    salesChart.data.datasets[0].data = Object.keys(salesCounters).map(key => salesCounters[key] * prices[key]);
    salesChart.update();
  }
}

// Event listener for DOM content loaded to initialize the chart and update totals
document.addEventListener('DOMContentLoaded', () => {
  initializeChart();
  updateTotalSales();
});
