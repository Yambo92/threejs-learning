function init() {
  console.log('Using three.js version: ', +THREE.REVISION);
  var stats = initStats();
  // scene object is a container that is used to store and keep track of
  // all the objects we want to render and all the lights
  var scene = new THREE.Scene();
  // the camera object defines what we'll see when we render a scene
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight
  );

  var renderer = new THREE.WebGLRenderer();
  // set the bgcolor of renderer to black
  renderer.setClearColor(new THREE.Color(0x000000));
  // tell renderer how large the scene needs to be rendered
  // By passing in the  window.innerWidth and
  // window.innerHeight , we use all the screen space available
  renderer.setSize(window.innerWidth, window.innerHeight);
  //  to tell  renderer that we want shadows
  renderer.shadowMap.Enabled = true;

  //  (the passed-in value determines the
  // size of the lines representing the x, y, and z axes)
  var axes = new THREE.AxesHelper(20);
  //  add these axes to our scene.
  scene.add(axes);
  // define what the plane looks like
  //  it has a width of  60 and a height of 20 .
  var planeGeometry = new THREE.PlaneGeometry(60, 20);
  //  what this plane looks like by creating a material object
  //   var planeMaterial = new THREE.MeshBasicMaterial({
  //     color: 0xaaaaaa,
  //   });
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // Before we add  plane to the scene, we need to put it in the correct position;
  // by first rotating it 90 degrees around the x axis
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);
  // explicitly define which objects cast shadows and which
  // objects receive shadows.
  plane.receiveShadow = true;

  scene.add(plane);

  //create a cube
  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  // with the wireframe property set to  true , which tells Three.js to show us a wireframe and
  // not a solid object.
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    // wireframe: true,
  });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-4, 3, 0);

  cube.castShadow = true;

  scene.add(cube);

  // create a sphere
  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
    // wireframe: true,
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(20, 4, 2);

  sphere.castShadow = true;

  scene.add(sphere);

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  /*
The basic material we used in the
previous example ( THREE.MeshBasicMaterial ) doesn't do anything with the light
sources in the scene. 
*/

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 40, -15);
  // we want it to cast a shadow by setting the
  // castShadow property to  true .
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;

  // adding a light source to the scene
  scene.add(spotLight);

  // add the output of the renderer to the html element
  document.getElementById('webgl-output').appendChild(renderer.domElement);

  var trackedballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // render the scene
  renderer.render(scene, camera);
  // 交互控制
  var controls = new (function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
  })();

  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'bouncingSpeed', 0, 0.5);

  var step = 0;
  renderScene();
  function renderScene() {
    trackedballControls.update(clock.getDelta());
    stats.update();
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
    document.getElementById('webgl-output').appendChild(renderer.domElement);
  }
}

function initStats(type) {
  var panelType =
    typeof type !== 'undefined' && type && isNaN(type) ? parseInt(type) : 0;
  var stats = new Stats();
  stats.showPanel(panelType);
  document.body.appendChild(stats.dom);
  return stats;
}
