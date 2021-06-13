
// 3D
let scene,
    camera,
    renderer;
let toystory,
    mesh,
    transparentMesh,
    linearMesh;

// Ray
let mouse = new THREE.Vector2();
let INTERSECTED,
    raycaster;

// Sounds
let clickSound                = new Audio('https://demo.letsee.io/confinity/assets/audio/click.mp3');
let iceSound                  = new Audio('https://demo.letsee.io/confinity/assets/audio/ice_drop_3.m4a'),
    magicDisplaySound         = new Audio('https://demo.letsee.io/confinity/assets/audio/magic-display.mp3'),
    magicSpaceDoorSound       = new Audio('https://demo.letsee.io/confinity/assets/audio/magic-space.mp3'),
    magicSpaceKnockOnSound    = new Audio('https://demo.letsee.io/confinity/assets/audio/knock-on.mp3'),
    filterSound               = new Audio('https://demo.letsee.io/confinity/assets/audio/filter.mp3'),
    uvSound                   = new Audio('https://demo.letsee.io/confinity/assets/audio/uv.mp3'),
    foldingShelfSound         = new Audio('https://demo.letsee.io/confinity/assets/audio/folding.mp3'),
    multiCornerSound          = new Audio('https://demo.letsee.io/confinity/assets/audio/multi.mp3'),
    largeBasketSound          = new Audio('https://demo.letsee.io/confinity/assets/audio/big_basket.mp3'),
    doorCaseSound             = new Audio('https://demo.letsee.io/confinity/assets/audio/moving-basket.mp3'),
    linearCompressorSound     = new Audio('https://demo.letsee.io/confinity/assets/audio/linear.mp3');

// Booleans
let isOpenIceDrop             = false,
    isMagicDisplayClicked     = false,
    isMagicSpaceDoorClicked   = false,
    isKnockOnClicked          = false,
    isFilterClicked           = false,
    isLinearCompressorClicked = false,
    is3Dview                  = false,
    isARModeOn                = false,
    isAnimationPlaying        = false,
    isOpenSlidingShelf        = false,
    isShowMelonFinished       = false;

// Add ResourceTracker
const resMgr = new ResourceTracker();
let track = resMgr.track.bind(resMgr);

let topTabFlag = 'exterior'; // 'exterior' | 'inside' | 'cooling'
let idTubeAnim;

const clock = new THREE.Clock();
let circle, circumference;

let fps = 30;
let fpsInterval = 1000 / fps;
let now = null;
let then = Date.now();
let elapsed = null;

/**
 * Initialize world.
 */
function initWorld() {
  console.warn(`THREE.REVISION: ${THREE.REVISION}`);

  initScene();
  loadModels();
}

/**
 * Initialize Scene.
 */
function initScene() {

  // 1. Add lights
  /*let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  ambientLight.position.set(0, 0, 0);
  scene.add(ambientLight);*/

  let dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(-0.5, 0.5, 0.866);
  dirLight.castShadow = false;
  dirLight.shadow.mapSize = new THREE.Vector2(512, 512);
  scene.add(dirLight);

  let pmremGenerator = new THREE.PMREMGenerator( renderer );
  pmremGenerator.compileEquirectangularShader();

  // 2. Set background for scene as image
  new THREE.RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath('https://demo.letsee.io/confinity/https://demo.letsee.io/confinity/assets/textures/')
      .load('royal_esplanade_1k.hdr', function (texture) {
          let envMap = pmremGenerator.fromEquirectangular(texture).texture;

          // scene.background = envMap;
          scene.environment = envMap;

          texture.dispose();
          pmremGenerator.dispose();
      });

  // 3. Set light effects for renderer
  renderer.toneMappingExposure     = 1;
  renderer.toneMapping             = 0;
  renderer.gammaFactor             = 2;
  renderer.outputEncoding          = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  // renderer.setPixelRatio( window.devicePixelRatio );

  // Set actual size in memory (scaled to account for extra pixel density).
  let scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
  // renderer.domElement.width = Math.floor(renderer.domElement.width * scale);
  // renderer.domElement.height = Math.floor(renderer.domElement.height * scale);
  console.error(scale);

  // Normalize coordinate system to use css pixels.
  // let ctx = renderer.domElement.getContext('2d');
  // ctx.scale(scale, scale);

  // 4. Raycaster
  raycaster = new THREE.Raycaster();
  document.addEventListener('touchstart', onDocumentTouchStart, false);
}

/**
 * 1. Load whole model of fridge and other objects.
 * 2. Make animation clips.
 * 3. Add model into Entity.
 */
