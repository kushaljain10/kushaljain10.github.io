document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
});

function updateDashboard() {
  const date = document.getElementById("date-filter").value;
  fetchData()
    .then((data) => {
      console.log(data);
      const filteredData = filterDataByDate(data, date);
      updateMetrics(filteredData);
      updateCharts(filteredData);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function fetchData() {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(
    "https://api.retool.com/v1/workflows/a6336eab-ca42-43a3-ab6f-b62bd423ad70/startTrigger?workflowApiKey=retool_wk_be69238152c6403abfa6d150249cb96a",
    requestOptions
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  });
}

function filterDataByDate(data, date) {
  const filteredData = data.data.filter((entry) => entry.Date === date);
  if (filteredData.length === 0) {
    return data.data; // if no exact match, return all data
  }
  return filteredData;
}

function updateMetrics(data) {
  const latest = data[0];
  const previous = data[1];

  document.getElementById("total-installs-value").textContent =
    latest.total_installs;
  document.getElementById("total-installs-increase").textContent = `+${
    latest.total_installs - previous.total_installs
  }`;

  document.getElementById("total-onboarded-users-value").textContent =
    latest.total_onboarded_users;
  document.getElementById("total-onboarded-users-increase").textContent = `+${
    latest.total_onboarded_users - previous.total_onboarded_users
  }`;

  document.getElementById("total-new-installs-value").textContent =
    latest.total_new_installs;
  document.getElementById("total-new-installs-increase").textContent = `+${
    latest.total_new_installs - previous.total_new_installs
  }`;
}

function updateCharts(data) {
  const latest = data[0];

  const totalInstallsCtx = document
    .getElementById("total-installs-pie")
    .getContext("2d");
  new Chart(totalInstallsCtx, {
    type: "pie",
    data: {
      labels: ["iOS", "Android"],
      datasets: [
        {
          data: [latest.ios_total_installs, latest.android_total_installs],
          backgroundColor: ["#FF6384", "#36A2EB"],
        },
      ],
    },
  });

  const totalNewInstallsCtx = document
    .getElementById("total-new-installs-pie")
    .getContext("2d");
  new Chart(totalNewInstallsCtx, {
    type: "pie",
    data: {
      labels: ["iOS", "Android"],
      datasets: [
        {
          data: [
            latest.ios_new_installs_total,
            latest.android_new_installs_total,
          ],
          backgroundColor: ["#FF6384", "#36A2EB"],
        },
      ],
    },
  });

  const onboardedUsersCtx = document
    .getElementById("onboarded-users-pie")
    .getContext("2d");
  new Chart(onboardedUsersCtx, {
    type: "pie",
    data: {
      labels: ["iOS", "Android"],
      datasets: [
        {
          data: [
            latest.ios_onboarded_users_total,
            latest.android_onboarded_users_total,
          ],
          backgroundColor: ["#FF6384", "#36A2EB"],
        },
      ],
    },
  });

  const dauZoV1Ctx = document.getElementById("dau-zo-v1-line").getContext("2d");
  new Chart(dauZoV1Ctx, {
    type: "line",
    data: {
      labels: data.map((entry) => entry.Date),
      datasets: [
        {
          label: "iOS",
          data: data.map((entry) => entry.ios_dau_zo_v2_only),
          borderColor: "#FF6384",
          fill: false,
        },
        {
          label: "Android",
          data: data.map((entry) => entry.android_dau_zo_v2_only),
          borderColor: "#36A2EB",
          fill: false,
        },
      ],
    },
  });

  const dauZoV1V2Ctx = document
    .getElementById("dau-zo-v1-v2-line")
    .getContext("2d");
  new Chart(dauZoV1V2Ctx, {
    type: "line",
    data: {
      labels: data.map((entry) => entry.Date),
      datasets: [
        {
          label: "iOS",
          data: data.map((entry) => entry.ios_dau_zo_v1_and_v2),
          borderColor: "#FF6384",
          fill: false,
        },
        {
          label: "Android",
          data: data.map((entry) => entry.android_dau_zo_v1_and_v2),
          borderColor: "#36A2EB",
          fill: false,
        },
      ],
    },
  });

  const mauZoV1Ctx = document.getElementById("mau-zo-v1-line").getContext("2d");
  new Chart(mauZoV1Ctx, {
    type: "line",
    data: {
      labels: data.map((entry) => entry.Date),
      datasets: [
        {
          label: "iOS",
          data: data.map((entry) => entry.ios_mau_zo_v2_only),
          borderColor: "#FF6384",
          fill: false,
        },
        {
          label: "Android",
          data: data.map((entry) => entry.android_mau_zo_v2_only),
          borderColor: "#36A2EB",
          fill: false,
        },
      ],
    },
  });

  const mauZoV1V2Ctx = document
    .getElementById("mau-zo-v1-v2-line")
    .getContext("2d");
  new Chart(mauZoV1V2Ctx, {
    type: "line",
    data: {
      labels: data.map((entry) => entry.Date),
      datasets: [
        {
          label: "iOS",
          data: data.map((entry) => entry.ios_mau_zo_v1_and_v2),
          borderColor: "#FF6384",
          fill: false,
        },
        {
          label: "Android",
          data: data.map((entry) => entry.android_mau_zo_v1_and_v2),
          borderColor: "#36A2EB",
          fill: false,
        },
      ],
    },
  });
}
