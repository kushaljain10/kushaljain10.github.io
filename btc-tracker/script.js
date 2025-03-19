let chart;
let currentTimeRange = "7d"; // Default time range

async function fetchBitcoinData() {
  try {
    // Fetch current price data from Binance
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
    );
    const data = await response.json();

    const price = parseFloat(data.lastPrice);
    const change = parseFloat(data.priceChangePercent);

    updatePriceDisplay(price, change);

    // Fetch historical data based on selected time range
    await updateChartData();

    // Update last update time
    const now = new Date();
    document.getElementById(
      "lastUpdate"
    ).textContent = `Last updated: ${now.toLocaleTimeString()}`;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function updateChartData() {
  const timeRangeParams = {
    "1h": { interval: "1m", limit: 60 },
    "24h": { interval: "15m", limit: 96 },
    "7d": { interval: "1h", limit: 168 },
    "30d": { interval: "4h", limit: 180 },
    "1y": { interval: "1d", limit: 365 },
  };

  const params = timeRangeParams[currentTimeRange];
  const historyResponse = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${params.interval}&limit=${params.limit}`
  );

  if (!historyResponse.ok) {
    throw new Error(`HTTP error! status: ${historyResponse.status}`);
  }

  const historyData = await historyResponse.json();

  // Convert Binance data format to match our existing chart format
  const prices = historyData.map((item) => [
    item[0], // timestamp
    parseFloat(item[4]), // closing price
  ]);

  updateChart(prices);
}

function updatePriceDisplay(price, change) {
  const priceElement = document.getElementById("btcPrice");
  const changeElement = document.getElementById("priceChange");

  priceElement.textContent = `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  changeElement.textContent = `24h Change: ${change.toFixed(2)}%`;

  // Add color class based on price change
  changeElement.className = "price-change";
  if (change > 0) {
    changeElement.classList.add("positive");
  } else if (change < 0) {
    changeElement.classList.add("negative");
  }
}

function updateChart(priceData) {
  const ctx = document.getElementById("priceChart").getContext("2d");

  const labels = priceData.map((item) => {
    const date = new Date(item[0]);
    if (currentTimeRange === "1h") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (currentTimeRange === "24h") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  });

  const prices = priceData.map((item) => item[1]);

  if (chart) {
    chart.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(247, 147, 26, 0.2)");
  gradient.addColorStop(1, "rgba(247, 147, 26, 0)");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Bitcoin Price (USD)",
          data: prices,
          borderColor: "#f7931a",
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 20,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#1a1f2c",
          bodyColor: "#1a1f2c",
          borderColor: "#f7931a",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `$${context.parsed.y.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            color: "#a0aec0",
            maxTicksLimit: 8,
            font: {
              size: 11,
            },
          },
        },
        y: {
          display: true,
          position: "right",
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#a0aec0",
            callback: function (value) {
              return "$" + value.toLocaleString();
            },
            font: {
              size: 11,
            },
          },
        },
      },
    },
  });
}

// Initial fetch
fetchBitcoinData();

// Update more frequently (every 15 seconds)
setInterval(fetchBitcoinData, 15000);

// Add event listeners for time range buttons
document.querySelectorAll(".time-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    // Update active button
    document
      .querySelectorAll(".time-btn")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Update time range and fetch new data
    currentTimeRange = button.dataset.range;
    await updateChartData();
  });
});
