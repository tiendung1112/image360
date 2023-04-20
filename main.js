// Lấy DOM container và khởi tạo Panolens Viewer
const container = document.querySelector('.image-container');
const viewer = new PANOLENS.Viewer({ container });

// Khởi tạo ảnh panorama
const panorama = new PANOLENS.ImagePanorama('images/image2.jpg');
viewer.add(panorama);

// Xin quyền truy cập cảm biến
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission()
    .then((permissionState) => {
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    })
    .catch(console.error);
} else {
  window.addEventListener('deviceorientation', handleOrientation);
}

// Xử lý sự kiện animate
function handleOrientation(event) {
  // Lấy giá trị alpha, beta, gamma
  const { alpha, beta, gamma } = event;

  // Tính toán góc quay và xoay ảnh
  const angle = (beta / 180) * Math.PI;
  panorama.rotation.y = angle;

  // Lật ảnh nếu thiết bị nằm ngang
  if (Math.abs(gamma) < 10) {
    panorama.rotation.y += Math.PI;
  }
}

viewer.addEventListener('animate', () => {
  // Cập nhật hướng thiết bị
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      })
      .catch(console.error);
  }
});