function loadModels() {
  letsee.addTarget('https://developer.letsee.io/api-tm/target-manager/target-uid/60b8351f398942b60ead2d14').then(entity => {
    toystory = entity;

    // 1. Load fridge
    loadFridge(track)
    .then(model => {
      console.warn(`Fridge model loaded completed!`);
      mesh = model;

      // 2.Add mesh into entity
      toystory.add(mesh);

      // 3. Add entity to scene
      scene.add(toystory);

      if (mesh) {

        // 4. Create animation clips for Fridge model
        (mesh.originAnims.length > 0) ? makeAnimationClips(mesh.originAnims[0]) : 'Fridge model does not have animation.';

        // 5. Create buttons, texts and sound
        createButton(track);

        // 6. Load objects inside the fridge
        loadInsideObjects(track)
        .then(msg => {
          console.warn(msg);

          // 7. Load ice cubes
          loadIce(track);

          // 8. Load Inverter
          loadLinearCompression(track);

          // 9. Create smoke pipeline
          createSmokePipeline(track);
        });
      }
    });

    // Render all
    renderAll().then(() => {});
  });
}

/**
 * Render all.
 * @returns {Promise<void>}
 */
const renderAll = async function() {
  requestAnimationFrame(renderAll);

  TWEEN.update();

  now = Date.now();
  elapsed = now - then;

  /*window.camera = letsee.threeRenderer().getDeviceCamera();
  renderer.render(scene, window.camera);*/
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    window.camera = letsee.threeRenderer().getDeviceCamera();

    let d = clock.getDelta();
    if (openInsideMixer) openInsideMixer.update(d);
    if (closeInsideMixer) closeInsideMixer.update(d);
    if (openMagicDoorMixer) openMagicDoorMixer.update(d);
    if (closeMagicDoorMixer) closeMagicDoorMixer.update(d);
    if (playDoorCaseMixer) playDoorCaseMixer.update(d);
    if (playSodaBottleMixer_1) playSodaBottleMixer_1.update(d);
    if (playSodaBottleMixer_2) playSodaBottleMixer_2.update(d);
    if (playSodaBottleMixer_3) playSodaBottleMixer_3.update(d);
    if (openFilterMixer) openFilterMixer.update(d);
    if (closeFilterMixer) closeFilterMixer.update(d);
    if (playLinearMixer) playLinearMixer.update(d);
    if (stopLinearMixer) stopLinearMixer.update(d);
    if (openSlidingShelfMixer) openSlidingShelfMixer.update(d);
    if (closeSlidingShelfMixer) closeSlidingShelfMixer.update(d);

    await letsee.threeRenderer().update();
    renderer.render(scene, window.camera);
  }

  // await letsee.threeRenderer().update();
};

/**
 * Handle tab navigation.
 * 1. Add eventListerner again for raycasting.
 * 2. Resume tracking.
 * 3. Play click sound when click on each tab.
 * 4. Reset Fridge model as original, including model material and buttons.
 * 5. Change menu tab GUI.
 * 6. Handle function for each tab.
 * @param tab
 */
