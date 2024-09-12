# A-Frame Mobile Controls Component

This A-Frame component provides a mobile-friendly interface for controlling movement and look direction in A-Frame VR experiences using joystick controls. It includes settings for adjusting movement and look sensitivity.

## Features

- Dual joystick controls for movement and camera rotation
- Settings overlay for adjusting sensitivity
- Automatic detection and activation on mobile devices
- Disables default A-Frame controls to prevent conflicts

## Installation

1. Include the `mobile-controls.js` script in your HTML file after the A-Frame library:

```html
<head>
  <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/Yash1331/A-Frame-Mobile-Controls@v1.3.0/mobile-controls.js"></script>
</head>
```
2. Add the mobile-controls component to your A-Frame scene:
```
<a-scene mobile-controls="moveSpeed: 1; lookSpeed: 0.01">

  <!-- Your A-Frame content -->

</a-scene>
```
