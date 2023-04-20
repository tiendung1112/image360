const panoramaImage = new PANOLENS.ImagePanorama("images/image2.jpg");
const imageContainer = document.querySelector(".image-container");
const viewer = new PANOLENS.Viewer({
  container: imageContainer,
  autoRotate: true,
  autoRotateSpeed: 0.3,
  controlBar: false,
});
viewer.add(panoramaImage);

let gamma = 0; // Giá trị gamma của cảm biến gia tốc
let beta = 0; // Giá trị beta của cảm biến gia tốc
const gammaThreshold = 2; // Ngưỡng giá trị tuyệt đối gamma để cập nhật lại ảnh
const betaThreshold = 2; // Ngưỡng giá trị tuyệt đối beta để cập nhật lại ảnh

// Hàm xử lý các giá trị của cảm biến gia tốc và di chuyển ảnh
function handleOrientation(event) {
  const newGamma = event.gamma; // Giá trị gamma mới của cảm biến gia tốc
  const newBeta = event.beta; // Giá trị beta mới của cảm biến gia tốc

  // Xác định sự khác biệt giữa giá trị mới và cũ của gamma và beta
  const gammaDiff = Math.abs(newGamma - gamma);
  const betaDiff = Math.abs(newBeta - beta);

  // Nếu giá trị tuyệt đối của sự khác biệt lớn hơn ngưỡng, cập nhật
  if (gammaDiff > gammaThreshold || betaDiff > betaThreshold) {
    gamma = newGamma;
    beta = newBeta;
    requestAnimationFrame(() => {
      // Tính toán góc quay mới của ảnh dựa trên các giá trị gamma và beta mới
      const rotationY = THREE.Math.degToRad(beta);
      const rotationX = THREE.Math.degToRad(-gamma);
      const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotationY, rotationX, 0, "YZX"));
      panoramaImage.setRotationFromQuaternion(quaternion);
    });
  }
}

// Gán hàm xử lý sự kiện "deviceorientation" vào window để lắng nghe các thay đổi
window.addEventListener("deviceorientation", handleOrientation);