function switchTab(tab) {

  // 1. Again add eventListener for raycasting
  document.addEventListener('touchstart', onDocumentTouchStart, false);

  // 2. Resume tracking
  if (letsee.isPaused()) {
    console.error(`RESUME!`);
    // letsee.resume([0.9996717718958484, 0.0062402214640219465, -0.02484769829772193, 0, -0.0025224514927073274, 0.9891437930727777, 0.14692921378699628, 0, 0.02549481737690216, -0.14681831037604906, 0.988834868936791, 0, -10.489514205452574, -2.8702186425177274, -300.4471307995897, 1]);
    letsee.resume([0.9996717718958484, 0.0062402214640219465, -0.02484769829772193, 0, -0.0025224514927073274, 0.9891437930727777, 0.14692921378699628, 0, 0.02549481737690216, -0.14681831037604906, 0.988834868936791, 0, -10.489514205452574, 30.5702186425177274, -250.4471307995897, 1]);
  }

  console.error(`The animation clip is still playing =>>> ${isAnimationPlaying}`);
  console.error(`isShowMelonFinished =>>> ${isShowMelonFinished}`);
  if ( isAnimationPlaying) return;

  // if (isOpenSlidingShelf && !isShowMelonFinished) {
  //   closeSlidingShelf(bodyInsideGroup.children);
  // }

  // 3. Play click sound
  clickSound.play().then(() => {});

  document.getElementById('btn_opendoor').style.display = 'block';
  document.getElementById('btn_closedoor').style.display = 'none';

  // 4. Reset model as original
  resetModel();

  switch (tab) {
    case 'exterior':
      // Reset all children
      toystory.children = [];
      setTimeout(() => {
        // Add mesh back to entity
        toystory.add(mesh);
        mesh.visible= true;
      }, 300);

      closeInside();

      // Reset mesh material
      mesh.children.forEach(child => {
        child.traverse(function(obj) {
          if (obj.type === 'Mesh') {
            obj.material.depthWrite = true;
          }
        })
      });

      // Add main buttons
      mesh.add(btnOpenVideo, btnOpenRightDoor, btnKnockOn);

      // 5. Change menu tab GUI.
      document.getElementById('btn-exterior').src = 'https://demo.letsee.io/confinity/assets/menu/ico-exterior-on.svg';
      document.getElementById('btn-inside').src = 'https://demo.letsee.io/confinity/assets/menu/ico-inside.svg';
      document.getElementById('btn-cooling').src = 'https://demo.letsee.io/confinity/assets/menu/ico-cooling.svg';

      $('#tab-1').css('background', '#a50634');
      $('#tab-1 p').css('color', '#ffffff');

      $('#tab-2').css('background', '#ffffff');
      $('#tab-2 p').css('color', '#9b9b9b');

      $('#tab-3').css('background', '#ffffff');
      $('#tab-3 p').css('color', '#9b9b9b');

      document.getElementById('btnRotate').src = 'https://demo.letsee.io/confinity/assets/menu/btn-3-dtop.png';
      document.getElementById('bottom').style.display = 'flex';
      document.getElementById('controlPanel').style.display = 'none';
      document.getElementById('myElement').style.display = 'none';

      document.getElementById('message').style.display = 'flex';
      document.getElementById('narration-panel').style.display = 'none';

      // Reset previous animations.
      if (playLinearMixer) linearAction.stop();

      topTabFlag = 'exterior';

      break;
    case 'inside':

      // Reset all children
      toystory.children = [];
      setTimeout(() => {
        // Add mesh back to entity
        toystory.add(mesh);
        mesh.visible = true;
      }, 300);

      // Reset mesh material
      mesh.children.forEach(child => {
        child.traverse(function(obj) {
          if (obj.type === 'Mesh') {
            obj.material.depthWrite = true;
          }
        })
      });

      // 5. Change menu tab GUI.
      document.getElementById('btn-exterior').src = 'https://demo.letsee.io/confinity/assets/menu/ico-exterior.svg';
      document.getElementById('btn-inside').src = 'https://demo.letsee.io/confinity/assets/menu/ico-inside-on.svg';
      document.getElementById('btn-cooling').src = 'https://demo.letsee.io/confinity/assets/menu/ico-cooling.svg';

      $('#tab-1').css('background', '#ffffff');
      $('#tab-1 p').css('color', '#9b9b9b');

      $('#tab-2').css('background', '#a50634');
      $('#tab-2 p').css('color', '#ffffff');

      $('#tab-3').css('background', '#ffffff');
      $('#tab-3 p').css('color', '#9b9b9b');

      document.getElementById('btnRotate').src = 'https://demo.letsee.io/confinity/assets/menu/btn-3-dtop.png';
      document.getElementById('bottom').style.display = 'flex';
      document.getElementById('controlPanel').style.display = 'none';
      document.getElementById('myElement').style.display = 'none';

      document.getElementById('message').style.display = 'flex';
      document.getElementById('narration-panel').style.display = 'none';

      // Reset previous animations.
      if (playLinearMixer) linearAction.stop();

      openInside();
      /*setTimeout(() => {
        openInside();
      }, 300);*/

      topTabFlag = 'inside';

      break;
    case 'cooling':

      // if (isOpenSlidingShelf) {
      //   closeSlidingShelf();
      //   // isOpenSlidingShelf = false;
      //   bodyInsideGroup.children.forEach(c => {
      //
      //     // Reset watermelon
      //     if (c.name === 'watermelon') {
      //       c.visible = false;
      //       c.position.y = 0.31;
      //     }
      //
      //     // Reset the pot
      //     if (c.name === 'pot') {
      //       c.visible = true;
      //       c.position.y = -0.12;
      //     }
      //   })
      // }

      closeInside();

      // Reset all children
      toystory.children = [];
      toystory.add(transparentMesh);
      transparentMesh.scale.setScalar(400);
      // transparentMesh.visible = true;

      // Make transparent material for transparentMesh
      let darkMat = track(new THREE.MeshStandardMaterial( {color: 0x000000,  transparent: true, opacity: 0.4}));
      transparentMesh.children.forEach(child => {
        child.traverse(function(obj) {
          if (obj.type === 'Mesh') {
            obj.material = darkMat;
          }
        })
      });

      // 5. Change menu tab GUI.
      document.getElementById('btn-exterior').src = 'https://demo.letsee.io/confinity/assets/menu/ico-exterior.svg';
      document.getElementById('btn-inside').src = 'https://demo.letsee.io/confinity/assets/menu/ico-inside.svg';
      document.getElementById('btn-cooling').src = 'https://demo.letsee.io/confinity/assets/menu/ico-cooling-on.svg';

      $('#tab-1').css('background', '#ffffff');
      $('#tab-1 p').css('color', '#9b9b9b');

      $('#tab-2').css('background', '#ffffff');
      $('#tab-2 p').css('color', '#9b9b9b');

      $('#tab-3').css('background', '#a50634');
      $('#tab-3 p').css('color', '#ffffff');

      document.getElementById('btnRotate').src = 'https://demo.letsee.io/confinity/assets/menu/btn-3-dtop.png';
      document.getElementById('bottom').style.display = 'flex';
      document.getElementById('controlPanel').style.display = 'none';
      document.getElementById('myElement').style.display = 'none';

      rotateModelBackside(track);

      topTabFlag = 'cooling';
      isLinearCompressorClicked = true;
      break;
    case 'tutorials':
      openTutorial();
      break;
  }
}

