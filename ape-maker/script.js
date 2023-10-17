document
  .getElementById("fileInput")
  .addEventListener("change", async function (e) {
    document.getElementById("introContainer").style.display = "none";
    const file = e.target.files[0];

    const preview = document.getElementById("imagePreview");
    const skinTypeDropdown = document.getElementById("skinType");
    // const accessoryDropdown = document.getElementById("accessory");

    generateAccessoryGrid();

    const downloadBtn = document.getElementById("downloadBtn");

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      // skinTypeDropdown.style.display = "inline-block";
      // document.getElementById("skinTypeLabel").style.display = "block";
      // accessoryDropdown.style.display = "inline-block";
      document.getElementById("preview").style.display = "flex";
      document.getElementById("customisation").style.display = "block";
      downloadBtn.style.display = "inline-block";
      document.getElementById("uploadBtn2").style.display = "inline-block";
    };
    reader.readAsDataURL(file);

    // Hide the canvas when a new image is uploaded
    const canvas = document.getElementById("canvas");
    canvas.style.display = "none";
    // preview.style.display = "block";
  });

document
  .getElementById("skinType")
  .addEventListener("change", async function (e) {
    generateAccessoryGrid();
  });

async function addAccessory(accessory, skinType) {
  var imgURL = "";
  if (accessory == "none") {
    imgURL = `images/none.png`; // Replace with actual path
  } else {
    imgURL = `images/${skinType} - ${accessory}.png`; // Replace with actual path
  }
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const preview = document.getElementById("imagePreview");

  const uploadedImg = new Image();
  uploadedImg.src = preview.src;
  await new Promise((r) => (uploadedImg.onload = r));

  canvas.width = uploadedImg.width;
  canvas.height = uploadedImg.height;
  ctx.drawImage(uploadedImg, 0, 0);

  const accessoryImg = new Image();
  accessoryImg.src = imgURL;
  await new Promise((r) => (accessoryImg.onload = r));

  // Calculate the scale ratio
  const scaleRatio = uploadedImg.width / accessoryImg.width;

  // Calculate the y-coordinate to align the bottom of both images
  const yCoordinate = uploadedImg.height - accessoryImg.height * scaleRatio;

  // Draw the accessory image scaled to the uploaded image's width and aligned at the bottom
  ctx.drawImage(
    accessoryImg,
    0,
    yCoordinate,
    accessoryImg.width * scaleRatio,
    accessoryImg.height * scaleRatio
  );

  preview.style.display = "none";
  canvas.style.display = "block";
}

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
  const canvas = document.getElementById("canvas");
  const link = document.createElement("a");
  link.href = canvas.toDataURL();
  link.download = "Ape.png";
  link.click();
});

function uploadImage() {
  document.getElementById("fileInput").click();
}

function selectAccessory(accessory) {
  // Deselect previously selected accessory
  const selected = document.querySelector(".accessory-grid img.selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // Select clicked accessory
  const img = document.querySelector(`.accessory-grid img[alt="${accessory}"]`);
  img.classList.add("selected");

  // Update overlay
  const skinType = document.getElementById("skinType").value;
  addAccessory(accessory, skinType);
}

function generateAccessoryGrid() {
  const accessoryTypes = [
    "Plain White Coffee Mug",
    "Beer Mug",
    "Champagne",
    "Beer Bottle",
    "Red Wine",
    "Cigar",
    "Cigarette",
    "Marijuana Joint",
    "Pipe",
    "Mars",
    "Light Saber",
    "Peace Sign",
    "Vulcan Salute",
  ];
  const accessoryGrid = document.getElementById("accessoryGrid");
  accessoryGrid.innerHTML = "";
  const selectedSkin = document.getElementById("skinType").value;
  appendNone();
  accessoryTypes.forEach((accessory) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = `images/${selectedSkin + " - " + accessory}.png`; // Replace with actual image paths
    img.alt = accessory;
    img.title = accessory;
    img.onclick = () => selectAccessory(accessory);
    // const p = document.createElement("p");
    // p.innerHTML = accessory;
    div.appendChild(img);
    // div.appendChild(p);
    accessoryGrid.appendChild(div);
    accessoryGrid.style.display = "flex";
  });
  setTimeout(() => {
    const firstImage = accessoryGrid.querySelector("img");
    if (firstImage) {
      firstImage.click();
    }
  }, 250);
}

