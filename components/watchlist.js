const API_KEY = 'BZBFZFAOB610C5PJ'; // Replace with your actual API key
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

function getCachedData(symbol) {
    const cachedData = localStorage.getItem(symbol);
    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
            console.log(`Using cached data for ${symbol}`);
            return data;
        }
    }
    return null;
}

function setCachedData(symbol, data) {
    const cacheItem = {
        timestamp: Date.now(),
        data: data
    };
    localStorage.setItem(symbol, JSON.stringify(cacheItem));
}

async function fetchStockData(symbol) {
    // Check cache first
    const cachedData = getCachedData(symbol);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();

        console.log('API Response:', data);  // Log the full response for debugging

        if (data['Note']) {
            throw new Error('Rate limit exceeded. Please wait and try again later.');
        }

        if (data['Error Message']) {
            throw new Error(data['Error Message']);
        }

        const globalQuote = data['Global Quote'];
        if (!globalQuote) {
            throw new Error('No data available for the symbol: ' + symbol);
        }

        // Extract the latest price
        const price = parseFloat(globalQuote['05. price']);
        const result = [price]; // Return as an array to maintain compatibility with the chart

        // Cache the result
        setCachedData(symbol, result);

        return result;
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

    // Ensure the container has sufficient height and width
    chartContainer.style.height = '200px';  // Set a height for canvas
    chartContainer.style.width = '400px';   // Set a width for canvas

    const data = await fetchStockData(company);
    if (!data) {
        chartContainer.innerHTML = 'Failed to load chart data';
        return;
    }

    const ctx = chartContainer.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Current Price'],
            datasets: [{
                label: 'Stock Price',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
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

// Create charts for all companies
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded, starting chart creation');
    const companies = ['NVDA', 'IONQ', 'COST'];
    for (const company of companies) {
        await createChart(company);
    }
    console.log('All charts creation attempts completed');
});