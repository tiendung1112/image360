// Khởi tạo panoramaImage
const panoramaImage = new PANOLENS.ImagePanorama("images/image2.jpg");

// Lấy container để chứa ảnh
const imageContainer = document.querySelector(".image-container");

// Khởi tạo viewer và thêm panoramaImage vào viewer
const viewer = new PANOLENS.Viewer({
  container: imageContainer,
  autoRotate: true,
  autoRotateSpeed: 0.5,
  controlBar: false,
});
viewer.add(panoramaImage);

// Khởi tạo các biến để lưu trữ góc quay của điện thoại
let gamma = 0;
let beta = 0;
let alpha = 0;

if (window.DeviceOrientationEvent) {
  // Yêu cầu quyền truy cập vào cảm biến
  navigator.permissions.query({ name: 'accelerometer' }).then(result => {
    if (result.state === 'granted') {
      console.log('Quyền truy cập cảm biến đã được cấp');
      // Bắt đầu sử dụng sự kiện "deviceorientation"
      window.addEventListener('deviceorientation', handleOrientation);
    } else if (result.state === 'prompt') {
      console.log('Người dùng sẽ xác nhận quyền truy cập cảm biến');
      // Yêu cầu người dùng xác nhận quyền truy cập cảm biến
      navigator.permissions.request({ name: 'accelerometer' }).then(result => {
        if (result.state === 'granted') {
          console.log('Quyền truy cập cảm biến đã được cấp');
          // Bắt đầu sử dụng sự kiện "deviceorientation"
          window.addEventListener('deviceorientation', handleOrientation);
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

let lastOrientation = null;
let orientationOffset = new THREE.Quaternion();

function handleOrientation(event) {
  // Lấy giá trị gamma và beta từ event
  const gamma = event.gamma;
  const beta = event.beta;
  const alpha = event.alpha;

  // Nếu đây là lần lấy mẫu đầu tiên hoặc lastOrientation bị null thì gán lastOrientation bằng giá trị hiện tại
  if (!lastOrientation) {
    lastOrientation = new THREE.Vector3(beta, gamma, alpha);
    return;
  }

  // Tính toán giá trị quay vòng mới từ giá trị gamma và beta hiện tại
  const currentOrientation = new THREE.Vector3(beta, gamma, alpha);

  // Tính toán sai khác giữa giá trị quay vòng mới và giá trị quay vòng trước đó
  const deltaOrientation = new THREE.Vector3().subVectors(currentOrientation, lastOrientation);

  // Tạo quaternion từ giá trị quay vòng mới và hiệu chỉnh nó để giảm thiểu sai khác giữa giá trị thực tế và giá trị được tính toán
  const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
    THREE.Math.degToRad(deltaOrientation.x),
    THREE.Math.degToRad(deltaOrientation.y),
    THREE.Math.degToRad(deltaOrientation.z),
    'XYZ'
  ));
  orientationOffset.multiply(quaternion);

  // Cập nhật giá trị quay vòng trước đó
  lastOrientation.copy(currentOrientation);

  // Áp dụng giá trị quay vòng mới vào ảnh panoramaImage
  requestAnimationFrame(() => {
    panoramaImage.quaternion.copy(orientationOffset);
  });
}

// function handleOrientation(event) {
//   // Lấy giá trị alpha, beta và gamma từ event
//   const alpha = THREE.Math.degToRad(event.alpha);
//   const beta = THREE.Math.degToRad(event.beta);
//   const gamma = THREE.Math.degToRad(event.gamma);

//   // Tạo một quaternion từ các giá trị alpha, beta và gamma
//   const quaternion = new THREE.Quaternion()
//     .setFromEuler(new THREE.Euler(beta, alpha, -gamma, 'YZX'));

//   // Cập nhật góc quay của ảnh với quaternion mới
//   panoramaImage.quaternion.copy(quaternion);
// }