/**
 * Open Ice Drop
 */
function openIceDrop() {
  console.warn(`openIceDrop`);

  // Add ice groups and set default position for ice cubes
  mesh.add(iceCubesFixed);
  iceCubesFixed.position.set(-0.05, 0.25, 0.1);

  mesh.add(iceGroup);
  iceGroup.position.set(-0.05, 0.25, 0.09);
  iceGroup.children[0].position.set(0, 0.5, 0);
  iceGroup.children[0].rotateY(Math.PI/180 * 60);

  iceGroup.children[1].position.set(0, 0.5, 0);
  iceGroup.children[1].rotateZ(Math.PI/180 * 60);

  iceGroup.children[2].position.set(0.5, 0.5, 1);
  iceGroup.children[2].rotateZ(Math.PI/180 * -60);

  animateIceCube();
}

/**
 * Remove handler to deactivate raycaster
 * when user clicks on another buttons (open tutorials, scale,...)
 */
function removeHandler() {
  document.removeEventListener('touchstart', onDocumentTouchStart);
}

/**
 * Reset model as original coordinates.
 */
function resetAfterScale() {
  console.warn(`RESET SCALE.`);
  clickSound.play().then(() => {});

  // Reset model coordinates
  mesh.position.set(0, -100, 50);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.setScalar(400);
}

/**
 * Open tutorial page.
 */
function openTutorial() {
  console.warn(`OPEN TUTORIAL.`);

  // 1. Remove handler.
  removeHandler();

  // 2. Update GUI
  $('#tutorials_back').addClass('animate__animated animate__fadeIn');
  $('#tutorials_back').css('z-index', '300');
}

/**
 * Close Tutorial page
 */
function closeTutorial() {
  console.warn(`CLOSE TUTORIAL.`);

  // 1. Again add eventListener when closing tutorials
  document.addEventListener('touchstart', onDocumentTouchStart, false);

  // 2. Update GUI
  document.getElementById('tutorials_back').style.zIndex = '0';
  document.getElementById('tutorials_back').style.opacity = '0';
}

/**
 * Get touch coordinates when user touch on screen.
 * @param event
 */
function onDocumentTouchStart(event) {
  event.preventDefault();

  // console.error(`click: ${mouse.x}, ${mouse.y}`);

  const scaled = letsee.threeRenderer().getEffectiveSize();
  let x = +(event.changedTouches[0].pageX / scaled.effectiveWidth) * 2 - 1;
  let y = -(event.changedTouches[0].pageY / scaled.effectiveHeight) * 2 + 1;

  // console.error(x, y, scaled.scale);

  mouse.x = x ; // /window.devicePixelRatio;
  mouse.y = y ; // /window.devicePixelRatio;

  // console.error(`mouse: ${mouse.x}, ${mouse.y}`);

  findIntersectionAndButtonHandler();
}

/**
 * Reset model as original.
 * 1. Stop all audios, except click sound.
 * 2. Reset all buttons.
 * 3. Reset model coordinates and scale.
 * 4. Reset model materials.
 * 5. Remove all videos and stop playing.
 * 6. Reset all animations
 */
function resetModel() {

  console.error(`RESET MODEL!`);

  // 1. Stop all audios except click sound
  resetAudio();

  // 2. Reset all buttons and again add only main buttons.
  mesh.remove(
      btnOpenVideo,
      btnKnockOn,
      btnOpenRightDoor,
      btnOpenFilter,
      btnFilterNumberOne,
      btnFilterNumberTwo,
      btnFilterNumberThree,
      btnIceDrop,
      btnIcePlus,
      btnCloseIceVideo,
      btnCloseFilterVideo,
      btnUV,
      btnFoldingShelf,
      btnMultiCorner,
      btnLargeBasket);
  resetButtonMaterials();

  // 3. Reset model coordinates
  mesh.position.set(0, -100, 50);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.setScalar(400);
  if (transparentMesh) {
    transparentMesh.rotation.set(0, 0, 0);
    transparentMesh.scale.setScalar(400);
  }

  // 4. Change material of the door_up_right as original
  mesh.children.forEach(child => {
    child.traverse(function(obj) {
      if (obj.name === 'door_up_R') {
        obj.children.forEach(o => {
          (o.type === 'Mesh' && o.material.name === 'glass_mtl') ? o.material.visible = true : '';
        })
      }
    })
  });

  let bottleMat = new THREE.MeshStandardMaterial( {
    color: 0xFFFFFF,
    colorWrite: true,
    emissive: { b: 0, g: 0, r: 0},
    emissiveIntensity: 1,
    transparent: false,
    opacity: 1,
    fog: true,
    metalness: 1,
    roughness:0.2,
    alphaTest:0,
    blendEquation: 100,
    blendDst: 205,
    blendSrc: 204,
    blending: 1,
    bumpScale: 1
  });

  // Set custom material for soda_bottle
  doorUpRightGroup.children.forEach(g => {
    if (g.name === 'soda_bottle') {
      g.children.forEach(child => {
        child.traverse(function(obj) {
          if (obj.type === 'Mesh' && obj.material.name === 'soda_bottle_mtl') {
            obj.material = bottleMat;
          }
        })
      });
    }
  })

  // 5. Remove all videos and stop playing.
  mesh.children.forEach(child => {
    if (child.name === 'MeshForIceVideo' || child.name === 'MeshForFilterVideo') {
      mesh.remove(child);

      video = null;
      videoTexture = null;

      videoFilter = null;
      videoFilterTexture = null;
    }
  })

  // 6. Reset all animations
  // if (TWEEN) TWEEN.removeAll();

  // 7. Check to stop all previous animations
  cancelAnimationFrame(idTubeAnim);
  nEnd = 0;
  tube.children = [];
  transparentMesh.remove(tube);

  cancelAnimationFrame(fadeInNum);
  cancelAnimationFrame(fadeOutNum);
  stopDoorCaseAndSodaBottle();

  if (isOpenSlidingShelf) {
    closeShelf();
    bodyInsideGroup.children.forEach(c => {

      // Reset watermelon
      if (c.name === 'watermelon') {
        c.visible = false;
        c.position.y = 0.31;
      }

      // Reset the pot
      if (c.name === 'pot') {
        c.visible = true;
        c.position.y = -0.12;
      }
    })
  }


  if (isOpenInside && topTabFlag === 'exterior') {
    // Close Inside
    closeInside();
  }
  if (isOpenInside && topTabFlag === 'inside') {
    openInside();
  }

  if (isOpenFilter) {
    // Close Filter
    closeFilterAnimation();
  }

  if (isOpenDoor) {
    // Close Door
    closeMagicDoor();
  }

  if (isPlayDoorCase) {
    // Stop play door case
    closeMagicDoor();
  }

  if (isOpenLinear) {
    // Stop Linear
    stopLinearAnimation();
  }

}

