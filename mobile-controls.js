/**
 * A-Frame Component for Mobile Controls
 * 
 * This component provides a UI for controlling movement and look direction
 * in A-Frame VR experiences on mobile platform. 
 *It includes settings for adjusting movement and look sensitivity.
 * 
 * Author: Yash1331
 * GitHub: https://github.com/Yash1331/A-Frame-Mobile-Controls/
 * Version: 1.3.0
 * Last Updated: 12/09/2024
 * 
 * Revision History:
 * - 1.0.0: Initial release with basic move joystick control and click button.
 * - 1.1.0: Added 2nd joystick to look around.
 * - 1.2.0: Added settings overlay to adjust sensitivity for joysticks. New method for move joystick.
 * - 1.3.0: Fixed move direction, added real-time value display for sliders in settings overlay.
 *
 * Usage:
 * To use this component, include it in your A-Frame scene as follows:
 * <a-scene mobile-controls="moveSpeed: 1; lookSpeed: 0.01">
 *   <!-- Your A-Frame content -->
 * </a-scene>
 */
 
 AFRAME.registerComponent('mobile-controls', {
  schema: {
    moveSpeed: { type: 'number', default: 1 },
    lookSpeed: { type: 'number', default: 0.1 }
  },

  init: function () {
    this.moveJoystickEl = null;
    this.lookJoystickEl = null;
    this.settingsButtonEl = null;
    this.settingsOverlayEl = null;
    this.camera = document.querySelector('[camera]');
    this.moveVector = new THREE.Vector3();
    this.isMouseDown = false;

    if (AFRAME.utils.device.isMobile()) {
      this.createUI();
      this.addEventListeners();
      this.disableDefaultControls();
    }
  },

  createUI: function () {
    // Create move joystick (left side)
    this.moveJoystickEl = this.createJoystick('20px', 'left: 20px');

    // Create look joystick (right side)
    this.lookJoystickEl = this.createJoystick('20px', 'right: 20px');

    // Create settings button (top right corner)
    this.settingsButtonEl = this.createButton('20px', 'right: 20px', '⚙️');
    this.settingsButtonEl.style.top = '20px';
    this.settingsButtonEl.style.bottom = 'auto';

    // Create settings overlay
    this.settingsOverlayEl = this.createSettingsOverlay();

    // Append UI elements to the document body
    document.body.appendChild(this.moveJoystickEl);
    document.body.appendChild(this.lookJoystickEl);
    document.body.appendChild(this.settingsButtonEl);
    document.body.appendChild(this.settingsOverlayEl);
  },

  createJoystick: function (bottom, side) {
    const joystickEl = document.createElement('div');
    joystickEl.style.position = 'fixed';
    joystickEl.style.bottom = bottom;
    joystickEl.style[side.split(':')[0]] = side.split(':')[1];
    joystickEl.style.width = '100px';
    joystickEl.style.height = '100px';
    joystickEl.style.zIndex = '9999';

    const joystickBG = document.createElement('div');
    joystickBG.style.position = 'absolute';
    joystickBG.style.width = '100%';
    joystickBG.style.height = '100%';
    joystickBG.style.borderRadius = '50%';
    joystickBG.style.background = 'rgba(255, 255, 255, 0.3)';

    const joystickHandle = document.createElement('div');
    joystickHandle.style.position = 'absolute';
    joystickHandle.style.width = '50%';
    joystickHandle.style.height = '50%';
    joystickHandle.style.borderRadius = '50%';
    joystickHandle.style.background = 'rgba(255, 255, 255, 0.7)';
    joystickHandle.style.left = '25%';
    joystickHandle.style.top = '25%';

    joystickEl.appendChild(joystickBG);
    joystickEl.appendChild(joystickHandle);

    return joystickEl;
  },

  createButton: function (bottom, right, text) {
    const buttonEl = document.createElement('div');
    buttonEl.style.position = 'fixed';
    buttonEl.style.bottom = bottom;
    buttonEl.style.right = right;
    buttonEl.style.width = '60px';
    buttonEl.style.height = '60px';
    buttonEl.style.borderRadius = '50%';
    buttonEl.style.background = 'rgba(255, 255, 255, 0.5)';
    buttonEl.style.zIndex = '9999';
    buttonEl.style.display = 'flex';
    buttonEl.style.justifyContent = 'center';
    buttonEl.style.alignItems = 'center';
    buttonEl.style.fontSize = '20px';
    buttonEl.textContent = text;
    return buttonEl;
  },

createSettingsOverlay: function () {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '10000';
  overlay.style.display = 'none';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.color = 'white';

  const title = document.createElement('h2');
  title.textContent = 'Settings';
  overlay.appendChild(title);

  const createSlider = (name, min, max, value, step, onChange) => {
    const container = document.createElement('div');
    container.style.margin = '10px 0';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.width = '80%';

    const label = document.createElement('label');
    label.textContent = name;
    label.style.width = '30%';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step;
    slider.style.width = '50%';

    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = value;
    valueDisplay.style.width = '20%';
    valueDisplay.style.textAlign = 'right';

    slider.addEventListener('input', (event) => {
      const newValue = parseFloat(event.target.value);
      valueDisplay.textContent = newValue.toFixed(2);
      onChange(newValue);
    });

    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    return container;
  };

  overlay.appendChild(createSlider('Move Speed', 0.1, 5, this.data.moveSpeed, 0.1, (value) => {
    this.data.moveSpeed = value;
  }));
  
  overlay.appendChild(createSlider('Look Speed', 0.01, 0.3, this.data.lookSpeed, 0.01, (value) => {
    this.data.lookSpeed = value;
  }));

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '20px';
  closeButton.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
  overlay.appendChild(closeButton);

  return overlay;
},

  addEventListeners: function () {
    this.moveJoystickEl.addEventListener('touchstart', this.onMoveJoystickStart.bind(this));
    this.moveJoystickEl.addEventListener('touchmove', this.onMoveJoystickMove.bind(this));
    this.moveJoystickEl.addEventListener('touchend', this.onMoveJoystickEnd.bind(this));

    this.lookJoystickEl.addEventListener('touchstart', this.onLookJoystickStart.bind(this));
    this.lookJoystickEl.addEventListener('touchmove', this.onLookJoystickMove.bind(this));
    this.lookJoystickEl.addEventListener('touchend', this.onLookJoystickEnd.bind(this));

    this.settingsButtonEl.addEventListener('click', () => {
      if (this.settingsOverlayEl) {
        this.settingsOverlayEl.style.display = 'flex';
      }
    });
  },

  onMoveJoystickStart: function (event) {
    event.preventDefault();
  },

  onMoveJoystickMove: function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.moveJoystickEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(rect.width / 2, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    this.moveJoystickEl.querySelector('div:nth-child(2)').style.transform = `translate(${moveX}px, ${moveY}px)`;

    this.moveVector.x = deltaX / (rect.width / 2);
    this.moveVector.z = deltaY / (rect.height / 2);
  },

  onMoveJoystickEnd: function (event) {
    event.preventDefault();
    this.moveJoystickEl.querySelector('div:nth-child(2)').style.transform = 'translate(0, 0)';
    this.moveVector.set(0, 0, 0);
  },

  onLookJoystickStart: function (event) {
    event.preventDefault();
  },

  onLookJoystickMove: function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.lookJoystickEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(rect.width / 2, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    this.lookJoystickEl.querySelector('div:nth-child(2)').style.transform = `translate(${moveX}px, ${moveY}px)`;

    // Rotate camera
    const lookSpeed = this.data.lookSpeed;
    this.camera.object3D.rotation.y -= deltaX * lookSpeed * 0.01;
    this.camera.object3D.rotation.x -= deltaY * lookSpeed * 0.01;
    this.camera.object3D.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.object3D.rotation.x));
  },

  onLookJoystickEnd: function (event) {
    event.preventDefault();
    this.lookJoystickEl.querySelector('div:nth-child(2)').style.transform = 'translate(0, 0)';
  },

  disableDefaultControls: function () {
    // Disable default look controls
    const lookControls = this.camera.components['look-controls'];
    if (lookControls) {
      lookControls.pause();
    }

    // Prevent default touch behavior
    document.body.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
  },

  tick: function (time, delta) {
    if (AFRAME.utils.device.isMobile() && this.moveVector && this.moveVector.lengthSq() > 0.00001) {
      // Convert move vector to camera's local coordinates
      const cameraRotation = this.camera.object3D.rotation.y;
      const moveX = this.moveVector.x * Math.cos(cameraRotation) + this.moveVector.z * Math.sin(cameraRotation);
      const moveZ = -this.moveVector.x * Math.sin(cameraRotation) + this.moveVector.z * Math.cos(cameraRotation);

      // Update camera position
      const moveSpeed = this.data.moveSpeed * (delta / 1000);
      this.camera.object3D.position.x += moveX * moveSpeed;
      this.camera.object3D.position.z += moveZ * moveSpeed;
    }
  }
});
