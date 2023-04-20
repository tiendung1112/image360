// Lấy DOM container và khởi tạo Panolens Viewer
const container = document.querySelector('.image-container');
const viewer = new PANOLENS.Viewer({ container });

// Khởi tạo ảnh panorama
const panorama = new PANOLENS.ImagePanorama('images/image2.jpg');
viewer.add(panorama);

// Kiểm tra nếu trình duyệt hỗ trợ cảm biến
if (window.DeviceOrientationEvent) {
  // Xác định hướng thiết bị
  let alpha = 0, beta = 0, gamma = 0;
  window.addEventListener('deviceorientation', (event) => {
    alpha = event.alpha;
    beta = event.beta;
    gamma = event.gamma;
  });

  // Xử lý sự kiện
  viewer.addEventListener('animate', () => {
    // Nếu cảm biến không hoạt động thì không làm gì cả
    if (!alpha || !beta || !gamma) {
      return;
    }

    // Tính toán góc quay và xoay ảnh
    const angle = (beta / 180) * Math.PI;
    panorama.rotation.y = angle;

    // Lật ảnh nếu thiết bị nằm ngang
    if (Math.abs(gamma) < 10) {
      panorama.rotation.y += Math.PI;
    }
  });
}