/**
 * Reset all TTS sounds except Click sound.
 */
function resetAudio() {

  iceSound.pause();               iceSound.currentTime = 0;
  magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
  magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
  magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
  filterSound.pause();            filterSound.currentTime = 0;
  uvSound.pause();                uvSound.currentTime = 0;
  foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
  multiCornerSound.pause();       multiCornerSound.currentTime = 0;
  largeBasketSound.pause();       largeBasketSound.currentTime = 0;
  doorCaseSound.pause();          doorCaseSound.currentTime = 0;
  linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

}

/**
 * Move model into center for IceDrop.
 */
function moveModelToCenterForIce() {

  const temp = {
    elements: [0.9985127357536235, 0.004176559868682149, -0.05435874249352514, 0, -0.0028787256625432646, 0.9997094489211082, 0.023931792168867122, 0, 0.05444290106500458, -0.023739715363022967, 0.9982346399710385, 0, 13, -15, -180, 1],
    isMatrix4: true,
  }

  toystory.matrixAutoUpdate = false;
  toystory.matrix.identity();
  toystory.applyMatrix4(temp);
  toystory.updateMatrix();
  toystory.visible = true;

  // 1. Pause tracking
  const isPaused = letsee.pause();
  console.error(`PAUSED!`);

  // 2. Set model center
  if (isPaused) {
    mesh.remove(btnIcePlus);
    mesh.add(btnIceDrop);
  }

}

/*function moveModelToCenterForIce() {

  if (TWEEN) TWEEN.removeAll();

  let startValue = {
    temp: {
      elements: toystory.matrix.elements,
      isMatrix4: true
    }
  };
  let endValue = {
    temp: {
      elements: [0.9985127357536235, 0.004176559868682149, -0.05435874249352514, 0, -0.0028787256625432646, 0.9997094489211082, 0.023931792168867122, 0, 0.05444290106500458, -0.023739715363022967, 0.9982346399710385, 0, 13, -15, -180, 1],
      isMatrix4: true
    }
  };

  let tween = new TWEEN.Tween(startValue).to(endValue, 1000);
  tween.onUpdate(() => {

    toystory.visible = true;
    toystory.matrixAutoUpdate = false;
    toystory.matrix.identity();
    toystory.applyMatrix4(startValue.temp);
    toystory.updateMatrix();

  });
  tween.onComplete(() => {

    const isPaused = letsee.pause();
    if (isPaused) {
      mesh.remove(btnIcePlus);
      mesh.add(btnIceDrop);
    }

  });
  tween.start();

}*/

/**
 * Set model center of screen.
 */
function setModelCenter() {

  console.warn(`setModelCenter`);

  const temp = {
    // elements: [0.9996717718958484, 0.0062402214640219465, -0.02484769829772193, 0, -0.0025224514927073274, 0.9891437930727777, 0.14692921378699628, 0, 0.02549481737690216, -0.14681831037604906, 0.988834868936791, 0, -10.489514205452574, -2.8702186425177274, -300.4471307995897, 1],
    elements: [500, 0, 0, 0, 0, 500, 0, 0, 0, 0, 500, 0, -10.489514205452574, -2.8702186425177274, -300.4471307995897, 1],
    isMatrix4: true,
  }

  toystory.matrixAutoUpdate = false;
  toystory.applyMatrix4(temp);
  toystory.updateMatrix();
  toystory.visible = true;
}

