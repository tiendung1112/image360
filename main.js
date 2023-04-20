// Khởi tạo panoramaImage
const panoramaImage = new PANOLENS.ImagePanorama("images/image2.jpg");

// Lấy container để chứa ảnh
const imageContainer = document.querySelector(".image-container");

// Khởi tạo viewer và thêm panoramaImage vào viewer
const viewer = new PANOLENS.Viewer({
  container: imageContainer,
  autoRotate: true,
  autoRotateSpeed: 0.3,
  controlBar: false,
});
viewer.add(panoramaImage);

if (window.DeviceOrientationEvent) {
  // Yêu cầu quyền truy cập vào cảm biến
  navigator.permissions.query({ name: 'accelerometer' }).then(result => {
    if (result.state === 'granted') {
      console.log('Quyền truy cập cảm biến đã được cấp');
      // Bắt đầu sử dụng sự kiện "deviceorientation"
    } else if (result.state === 'prompt') {
      console.log('Người dùng sẽ xác nhận quyền truy cập cảm biến');
      // Yêu cầu người dùng xác nhận quyền truy cập cảm biến
      navigator.permissions.request({ name: 'accelerometer' }).then(result => {
        if (result.state === 'granted') {
          console.log('Quyền truy cập cảm biến đã được cấp');
          // Bắt đầu sử dụng sự kiện "deviceorientation"
        } else {
          console.log('Quyền truy cập cảm biến bị từ chối');
        }
      });
    } else {
      console.log('Quyền truy cập cảm biến bị từ chối');
    }
  });
} else {
  console.log('Thiết bị của bạn không hỗ trợ sự kiện "deviceorientation"');
}

// Khởi tạo các biến để lưu trữ góc quay của điện thoại
let gamma = 0;
let beta = 0;

// Đăng ký hàm xử lý sự kiện "deviceorientation"
window.addEventListener("deviceorientation", handleOrientation);

function handleOrientation(event) {
  // Lấy giá trị gamma và beta từ event
  const newGamma = event.gamma;
  const newBeta = event.beta;

  // Tính toán sự khác biệt giữa gamma và beta hiện tại và giá trị mới
  const gammaDiff = Math.abs(gamma - newGamma);
  const betaDiff = Math.abs(beta - newBeta);

  // Đặt ngưỡng để kiểm tra sự khác biệt
  const gammaThreshold = 2;
  const betaThreshold = 2;

  // Nếu sự khác biệt lớn hơn ngưỡng, thì cập nhật gamma và beta mới và thực hiện di chuyển ảnh
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