function appendNone() {
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.src = `images/none.png`; // Replace with actual image paths
  img.alt = "none";
  img.title = "none";
  img.onclick = () => selectAccessory("none");
  div.appendChild(img);
  accessoryGrid.appendChild(div);
}

async function readJsonFile(filePath) {
  let response = await fetch(filePath);
  if (response.ok) {
    let jsonData = await response.json();
    return jsonData;
  } else {
    console.error("Network response was not ok:", response.statusText);
    return null;
  }
}

function getFurTraitValue(id, jsonData) {
  for (let item of jsonData) {
    if (item.id === id.toString()) {
      let ipfsUrl = item.metadata.image;
      let attributes = item.metadata.attributes;
      for (let attribute of attributes) {
        if (attribute.trait_type === "Fur") {
          return [attribute.value, ipfsUrl];
        }
      }
    }
  }
  return null;
}

async function fetchImage(ipfsUrl) {
  let response = await fetch(ipfsUrl);
  if (response.ok) {
    let blob = await response.blob();
    let imageUrl = URL.createObjectURL(blob);
    document.getElementById("imagePreview").src = imageUrl;
  } else {
    console.error("Network response was not ok:", response.statusText);
  }
}

function selectApe() {
  var apeNumber = document.getElementById("apeNumber").value;
  if (apeNumber > 0) {
    readJsonFile("apedata.json").then((jsonData) => {
      let values = getFurTraitValue(apeNumber, jsonData);
      let skinType = values[0];
      let ipfsUrl = values[1];
      ipfsUrl = ipfsUrl.replace("ipfs://", "");
      fetchImage("https://ipfs.io/ipfs/" + ipfsUrl).then(() => {
        document.getElementById("introContainer").style.display = "none";

        const preview = document.getElementById("imagePreview");
        const skinTypeDropdown = document.getElementById("skinType");

        skinTypeDropdown.value = skinType;
        generateAccessoryGrid();

        const downloadBtn = document.getElementById("downloadBtn");
        skinTypeDropdown.style.display = "inline-block";
        document.getElementById("skinTypeLabel").style.display = "block";
        document.getElementById("preview").style.display = "flex";
        document.getElementById("customisation").style.display = "block";
        document.getElementById("apeNumber2").value = apeNumber;
        downloadBtn.style.display = "inline-block";
        // document.getElementById("uploadBtn2").style.display = "inline-block";

        document.getElementById("apeTitle").innerText = "BAYC #" + apeNumber;

        // Hide the canvas when a new image is uploaded
        const canvas = document.getElementById("canvas");
        canvas.style.display = "none";
        // preview.style.display = "block";
      });
    });
  } else {
    document.getElementById("apeNumberError").innerHTML =
      "Please enter a valid Ape #";
  }
}

function updateApe() {
  var apeNumber = document.getElementById("apeNumber2").value;
  if (apeNumber > 0) {
    readJsonFile("apedata.json").then((jsonData) => {
      let values = getFurTraitValue(apeNumber, jsonData);
      let skinType = values[0];
      let ipfsUrl = values[1];
      ipfsUrl = ipfsUrl.replace("ipfs://", "");
      fetchImage("https://ipfs.io/ipfs/" + ipfsUrl).then(() => {
        document.getElementById("introContainer").style.display = "none";

        const preview = document.getElementById("imagePreview");
        const skinTypeDropdown = document.getElementById("skinType");

        skinTypeDropdown.value = skinType;
        generateAccessoryGrid();

        const downloadBtn = document.getElementById("downloadBtn");
        document.getElementById("apeNumber2").value = apeNumber;

        const canvas = document.getElementById("canvas");
        canvas.style.display = "none";

        document.getElementById("apeTitle").innerText = "BAYC #" + apeNumber;
      });
    });
  } else {
    document.getElementById("apeNumber2Error").innerHTML =
      "Please enter a valid Ape #";
  }
}
