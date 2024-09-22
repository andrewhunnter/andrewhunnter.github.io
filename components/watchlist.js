const API_KEY = 'BZBFZFAOB610C5PJ'; // Replace with your actual API key

async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data['Note']) {
            throw new Error('Rate limit exceeded. Please wait and try again later.');
        }

        if (data['Error Message']) {
            throw new Error(data['Error Message']);
        }

        const timeSeries = data['Time Series (Daily)'];
        if (!timeSeries) {
            throw new Error('No data available for the symbol: ' + symbol);
        }

        const dates = Object.keys(timeSeries).slice(0, 7);
        const closingPrices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

        return { dates, closingPrices };
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error.message);
        return null;
    }
}

async function createChart(company) {
    const chartContainer = document.getElementById(`chart-${company}`);
    
    if (!chartContainer) {
        console.error(`Chart container for ${company} not found`);
        return;
    }

    // Set dimensions for the chart canvas
    chartContainer.style.height = '300px';  
    chartContainer.style.width = '100%';  // Changed to 100% for responsiveness

    const data = await fetchStockData(company);
    if (!data) {
        chartContainer.innerHTML = 'Failed to load chart data';
        return;
    }

    const ctx = chartContainer.getContext('2d');

    // Create a gradient for the line
    const gradient = ctx.createLinearGradient(0, 0, chartContainer.width, 0);
    gradient.addColorStop(0, 'purple');
    gradient.addColorStop(1, 'orange');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates.reverse(),
            datasets: [{
                label: 'Closing Price',
                data: data.closingPrices.reverse(),
                borderColor: gradient,
                borderWidth: 6,  // Increased line thickness
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    console.log(`Chart created for ${company}`);
}

document.addEventListener('DOMContentLoaded', async () => {
    const companies = ['NVDA', 'IONQ', 'COST'];
    for (const company of companies) {
        await createChart(company);
    }
});