/**
 * Find the intersection of the 3D model and touch event.
 */
function findIntersectionAndButtonHandler() {
  raycaster.setFromCamera(mouse, window.camera);

  if (mesh !== undefined) {
    const intersects = raycaster.intersectObjects(mesh.children, true);

    if (intersects.length > 0) {
      const filtered = intersects.filter(
          s => {
            return s.object.type === 'CustomButton';
          },
      );

      if (filtered[0]) {
        INTERSECTED = filtered[0].object;

        switch (INTERSECTED.name) {
          case 'OpenWater':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('OpenWater');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = true;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-water.svg';
            $('.scroll-left p').addClass( 'on');
            document.getElementById('tts-text').innerHTML = '鎬摝旎�, 锟诫ó昙锟� 锟诫崏牍燂拷锟� 鑷眷嚢欷� 锟疥京旯効锟界敱褕韷达锟� 锟斤拷 韪半崏肟� 锟解壀锟� 铵♀懁韤庯拷攵倦 锟诫氦雼旓拷鞉栯挭锟斤拷';

            // Play sound for Water
            magicDisplaySound.volume = 0.6;
            magicDisplaySound.loop = false;
            magicDisplaySound.play().then(() => {});

            break;
          case 'CloseWater':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            mesh.add(btnKnockOn, btnOpenRightDoor);
            toogleButton('CloseWater');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.load();
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // Show bottom narration text
            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            // 4. Remove ice cubes
            mesh.remove(iceGroup);
            mesh.remove(iceCubesFixed);
            mesh.remove(btnIcePlus);
            isOpenIceDrop = false;

            // 5. Zoom camera
            /*setTimeout(() => {
              zoomOutCameraForVideo();
            }, 100);*/

            // Resume tracking
              if (letsee.isPaused()) {
                console.error(`RESUME`);
                // letsee.resume([0.9996717718958484, 0.0062402214640219465, -0.02484769829772193, 0, -0.0025224514927073274, 0.9891437930727777, 0.14692921378699628, 0, 0.02549481737690216, -0.14681831037604906, 0.988834868936791, 0, -10.489514205452574, -2.8702186425177274, -300.4471307995897, 1]);
                letsee.resume([0.9996717718958484, 0.0062402214640219465, -0.02484769829772193, 0, -0.0025224514927073274, 0.9891437930727777, 0.14692921378699628, 0, 0.02549481737690216, -0.14681831037604906, 0.988834868936791, 0, -10.489514205452574, 30.5702186425177274, -250.4471307995897, 1]);
                mesh.remove(btnIceDrop);
              }

            break;
          case 'IcePlus':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = true;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // zoomInCameraForVideo(track);
            moveModelToCenterForIce();
            break;
          case 'OpenIceDrop':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            // 1. Update variables for clicks on button
            isOpenIceDrop             = true;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            console.warn(`OPEN ICE DROP!`);
            openIceDrop();
            break;
          case 'OpenMagicDoor':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('OpenMagicDoor');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = true;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound and magicSpaceDoorSound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // 3. Play sound for magicSpaceDoorSound
            magicSpaceDoorSound.volume = 0.6;
            magicSpaceDoorSound.loop = false;
            magicSpaceDoorSound.play().then(() => {});

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-magic-space.svg';
            $('.scroll-left p').removeClass( 'on');
            document.getElementById('tts-text').innerHTML = '锟诫惐鞓ｆ€拷 锟斤拷 锟斤拷 锟届剮甑癸拷锟� 瑾橂獌霑� 锟诫惐鞓ｆ€拷';

            openMagicDoor();
            break;
          case 'CloseMagicDoor':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('CloseMagicDoor');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            // 3. Remove button
            mesh.remove(btnCaseDoorMoving);

            closeMagicDoor();
            break;
          case 'KnockOn':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('KnockOn');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = true;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound and magicSpaceKnockOnSound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                filterSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // 3. Play sound for magicSpaceKnockOnSound
            magicSpaceKnockOnSound.volume = 0.6;
            magicSpaceKnockOnSound.loop = false;
            magicSpaceKnockOnSound.play().then(() => {});

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-knok.svg';

            $('.scroll-left p').removeClass( 'on');
            document.getElementById('tts-text').innerHTML = '锟诫獏瓴曪霘憹婵★拷 锟诫惐鞓ｆ€拷 锟诫寑锟� 锟诫氦鞌�';

            // 4. Update buttons
            mesh.remove(btnOpenVideo);
            mesh.remove(btnOpenRightDoor);
            mesh.remove(btnOpenFilter);

            // 5. Change material
            mesh.children.forEach(child => {
              child.traverse(function(obj) {

                if (obj.name === 'door_up_R') {
                  //obj.children[4].material = transMat;
                  obj.children.forEach(o => {
                    // (o.type === 'Mesh' && o.name === 'door_up_R_5_4') ? o.material.visible = false : '';
                    (o.type === 'Mesh' && o.material.name === 'glass_mtl') ? o.material.visible = false : '';
                  })
                }
              })
            });

            break;
          case 'KnockOff':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('KnockOff');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            document.getElementById('narration-panel').style.display = 'none';
            document.getElementById('message').style.display = 'flex';

            // 4. Update button
            mesh.add(btnOpenVideo);
            mesh.add(btnOpenRightDoor);
            mesh.remove(btnOpenFilter);

            // 5. Reset material for door when user clicks reset
            mesh.children.forEach(child => {
              child.traverse(function(obj) {

                if (obj.name === 'door_up_R') {
                  obj.children.forEach(o => {
                    (o.type === 'Mesh' && o.material.name === 'glass_mtl') ? o.material.visible = true : '';
                  })
                }
              })
            });

            break;
          case 'CaseDoorMoving':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('CaseDoorMoving');

            isPlayDoorCase = true;

            // 1. Stop all audios except click sound and doorCaseSound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // 2. Play sound for door case moving
            doorCaseSound.volume = 0.6;
            doorCaseSound.loop = false;
            doorCaseSound.play();

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-move-basket.svg';

            $('.scroll-left p').removeClass( 'on');
            document.getElementById('tts-text').innerHTML = '锟姐吋爰囷拷锟� 锟诫鞌狅拷锟� 锟届暪鞓辩尫锟� 韫傠嬁锟�';

            mesh.remove(btnOpenRightDoor);

            proceedAnimation('play_door_case');
            break;
          case 'CaseDoorClose':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('CaseDoorClose');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase            = false;
            isOpenDoor                = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            stopSodaBottleAnim();

            break;
          case 'OpenFilter':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('OpenFilter');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = true;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            openFilterAnimation();
            break;
          case 'CloseFilter':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('CloseFilter');

            // 1. Update variables for clicks on button
            isOpenIceDrop             = false;
            isMagicDisplayClicked     = false;
            isMagicSpaceDoorClicked   = false;
            isKnockOnClicked          = false;
            isFilterClicked           = false;
            isLinearCompressorClicked = false;
            isPlayDoorCase = false;

            // 2. Stop other audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            closeFilterAnimation();
            break;
          case 'UVClick':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('UVClick');

            // 1. Stop all audios except click sound and uvSound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // 2. Play sound for UV
            uvSound.volume = 0.6;
            uvSound.loop = false;
            uvSound.play().then(() => {});

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-uv.svg';

            $('.scroll-left p').removeClass( 'on');
            document.getElementById('tts-text').innerHTML = '锟诫惐鞓ｆ€雰� 鎬摝毽帮В锟届牂婀诧拷';

            break;
          case 'UVClose':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('UVClose');

            // 2. Stop all audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            break;
          case 'FoldingShelf':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            isOpenSlidingShelf = true;
            toogleButton('FoldingShelf');

            // 1. Stop all audios except click sound and foldingShelfSound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // 2. Play sound for FoldingShelf
            foldingShelfSound.volume = 0.6;
            foldingShelfSound.loop = false;
            foldingShelfSound.play().then(() => {});

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-folding.svg';
            $('.scroll-left p').removeClass( 'on');
            document.getElementById('tts-text').innerHTML = '锟届剮旎拷雽€甑� 鎬硹雱″獩靾堨敔 閬猴拷锟届嚚锟� 锟斤拷 锟届暪鞓辩尫锟� 韫傠嬁锟�';

            break;
          case 'FoldingShelfClose':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            isOpenSlidingShelf = false;
            toogleButton('FoldingShelfClose');

            // 2. Stop all audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            break;
          case 'MultiCorner':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('MultiCorner');

            // 1. Stop all audios except click sound and multiCornerSound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // 2. Play sound for MultiCorner
            multiCornerSound.volume = 0.6;
            multiCornerSound.loop = false;
            multiCornerSound.play().then(() => {});

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-multi-corner.svg';

            $('.scroll-left p').removeClass( 'on');
            document.getElementById('tts-text').innerHTML = '锟疥京鞌狅拷锟� 绉混剰飓帮拷旯嗢摚 韫傠嬁锟�';

            break;
          case 'MultiCornerClose':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('MultiCornerClose');

            // 2. Stop all audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // Show bottom narration text
            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            break;
          case 'LargeBasket':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('LargeBasket');

            // 1. Stop all audios except click sound and largeBasketSound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // 2. Play sound for LargeBasket
            largeBasketSound.volume = 0.6;
            largeBasketSound.loop = false;
            largeBasketSound.play().then(() => {});

            // Show bottom narration text
            document.getElementById('message').style.display = 'none';
            document.getElementById('narration-panel').style.display = 'flex';
            document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-large-basket.svg';

            $('.scroll-left p').removeClass( 'on');
            document.getElementById('tts-text').innerHTML = '锟斤拷 锟解懜鞗撅拷锟� 锟届剮甓旇珱攵诫巹锟斤拷';

            break;
          case 'LargeBasketClose':
            console.warn(`CLICK!`);
            clickSound.play().then(() => {});

            toogleButton('LargeBasketClose');

            // 2. Stop all audios except click sound
            iceSound.pause();               iceSound.currentTime = 0;
            magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
            magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
            magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
            filterSound.pause();            filterSound.currentTime = 0;
            uvSound.pause();                uvSound.currentTime = 0;
            foldingShelfSound.pause();      foldingShelfSound.currentTime = 0;
            multiCornerSound.pause();       multiCornerSound.currentTime = 0;
            largeBasketSound.pause();       largeBasketSound.currentTime = 0;
            doorCaseSound.pause();          doorCaseSound.currentTime = 0;
            linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

            // Show bottom narration text
            document.getElementById('message').style.display = 'flex';
            document.getElementById('narration-panel').style.display = 'none';

            break;
        }
      }
    }
  }
}

