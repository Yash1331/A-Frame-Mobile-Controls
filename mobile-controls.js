/**
 * A-Frame Component for Mobile Controls
 * 
 * This component provides a UI for controlling movement and look direction in A-Frame VR experiences on mobile platforms. 
 * 
 * Author: Yash1331
 * GitHub: https://github.com/Yash1331/A-Frame-Mobile-Controls
 * Version: 1.0.0
 * Last Updated: 12/09/2024
 * 
 * Revision History:
 * - 1.0.0: Initial release with basic joystick controls.
 *
 * Usage:
 * To use this component, include it in your A-Frame scene as follows:
 * <a-scene mobile-controls>
 *   <!-- Your A-Frame content -->
 * </a-scene>
 */

AFRAME.registerComponent('mobile-controls', {
  init: function () {
    if (!AFRAME.utils.device.isMobile()) return; 
    this.joystickEl = null;
    this.joystickBG = null;
    this.joystickHandle = null;
    this.tapButton = null;
    this.camera = document.querySelector('[camera]');
    this.createUI();
    this.addEventListeners();
  },

  createUI: function () {
    // Creating joystick container
    this.joystickEl = document.createElement('div');
    this.joystickEl.style.position = 'fixed';
    this.joystickEl.style.bottom = '20px';
    this.joystickEl.style.left = '20px';
    this.joystickEl.style.width = '100px';
    this.joystickEl.style.height = '100px';
    this.joystickEl.style.zIndex = '9999';

    // Creating joystick background
    this.joystickBG = document.createElement('div');
    this.joystickBG.style.position = 'absolute';
    this.joystickBG.style.width = '100%';
    this.joystickBG.style.height = '100%';
    this.joystickBG.style.borderRadius = '50%';
    this.joystickBG.style.background = 'rgba(255, 255, 255, 0.3)';

    // Creating joystick handle
    this.joystickHandle = document.createElement('div');
    this.joystickHandle.style.position = 'absolute';
    this.joystickHandle.style.width = '50%';
    this.joystickHandle.style.height = '50%';
    this.joystickHandle.style.borderRadius = '50%';
    this.joystickHandle.style.background = 'rgba(255, 255, 255, 0.7)';
    this.joystickHandle.style.left = '25%';
    this.joystickHandle.style.top = '25%';

    // Create tap button
    this.tapButton = document.createElement('div');
    this.tapButton.style.position = 'fixed';
    this.tapButton.style.bottom = '20px';
    this.tapButton.style.right = '20px';
    this.tapButton.style.width = '60px';
    this.tapButton.style.height = '60px';
    this.tapButton.style.borderRadius = '50%';
    this.tapButton.style.background = 'rgba(255, 255, 255, 0.5)';
    this.tapButton.style.zIndex = '9999';

    // Appending elements to the DOM
    this.joystickEl.appendChild(this.joystickBG);
    this.joystickEl.appendChild(this.joystickHandle);
    document.body.appendChild(this.joystickEl);
    document.body.appendChild(this.tapButton);
  },

  addEventListeners: function () {
    this.joystickEl.addEventListener('touchstart', this.onJoystickStart.bind(this));
    this.joystickEl.addEventListener('touchmove', this.onJoystickMove.bind(this));
    this.joystickEl.addEventListener('touchend', this.onJoystickEnd.bind(this));
    this.tapButton.addEventListener('touchstart', this.onTapStart.bind(this));
    this.tapButton.addEventListener('touchend', this.onTapEnd.bind(this));
  },

  onJoystickStart: function (event) {
    event.preventDefault();
  },

  onJoystickMove: function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.joystickEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(rect.width / 2, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    this.joystickHandle.style.transform = `translate(${moveX}px, ${moveY}px)`;

    // Emulate WASD keys based on joystick position
    const keyEvent = new KeyboardEvent('keydown', { bubbles: true });
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        keyEvent.key = 'd';
      } else {
        keyEvent.key = 'a';
      }
    } else {
      if (deltaY > 0) {
        keyEvent.key = 's';
      } else {
        keyEvent.key = 'w';
      }
    }
    document.dispatchEvent(keyEvent);
  },

  onJoystickEnd: function (event) {
    event.preventDefault();
    this.joystickHandle.style.transform = 'translate(0, 0)';
    // Release all WASD keys
    ['w', 'a', 's', 'd'].forEach(key => {
      const keyEvent = new KeyboardEvent('keyup', { bubbles: true, key: key });
      document.dispatchEvent(keyEvent);
    });
  },

  onTapStart: function (event) {
    event.preventDefault();
    const mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
    this.camera.dispatchEvent(mouseEvent);
  },

  onTapEnd: function (event) {
    event.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
    this.camera.dispatchEvent(mouseEvent);
  }
});
