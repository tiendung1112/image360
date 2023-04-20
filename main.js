// Tạo hình ảnh panorama
const panoramaImage = new PANOLENS.ImagePanorama('images/image2.jpg');

// Lấy phần tử chứa hình ảnh
const imageContainer = document.querySelector('.image-container');

// Tạo đối tượng Viewer
const viewer = new PANOLENS.Viewer({
  container: imageContainer,
  autoRotate: true,
  autoRotateSpeed: 0.3,
  controlBar: false
});

// Thêm hình ảnh panorama vào viewer
viewer.add(panoramaImage);

// Xin quyền truy cập đến cảm biến định hướng trên thiết bị
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', handleOrientation);
}

// Hàm xử lý sự kiện cập nhật từ cảm biến định hướng
function handleOrientation(event) {
  // Lấy giá trị alpha, beta và gamma từ sự kiện cập nhật
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;

  // Tính toán góc xoay theo trục x, y và z của hình ảnh panorama
  const x = (beta - 90) * Math.PI / 180;
  const y = -gamma * Math.PI / 180;
  const z = (alpha + 180) * Math.PI / 180;

  // Cập nhật góc xoay của hình ảnh panorama
  panoramaImage.rotation.set(x, y, z);
}
