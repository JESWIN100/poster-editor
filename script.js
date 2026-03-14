const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to 9:16 resolution
canvas.width = 1080;
canvas.height = 1920;

window.onload = () => {
  loadBackground();
};

document.getElementById("generateBtn").addEventListener("click", generatePoster);
document.getElementById("downloadBtn").addEventListener("click", downloadPoster);

function loadBackground() {
  const bg = new Image();
  bg.src = "BackgroundImage.jpeg"; // replace with your poster file name
  bg.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  };
}

function generatePoster() {
  loadBackground();

  const file = document.getElementById("personImage").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const personImg = new Image();
      personImg.src = e.target.result;
      personImg.onload = () => {
        // 📌 Center the image container with portrait ratio
        const photoW = 500;   // width smaller
        const photoH = 600;   // height larger
        const photoX = (canvas.width - photoW) / 2;
        const photoY = 800; // centered vertically, slightly up
        const radius = 30;

        // Draw 3D shadow border frame
        ctx.save();
        ctx.shadowColor = "rgba(128,128,128,0.85)"; // strong black shadow
        ctx.shadowBlur = 25;                 // blur for 3D effect
        ctx.shadowOffsetX = 8;               // slight horizontal offset
        ctx.shadowOffsetY = 8;               // slight vertical offset

        ctx.fillStyle = "rgba(128,128,128,0.85)"; // border color (black)
        ctx.beginPath();
        ctx.roundRect(photoX - 10, photoY - 10, photoW + 20, photoH + 20, radius);
        ctx.fill();
        ctx.restore();

        // Clip and draw the image inside the border
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, radius);
        ctx.clip();
        ctx.drawImage(personImg, photoX, photoY, photoW, photoH);
        ctx.restore();

        // Draw name just below photo
        addName(photoY + photoH + 60);
      };
    };
    reader.readAsDataURL(file);
  } else {
    addName(canvas.height / 2 + 300);
  }
}

function addName(yPosition) {
  const name = document.getElementById("personName").value;
  if (name.trim() !== "") {
    const nameX = canvas.width / 2;
    const nameY = yPosition;

    let fontSize = 38;
    ctx.font = `bold ${fontSize}px "Arial Black", "Impact", "Helvetica", sans-serif`;

    const textWidth = ctx.measureText(name).width + 50;
    const textHeight = fontSize + 25;

    // Grey blurred background box behind name
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(128,128,128,0.85)";
    ctx.fillRect(nameX - textWidth/2, nameY - textHeight/2, textWidth, textHeight);
    ctx.restore();

    ctx.lineWidth = 3;              // thickness of border
    ctx.strokeStyle = "rgba(0,0,0,0.6)";    // black color
    ctx.strokeRect(nameX - textWidth/2, nameY - textHeight/2, textWidth, textHeight);

    ctx.restore();

    // Draw name text
    ctx.fillStyle = "#fffff0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, nameX, nameY);
  }
}

function downloadPoster() {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL();
  link.click();
}