/**
 * Open Door when view in 3D.
 */
function openDoorFor3D() {
  clickSound.play().then(() => {});
  document.getElementById('btn_opendoor').style.display = 'none';
  document.getElementById('btn_closedoor').style.display = 'block';

  openInside(is3Dview=true);
}

/**
 * Close Door when view in 3D.
 */
function closeDoorFor3D() {
  clickSound.play().then(() => {});
  document.getElementById('btn_opendoor').style.display = 'block';
  document.getElementById('btn_closedoor').style.display = 'none';

  closeInside(is3Dview=true);
}
let timer;
window.onload = () => {

  let btGestureOff = document.getElementById('gesture-off');
  let tab1 = document.getElementById('tab-1');
  let tab2 = document.getElementById('tab-2');
  let tab3 = document.getElementById('tab-3');
  let tab4 = document.getElementById('tab-4');
  let btnOpenTutorial = document.getElementById('btn-tutorials');
  let btCloseTutorial = document.getElementById('btClose');
  let btnOpenDoorFor3D = document.getElementById('btn_opendoor');
  let btnCloseDoorFor3D = document.getElementById('btn_closedoor');

  tab1.addEventListener('click', () => {
    switchTab('exterior')
  });
  tab2.addEventListener('click', () => {
    switchTab('inside')
  });
  tab3.addEventListener('click', () => {
    switchTab('cooling');
  });

  tab4.addEventListener('click', () => rotateAndScale());
  btGestureOff.addEventListener('click', () => resetAfterScale());
  btnOpenDoorFor3D.addEventListener('click', () => openDoorFor3D());
  btnCloseDoorFor3D.addEventListener('click', () => closeDoorFor3D());

  btnOpenTutorial.addEventListener('click', () => switchTab('tutorials'));
  if (btCloseTutorial) btCloseTutorial.addEventListener('click', () => closeTutorial());

  // Loading layout
  if (circle) {
    circle = document.querySelector('circle');
    let radius = circle.r.baseVal.value;
    circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
  }

};

