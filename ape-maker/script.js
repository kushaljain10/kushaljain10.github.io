document
  .getElementById("fileInput")
  .addEventListener("change", async function (e) {
    const file = e.target.files[0];
    // if (file.size > 0) {
    //   document.getElementById("fileInputTitle").style.display = "none";
    //   document.getElementById("fileReinputTitle").style.display = "block";
    // }

    const preview = document.getElementById("imagePreview");
    const skinTypeDropdown = document.getElementById("skinType");
    const accessoryDropdown = document.getElementById("accessory");
    const downloadBtn = document.getElementById("downloadBtn");

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      skinTypeDropdown.style.display = "inline-block";
      accessoryDropdown.style.display = "inline-block";
      downloadBtn.style.display = "inline-block";
    };
    reader.readAsDataURL(file);

    // Hide the canvas when a new image is uploaded
    const canvas = document.getElementById("canvas");
    canvas.style.display = "none";
    // preview.style.display = "block";

    setTimeout(() => {
      addAccessory(
        document.getElementById("accessory").value,
        document.getElementById("skinType").value
      );
    }, 750);
  });

// document.getElementById("skinType").addEventListener("change", function (e) {
// const skinType = e.target.value;
// const accessoryDropdown = document.getElementById("accessory");

// // Clear previous options
// accessoryDropdown.innerHTML = "";

// // Fetch available accessories based on skin type
// const accessories = getAccessories(skinType); // Assume this function returns a list of accessories for the selected skin type

// // Populate the dropdown
// accessories.forEach((accessory) => {
//   const option = document.createElement("option");
//   option.value = accessory;
//   option.textContent = accessory.charAt(0).toUpperCase() + accessory.slice(1); // Capitalize the first letter
//   accessoryDropdown.appendChild(option);
// });
// });

document
  .getElementById("accessory")
  .addEventListener("change", async function (e) {
    const accessory = e.target.value;
    const skinType = document.getElementById("skinType").value;
    addAccessory(accessory, skinType);
  });

document
  .getElementById("skinType")
  .addEventListener("change", async function (e) {
    const skinType = e.target.value;
    const accessory = document.getElementById("accessory").value;
    addAccessory(accessory, skinType);
  });

// document
//   .getElementById("accessory")
//   .addEventListener("change", async function (e) {
//     const accessory = e.target.value;
//     const skinType = document.getElementById("skinType").value;
//     const imgURL = `images/${accessory}.png`; // Replace with actual path
//     const canvas = document.getElementById("canvas");
//     const ctx = canvas.getContext("2d");
//     const preview = document.getElementById("imagePreview");

//     const uploadedImg = new Image();
//     uploadedImg.src = preview.src;
//     await new Promise((r) => (uploadedImg.onload = r));

//     canvas.width = uploadedImg.width;
//     canvas.height = uploadedImg.height;
//     ctx.drawImage(uploadedImg, 0, 0);

//     const accessoryImg = new Image();
//     accessoryImg.src = imgURL;
//     await new Promise((r) => (accessoryImg.onload = r));

//     // Calculate the scale ratio
//     const scaleRatio = uploadedImg.width / accessoryImg.width;

//     // Calculate the y-coordinate to align the bottom of both images
//     const yCoordinate = uploadedImg.height - accessoryImg.height * scaleRatio;

//     // Draw the accessory image scaled to the uploaded image's width and aligned at the bottom
//     ctx.drawImage(
//       accessoryImg,
//       0,
//       yCoordinate,
//       accessoryImg.width * scaleRatio,
//       accessoryImg.height * scaleRatio
//     );

//     const downloadBtn = document.getElementById("downloadBtn");
//     downloadBtn.addEventListener("click", () => {
//       const link = document.createElement("a");
//       link.href = canvas.toDataURL();
//       link.download = "Ape.png";
//       link.click();
//     });

//     preview.style.display = "none";
//     canvas.style.display = "block";
//   });

async function addAccessory(accessory, skinType) {
  // const accessory = e.target.value;
  // const skinType = document.getElementById("skinType").value;
  const imgURL = `images/${skinType} - ${accessory}.png`; // Replace with actual path
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

// document.getElementById("downloadBtn").addEventListener("click", function () {
//   const preview = document.getElementById("imagePreview");
//   const link = document.createElement("a");
//   link.href = preview.src;
//   link.download = "Ape.png";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// });

// // Placeholder function, should actually fetch the real accessories based on skin type
// function getAccessories(skinType) {
//   return ["hand1", "hand2", "hand3"]; // Example, replace this with actual logic
// }

function uploadImage() {
  document.getElementById("fileInput").click();
}
