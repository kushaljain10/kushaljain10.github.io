const bgColors = {
  Purple: { color: "6f5e70", tolerance: 12 },
  Yellow: { color: "e4e4a7", tolerance: 12 },
  Orange: { color: "ef952e", tolerance: 50 },
  Aquamarine: { color: "15e6b7", tolerance: 50 },
  "Army Green": { color: "727234", tolerance: 12 },
  Blue: { color: "a2e5f4", tolerance: 50 },
  "New Punk Blue": { color: "3a677e", tolerance: 12 },
  Gray: { color: "cbccce", tolerance: 12 },
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function colorMatch(r1, g1, b1, r2, g2, b2, tolerance) {
  return (
    Math.abs(r1 - r2) <= tolerance &&
    Math.abs(g1 - g2) <= tolerance &&
    Math.abs(b1 - b2) <= tolerance
  );
}

function actuallyRemoveColor(img, ctx, colorInput, canvas, tolerance) {
  const cropPercent = 1;
  const cropWidth = img.width * (cropPercent / 100);
  const cropHeight = img.height * (cropPercent / 100);
  const newWidth = img.width - 2 * cropWidth;
  const newHeight = img.height - 2 * cropHeight;

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.drawImage(
    img,
    cropWidth,
    cropHeight,
    newWidth,
    newHeight,
    0,
    0,
    newWidth,
    newHeight
  );

  // canvas.width = img.width;
  // canvas.height = img.height;

  // ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const color = hexToRgb(colorInput);

  for (let i = 0; i < data.length; i += 4) {
    if (
      colorMatch(
        data[i],
        data[i + 1],
        data[i + 2],
        color.r,
        color.g,
        color.b,
        tolerance
      )
    ) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  // document.getElementById("output").src = canvas.toDataURL();
  return canvas.toDataURL();
}

function removeColor(ogImg, color) {
  // const fileInput = document.getElementById("upload");
  // const colorInput = document.getElementById("color").value;
  const colorInput = bgColors[color].color;
  const canvas = document.getElementById("canvas2");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  var output;
  const tolerance = bgColors[color].tolerance;
  // const tolerance = 12; // You can adjust this value to fit your needs

  // img.onload = ;

  // img.src = URL.createObjectURL(fileInput.files[0]);
  img.src = ogImg;
  output = actuallyRemoveColor(img, ctx, colorInput, canvas, tolerance);
  return output;
}

document
  .getElementById("fileInput")
  .addEventListener("change", async function (e) {
    document.getElementById("introContainer").style.display = "none";
    const file = e.target.files[0];

    const preview = document.getElementById("imagePreview");
    // const skinTypeDropdown = document.getElementById("skinType");
    // const accessoryDropdown = document.getElementById("accessory");

    generateAccessoryGrid();

    const downloadBtn = document.getElementById("downloadBtn");

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
      // preview.src = removeColor(e.target.result);
      preview.src = e.target.result;
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
  } else if (accessory.slice(0, 6) == "custom") {
    imgURL = `images/${accessory.slice(7)}.png`;
  } else {
    imgURL = `images/${skinType} - ${accessory}.png`; // Replace with actual path
  }
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const preview = document.getElementById("imagePreview");

  const uploadedImg = new Image();
  // uploadedImg.src = removeColor(preview.src);
  // uploadedImg.src = preview.src;

  var apeNumber = document.getElementById("apeNumber").value;
  var backgroundColor = "";
  if (apeNumber > 0) {
    readJsonFile("apedata.json").then((jsonData) => {
      backgroundColor = getBackgroundTraitValue(apeNumber, jsonData);
      // uploadedImg.src = removeColor(preview.src, backgroundColor);
      uploadedImg.src = preview.src;
    });
  }

  await new Promise((r) => (uploadedImg.onload = r));

  canvas.width = uploadedImg.width;
  canvas.height = uploadedImg.height;
  ctx.drawImage(uploadedImg, 0, 0);

  //add tshirt
  const tshirtImg = new Image();
  tshirtImg.src = "images/apefest-india-tshirt.png";
  await new Promise((r) => (tshirtImg.onload = r));

  // Calculate the scale ratio
  const tshirtScaleRatio = uploadedImg.width / tshirtImg.width;

  // Calculate the y-coordinate to align the bottom of both images
  const tshirtYCoordinate =
    uploadedImg.height - tshirtImg.height * tshirtScaleRatio;

  // Draw the accessory image scaled to the uploaded image's width and aligned at the bottom
  ctx.drawImage(
    tshirtImg,
    0,
    tshirtYCoordinate,
    tshirtImg.width * tshirtScaleRatio,
    tshirtImg.height * tshirtScaleRatio
  );

  //add accessory
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
    "none",
    "Plain White Coffee Mug",
    "Beer Mug",
    "Champagne",
    "Beer Bottle",
    "Red Wine",
    "Cigar",
    "Cigarette",
    "Marijuana Joint",
    "Pipe",
    // "Mars",
    // "Light Saber",
    "Peace Sign",
    "Vulcan Salute",
    // "custom-apefest-india-tshirt",
  ];
  const accessoryGrid = document.getElementById("accessoryGrid");
  accessoryGrid.innerHTML = "";
  const selectedSkin = document.getElementById("skinType").value;
  // appendNone();
  accessoryTypes.forEach((accessory) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    if (accessory == "none") {
      img.src = `images/none.png`; // Replace with actual path
    } else if (accessory.slice(0, 6) == "custom") {
      img.src = `images/${accessory.slice(7)}.png`;
    } else {
      img.src = `images/${selectedSkin} - ${accessory}.png`; // Replace with actual path
    }
    // img.src = `images/${selectedSkin + " - " + accessory}.png`; // Replace with actual image paths
    img.alt = accessory;
    img.title = accessory;
    img.onclick = () => selectAccessory(accessory);
    // const p = document.createElement("p");
    // p.innerHTML = accessory;
    div.appendChild(img);
    // div.appendChild(p);
    accessoryGrid.appendChild(div);
  });

  accessoryGrid.style.display = "flex";

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

function getBackgroundTraitValue(id, jsonData) {
  for (let item of jsonData) {
    if (item.id === id.toString()) {
      let attributes = item.metadata.attributes;
      for (let attribute of attributes) {
        if (attribute.trait_type === "Background") {
          return attribute.value;
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
    // document.getElementById("imagePreview").src = "images/RCD-ape.png";
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