/**
 * When screen is turn off => pause the sound.
 */
document.addEventListener('visibilitychange', function(){
  if (document.hidden) {
    console.error(`Document is hidden`);

    // Pause all audios and reload it to start it again
    iceSound.pause();
    magicDisplaySound.pause();
    magicSpaceDoorSound.pause();
    magicSpaceKnockOnSound.pause();
    filterSound.pause();
    linearCompressorSound.pause();

    setTimeout(function() {
      magicDisplaySound.load();
      magicSpaceDoorSound.load();
      magicSpaceKnockOnSound.load();
      filterSound.load();
      linearCompressorSound.load();
    }, 10);
  }
  else {

    if (isOpenIceDrop) {
      console.error(`IceGroup is playing...`);
    }
    else {
      console.error(`IceGroup is NOT playing...`);
      if (isMagicDisplayClicked)     magicDisplaySound.play().then(() => {});
      if (isMagicSpaceDoorClicked)   magicSpaceDoorSound.play().then(() => {});
      if (isKnockOnClicked)          magicSpaceKnockOnSound.play().then(() => {});
      if (isFilterClicked)           filterSound.play().then(() => {});
      if (isLinearCompressorClicked) linearCompressorSound.play().then(() => {});
    }

  }
}, false);

/**
 * Stop all audios.
 */
function stopAllAudios() {

  console.warn(`stopAllAudios`);

  iceSound.pause();               iceSound.currentTime = 0;
  magicDisplaySound.pause();      magicDisplaySound.currentTime = 0;
  magicSpaceDoorSound.pause();    magicSpaceDoorSound.currentTime = 0;
  magicSpaceKnockOnSound.pause(); magicSpaceKnockOnSound.currentTime = 0;
  filterSound.pause();            filterSound.currentTime = 0;
  uvSound.pause();                uvSound.currentTime = 0;
  doorCaseSound.pause();          doorCaseSound.currentTime = 0;
  linearCompressorSound.pause();  linearCompressorSound.currentTime = 0;

}

/**
 * Loading layout.
 * @param percent
 */
function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  if (circle) circle.style.strokeDashoffset = offset;
}