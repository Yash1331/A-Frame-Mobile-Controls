/**
 * A-Frame Component for Mobile Controls
 * 
 * This component provides a UI for controlling movement and look direction in A-Frame VR experiences on mobile platforms. 
 * 
 * Author: Yash1331
 * GitHub: https://github.com/Yash1331/A-Frame-Mobile-Controls
 * Version: 1.1.0
 * Last Updated: 12/09/2024
 * 
 * Revision History:
 * - 1.0.0: Initial release with basic move joystick & click button controls.
 * - 1.1.0: Added joystick controls for move and look.
 *
 * Usage:
 * To use this component, include it in your A-Frame scene as follows:
 * <a-scene mobile-controls>
 *   <!-- Your A-Frame content -->
 * </a-scene>
 */

AFRAME.registerComponent('mobile-controls', {
  init: function () {
    if (!AFRAME.utils.device.isMobile()) return; // Only run on mobile devices

    this.moveJoystickEl = null;
    this.lookJoystickEl = null;
    this.camera = document.querySelector('[camera]');
    this.createUI();
    this.addEventListeners();
    this.disableDefaultControls();
  },

  createUI: function () {
    // Create move joystick
    this.moveJoystickEl = this.createJoystick('20px', '20px');

    // Create look joystick
    this.lookJoystickEl = this.createJoystick('20px', 'calc(50% - 50px)');

    document.body.appendChild(this.moveJoystickEl);
    document.body.appendChild(this.lookJoystickEl);
  },

  createJoystick: function (bottom, right) {
    const joystickEl = document.createElement('div');
    joystickEl.style.position = 'fixed';
    joystickEl.style.bottom = bottom;
    joystickEl.style.right = right;
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

  addEventListeners: function () {
    this.moveJoystickEl.addEventListener('touchstart', this.onMoveJoystickStart.bind(this));
    this.moveJoystickEl.addEventListener('touchmove', this.onMoveJoystickMove.bind(this));
    this.moveJoystickEl.addEventListener('touchend', this.onMoveJoystickEnd.bind(this));

    this.lookJoystickEl.addEventListener('touchstart', this.onLookJoystickStart.bind(this));
    this.lookJoystickEl.addEventListener('touchmove', this.onLookJoystickMove.bind(this));
    this.lookJoystickEl.addEventListener('touchend', this.onLookJoystickEnd.bind(this));
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

    // Emulate WASD keys based on joystick position
    const threshold = 10;
    if (deltaX < -threshold) this.emulateKeyPress('a');
    if (deltaX > threshold) this.emulateKeyPress('d');
    if (deltaY < -threshold) this.emulateKeyPress('w');
    if (deltaY > threshold) this.emulateKeyPress('s');
  },

  onMoveJoystickEnd: function (event) {
    event.preventDefault();
    this.moveJoystickEl.querySelector('div:nth-child(2)').style.transform = 'translate(0, 0)';
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

    // Emulate mouse movement for looking around
    const lookSpeed = 0.1;
    this.camera.object3D.rotation.y -= deltaX * lookSpeed * 0.01;
    this.camera.object3D.rotation.x -= deltaY * lookSpeed * 0.01;
    this.camera.object3D.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.object3D.rotation.x));
  },

  onLookJoystickEnd: function (event) {
    event.preventDefault();
    this.lookJoystickEl.querySelector('div:nth-child(2)').style.transform = 'translate(0, 0)';
  },

  emulateKeyPress: function (key) {
    const keyEvent = new KeyboardEvent('keydown', { bubbles: true, key: key });
    document.dispatchEvent(keyEvent);
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
  }
});
