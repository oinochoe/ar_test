
let iceMesh,
    iceGroup,
    iceCubesFixed;

let doorUpRightGroup,
    doorDownRightGroup,
    doorDownLeftGroup,
    doorUpLeftGroup,
    bodyInsideGroup;

let mainURL = 'https://intra.letsee.io/3D-model/gltf/';

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

// DRACO
let dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://demo.letsee.io/confinity/js/draco/');
// Optional: Pre-fetch Draco WASM/JS module.
dracoLoader.preload();

/**
 * Show the progress of loading model
 * @param xhr
 */
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    // console.warn(Math.round(percentComplete) + '%');
    document.getElementById('percent').innerText = Math.round(percentComplete) + '%';

    setProgress(Math.round(percentComplete));

    if (Math.round(percentComplete) === 100) {
      setTimeout(() => {
        // Open tutorial at the first time running app
        openTutorial();

        document.getElementById('hint').style.display = 'none';
        document.getElementById('info').style.display = 'block';
        document.getElementById('bottom').style.display = 'flex';
      }, 1000);
    }
  }
}

/**
 * Show error if loading error.
 * @param e
 */
function onError(e) {
  console.error(e);
}

/**
 * 1. Load whole model of fridge and other objects.
 * 2. Make animation clips.
 * 3. Add model into Entity.
 */
function loadFridge(_track) {
  return new Promise((resolve) => {

    // Instantiate a gltfLoader
    let gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setDRACOLoader( dracoLoader );

    // gltfLoader.load( mainURL + 'lgDIOS/20201214/lg_dios_all.glb', function(gltf) {
    gltfLoader.load( mainURL + 'lgDIOS/20210120/lg_dios_non_shelf.glb', function(gltf) {

      let root = _track(gltf.scene);

      gltf.scene.position.set(0, -100, 50);
      gltf.scene.visible = true;
      gltf.scene.tag = 'Fridge';
      gltf.scene.name = 'lgDIOS_201023_v01';
      gltf.scene.scale.setScalar(400);

      gltf.scene.animations = [];
      gltf.scene.originAnims = [];
      transparentMesh = _track(gltf.scene.clone());
      // transparentMesh.remove(transparentMesh.children[8]);
      transparentMesh.name = 'ClonedMesh';

      // Create custom animation clips
      (gltf.animations.length > 0) ? gltf.scene.originAnims = gltf.animations : '';

      resolve(root);

    }, onProgress, onError);
  })

}

/**
 * Load objects inside the fridge.
 */
function loadInsideObjects(_track) {

  return new Promise(resolve => {

    loadDoorUpRightObjects(_track);
    loadDoorUpLeftObjects(_track);

    loadDoorDownRightObjects(_track);
    loadDoorDownLeftObjects(_track);

    loadBodyInsideObjects(_track);

    resolve(`loadInsideObjects loaded completed!`);
  })

}

/**
 * Load main objects inside the fridge.
 * @param _track
 */
function loadBodyInsideObjects(_track) {

  bodyInsideGroup = new THREE.Group();
  bodyInsideGroup.name = 'bodyInsideGroup';
  bodyInsideGroup.position.set(0, 0.01, 0.1);
  bodyInsideGroup.scale.setScalar(1);

  // Instantiate a gltfLoader
  let mainInsideLoader = new THREE.GLTFLoader();
  mainInsideLoader.setDRACOLoader( dracoLoader );

  // Load ice_cream
  mainInsideLoader.load( mainURL + 'lgDIOS/20201214/ice_cream.glb', function(gltf) {

    // ice_cream_1
    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'ice_cream';
    gltf.scene.position.set(0, 0, -0.101);
    gltf.scene.scale.setScalar(1);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    // ice_cream_1
    let ice_cream_1 = _track(gltf.scene);
    bodyInsideGroup.add(ice_cream_1);

    // ice_cream_2
    let ice_cream_2 = _track(gltf.scene.clone());
    ice_cream_2.position.set(-0.025, 0, -0.101);
    bodyInsideGroup.add(ice_cream_2);

    // ice_cream_3
    let ice_cream_3 = _track(gltf.scene.clone());
    ice_cream_3.position.set(-0.05, 0, -0.101);
    bodyInsideGroup.add(ice_cream_3);

  });

  // Load meat_fish
  mainInsideLoader.load( mainURL + 'lgDIOS/draco512/meat_fish_draco512.glb', function(gltf) {

    // meat_fish
    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'meat_fish';
    gltf.scene.position.set(0.001, -0.01, -0.101);
    gltf.scene.scale.setScalar(1);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    } else console.warn(`Model [${gltf.scene.name}] does not have animation.`);

    let meat_fish = _track(gltf.scene);
    bodyInsideGroup.add(meat_fish);

  });

  // Load egg
  mainInsideLoader.load( mainURL + 'lgDIOS/20201214/egg_package.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'egg';
    gltf.scene.position.set(0.015, -0.02, -0.105);
    gltf.scene.scale.setScalar(1);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    //egg_1
    let egg_1 = _track(gltf.scene);
    bodyInsideGroup.add(egg_1);

    // egg_2
    let egg_2 = _track(egg_1.clone());
    egg_2.position.set(0.015, 0, -0.105);
    bodyInsideGroup.add(egg_2);

  });

  // Load cheese
  mainInsideLoader.load( mainURL + 'lgDIOS/20201214/cheese_plane.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'cheese';
    gltf.scene.position.set(0, -0.0035, -0.101);
    gltf.scene.scale.setScalar(1);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    let cheese = _track(gltf.scene);
    bodyInsideGroup.add(cheese);

  });

  // Load macarons
  mainInsideLoader.load( mainURL + 'lgDIOS/20201214/macarons_plane.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'macarons';
    gltf.scene.position.set(0, -0.0035, -0.101);
    gltf.scene.scale.setScalar(1);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    let macarons = _track(gltf.scene);
    bodyInsideGroup.add(macarons);

  });

  // Load vegetable
  mainInsideLoader.load( mainURL + 'lgDIOS/20201214/vegetable_plane.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'vegetable';
    gltf.scene.position.set(0, -0.01, -0.101);
    gltf.scene.scale.setScalar(1);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    let vegetable = _track(gltf.scene);
    bodyInsideGroup.add(vegetable);

  });

  // Load fruit
  mainInsideLoader.load( mainURL + 'lgDIOS/20201214/fruit_plane.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'fruit';
    gltf.scene.position.set(0, -0.01, -0.101);
    gltf.scene.scale.setScalar(1);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    let fruit = _track(gltf.scene);
    bodyInsideGroup.add(fruit);

  });

  // Load pot
  mainInsideLoader.load( mainURL + 'lgDIOS/draco/pot_draco.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'pot';
    gltf.scene.position.set(0, -0.12, -0.101);
    gltf.scene.scale.setScalar(1.2);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    let pot = _track(gltf.scene);
    bodyInsideGroup.add(pot);

  });

  // Load watermelon
  mainInsideLoader.load( mainURL + 'lgDIOS/20210120/melon.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'watermelon';
    gltf.scene.position.set(0.05, 0.31, -0.1);
    gltf.scene.rotateY(Math.PI/180 * 90);
    gltf.scene.scale.setScalar(0.25);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.originAnims = gltf.animations;
    }

    let watermelon = _track(gltf.scene);
    watermelon.visible = false;
    bodyInsideGroup.add(watermelon);

  });

  // sliding shelf
  mainInsideLoader.load( mainURL + 'lgDIOS/20210120/shelf.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'sliding_shelf';
    gltf.scene.position.set(0, -0.01, -0.101);
    gltf.scene.scale.setScalar(1);
    gltf.scene.originAnims = [];

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.originAnims = gltf.animations;

      openSlidingShelfClip = THREE.AnimationUtils.subclip(gltf.scene.originAnims[0], 'play_sliding_shelf', 0, 50, 10);
      closeSlidingShelfClip = THREE.AnimationUtils.subclip(gltf.scene.originAnims[0], 'close_sliding_shelf', 50, 80, 10);

      // push to animation list
      gltf.scene.animations.push(openSlidingShelfClip);
      gltf.scene.animations.push(closeSlidingShelfClip);
    }

    let slidingShelf = _track(gltf.scene);
    bodyInsideGroup.add(slidingShelf);

  });

  // Load cakebox
  mainInsideLoader.load( mainURL + 'lgDIOS/draco/cakebox_draco.glb', function(gltf) {

    gltf.scene.visible = true;
    gltf.scene.tag = 'InsideFridge';
    gltf.scene.name = 'cakebox';
    gltf.scene.position.set(0.06, 0.06, -0.101);
    gltf.scene.scale.setScalar(0.8);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    let cakebox = _track(gltf.scene);
    bodyInsideGroup.add(cakebox);

  });

  // Add bodyInsideGroup into mesh
  mesh.children.forEach(c => {
    if (c.name === 'body') {
      c.children.forEach(o => {
        if (o.name === 'body_8') {
          o.add(bodyInsideGroup);
        }
      })
    }
  })

}

/**
 * Load objects for door_up_right
 */
function loadDoorUpRightObjects(_track) {

  return new Promise(resolve => {

    doorUpRightGroup = new THREE.Group();
    doorUpRightGroup.name = 'doorUpRightGroup';
    doorUpRightGroup.position.set(0, 0, 0.1);
    doorUpRightGroup.scale.setScalar(1);

    // Instantiate a gltfLoader
    let doorUpRightLoader = new THREE.GLTFLoader();
    doorUpRightLoader.setDRACOLoader( dracoLoader );

    // Load soda_can
    // doorUpRightLoader.load( mainURL + 'lgDIOS/draco512/sodacan_draco512.glb', function(gltf) {
    doorUpRightLoader.load( mainURL + 'lgDIOS/20201214/soda_can.glb', function(gltf) {

      // can_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'soda_can';
      gltf.scene.position.set(0, 0, -0.09);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      }

      // can_1
      let can_1 = _track(gltf.scene);
      doorUpRightGroup.add(can_1);

      // can_2
      let can_2 = _track(gltf.scene.clone());
      can_2.position.set(-0.02, 0, -0.09);
      doorUpRightGroup.add(can_2);

      // can_3
      let can_3 = _track(gltf.scene.clone());
      can_3.position.set(-0.04, 0, -0.09);
      doorUpRightGroup.add(can_3);

      // Add doorUpRightGroup into door_up_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_up_R') {
          child.add(doorUpRightGroup);
        }
      })

    });

    // Load soda_bottle
    // doorUpRightLoader.load( mainURL + 'lgDIOS/draco512/soda_bottle_draco512.glb', function(gltf) {
    doorUpRightLoader.load( mainURL + 'lgDIOS/20201214/soda_bottle.glb', function(gltf) {

      // soda_bottle_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'soda_bottle';
      gltf.scene.position.set(0, 0, -0.09);
      gltf.scene.animations=[];

      /*gltf.scene.position.set(0.13, 0, 0.02);
      gltf.scene.rotateY(Math.PI/180 * 170);*/
      gltf.scene.scale.setScalar(1);

      let bottleMat = new THREE.MeshStandardMaterial( {
        color: 0xFFFFFF,
        // color: {b: 0.5, g:0.5, r: 0.5},
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

      // Set custom material for soda_bottle.
      gltf.scene.children.forEach(child => {
        child.traverse(function(obj) {
          if (obj.type === 'Mesh' && obj.material.name === 'soda_bottle_mtl') {
            obj.material = bottleMat;
          }
        })
      });

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;

        playSodaBottleClip = THREE.AnimationUtils.subclip(gltf.animations[0], 'soda_bottle_anim', 1, 100, 9);

        // push to animation list
        gltf.scene.animations.push(playSodaBottleClip);
        mesh.animations.push(playSodaBottleClip);

        /* playSodaBottleMixer = new THREE.AnimationMixer(gltf.scene);
         let action = playSodaBottleMixer.clipAction( gltf.animations[ 0 ] );
         action.play();*/

      } else console.warn(`Model [${gltf.scene.name}] does not have animation.`);

      let soda_bottle_1 = _track(gltf.scene);
      doorUpRightGroup.add(soda_bottle_1);

      // soda_bottle_2
      let soda_bottle_2 = _track(gltf.scene.clone());
      soda_bottle_2.animations = gltf.scene.animations;
      soda_bottle_2.position.set(-0.02, 0, -0.09); //soda_bottle_2.position.set(0.11, 0, 0.02);
      doorUpRightGroup.add(soda_bottle_2);

      // soda_bottle_3
      let soda_bottle_3 = _track(gltf.scene.clone());
      soda_bottle_3.animations = gltf.scene.animations;
      soda_bottle_3.position.set(-0.04, 0, -0.09); //soda_bottle_3.position.set(0.09, 0, 0.02);
      doorUpRightGroup.add(soda_bottle_3);

      // Add doorUpRightGroup into door_up_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_up_R') {
          child.add(doorUpRightGroup);
        }
      })
    });

    // Load wine
    // doorUpRightLoader.load( mainURL + 'lgDIOS/draco512/wine_draco512.glb', function(gltf) {
    doorUpRightLoader.load( mainURL + 'lgDIOS/20201214/wine.glb', function(gltf) {

      // wine_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'Fridge';
      gltf.scene.name = 'wine';
      gltf.scene.position.set(-0.005, 0, -0.08);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      }

      let wine_1 = _track(gltf.scene);
      doorUpRightGroup.add(wine_1);

      // wine_2
      let wine_2 = _track(gltf.scene.clone());
      wine_2.position.set(-0.025, 0, -0.08);
      doorUpRightGroup.add(wine_2);

      // wine_3
      let wine_3 = _track(gltf.scene.clone());
      wine_3.position.set(-0.045, 0, -0.08);
      doorUpRightGroup.add(wine_3);

      // Add doorUpRightGroup into door_up_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_up_R') {
          child.add(doorUpRightGroup);
        }
      })
    });

    // Load vodka
    /*doorUpLoader.load( mainURL + 'lgDIOS/inside_obj/vodka.glb', function(gltf) {

      // vodka_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'vodka';
      gltf.scene.position.set(0, 0, -0.1);
      gltf.scene.scale.setScalar(1);

      // Set opacity of objects
      /!*gltf.scene.children.forEach(child => {
        child.traverse(function(obj) {
          if (obj.type === 'Mesh') {
            obj.material.opacity = 0.8;
          }
        })
      });*!/

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      } else console.warn(`Model [${gltf.scene.name}] does not have animation.`);

      doorUpRightGroup.add(gltf.scene);
      // addAxesHelper(gltf.scene);

      // vodka_2
      let vodka_2 = gltf.scene.clone();
      vodka_2.position.set(-0.02, 0, -0.1);
      doorUpRightGroup.add(vodka_2);

      // vodka_3
      let vodka_3 = gltf.scene.clone();
      vodka_3.position.set(-0.04, 0, -0.1);
      doorUpRightGroup.add(vodka_3);

      // Add doorUpRightGroup into door_up_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_up_R') {
          child.add(doorUpRightGroup);
        }
      })
    });*/

    resolve(`DoorUpRightObjects loaded completed!`);
  })

}

/**
 * Load objects for door_down_right
 */
function loadDoorDownRightObjects(_track) {
  return new Promise(resolve => {

    doorDownRightGroup = new THREE.Group();
    doorDownRightGroup.name = 'doorDownRightGroup';
    doorDownRightGroup.position.set(0, 0, 0.1);
    doorDownRightGroup.scale.setScalar(1);

    // Instantiate a gltfLoader
    let doorDownRightLoader = new THREE.GLTFLoader();
    doorDownRightLoader.setDRACOLoader( dracoLoader );

    // Load short_jar
    doorDownRightLoader.load( mainURL + 'lgDIOS/20201214/jar_short.glb', function(gltf) {

      // short_jar_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'jar_short';
      gltf.scene.position.set(-0.045, 0, -0.101);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      }

      // short_jar_1
      let short_jar_1 = _track(gltf.scene);
      doorDownRightGroup.add(short_jar_1);

      // short_jar_2
      let short_jar_2 = _track(gltf.scene.clone());
      short_jar_2.position.set(-0.023, 0, -0.101);
      doorDownRightGroup.add(short_jar_2);

      // short_jar_3
      let short_jar_3 = _track(gltf.scene.clone());
      short_jar_3.position.set(0, 0, -0.101);
      doorDownRightGroup.add(short_jar_3);

      // Add doorDownRightGroup into door_down_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_dn_R') {
          child.add(doorDownRightGroup);
        }
      })
    });

    // Load long_jar
    doorDownRightLoader.load( mainURL + 'lgDIOS/20201214/jar_long.glb', function(gltf) {

      // long_jar_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'jar_long';
      gltf.scene.position.set(-0.045, 0, -0.101);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      }

      // long_jar_1
      let long_jar_1 = _track(gltf.scene);
      doorDownRightGroup.add(long_jar_1);

      // long_jar_2
      let long_jar_2 = _track(gltf.scene.clone());
      long_jar_2.position.set(-0.023, 0, -0.101);
      doorDownRightGroup.add(long_jar_2);

      // long_jar_3
      let long_jar_3 = _track(gltf.scene.clone());
      long_jar_3.position.set(0, 0, -0.101);
      doorDownRightGroup.add(long_jar_3);

      // Add doorDownRightGroup into door_down_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_dn_R') {
          child.add(doorDownRightGroup);
        }
      })
    });

    // Load square_jar
    doorDownRightLoader.load( mainURL + 'lgDIOS/draco/jar_square_draco.glb', function(gltf) {

      // square_jar_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'jar_square';
      gltf.scene.position.set(-0.045, 0, -0.101);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      } else console.warn(`Model [${gltf.scene.name}] does not have animation.`);

      // square_jar_1
      let square_jar_1 = _track(gltf.scene);
      doorDownRightGroup.add(square_jar_1);

      // square_jar_2
      let square_jar_2 = _track(gltf.scene.clone());
      square_jar_2.position.set(-0.023, 0, -0.101);
      doorDownRightGroup.add(square_jar_2);

      // square_jar_3
      let square_jar_3 = _track(gltf.scene.clone());
      square_jar_3.position.set(0, 0, -0.101);
      doorDownRightGroup.add(square_jar_3);

      // Add doorDownRightGroup into door_down_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_dn_R') {
          child.add(doorDownRightGroup);
        }
      })
    });

    resolve(`loadDoorDownRightObjects is completed!`);
  })
}

/**
 * Load objects for door_down_left
 */
function loadDoorDownLeftObjects() {
  return new Promise(resolve => {

    doorDownLeftGroup = new THREE.Group();
    doorDownLeftGroup.name = 'doorDownLeftGroup';
    doorDownLeftGroup.position.set(0, 0, 0.1);
    doorDownLeftGroup.scale.setScalar(1);

    // Instantiate a gltfLoader
    let doorDownLeftLoader = new THREE.GLTFLoader();
    doorDownLeftLoader.setDRACOLoader( dracoLoader );

    // Load chocolate_bar
    doorDownLeftLoader.load( mainURL + 'lgDIOS/20201214/chocolate_bar.glb', function(gltf) {

      // chocolate_bar_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'chocolate_bar';
      gltf.scene.position.set(0, 0, -0.101);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      }

      // chocolate_bar_1
      doorDownLeftGroup.add(gltf.scene);

      // chocolate_bar_2
      let chocolate_bar_2 = gltf.scene.clone();
      chocolate_bar_2.position.set(-0.02, 0, -0.101);
      doorDownLeftGroup.add(chocolate_bar_2);

      // Add doorDownRightGroup into door_down_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_dn_L') {
          child.add(doorDownLeftGroup);
        }
      })
    });

    // Load chocolate_box
    doorDownLeftLoader.load( mainURL + 'lgDIOS/draco512/chocobox_draco512.glb', function(gltf) {

      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'chocolate_box';
      gltf.scene.position.set(0, 0, -0.101);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      } else console.warn(`Model [${gltf.scene.name}] does not have animation.`);

      doorDownLeftGroup.add(gltf.scene);

      // Add doorDownRightGroup into door_down_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_dn_L') {
          child.add(doorDownLeftGroup);
        }
      })
    });

    // Load pringles
    doorDownLeftLoader.load( mainURL + 'lgDIOS/20201214/pringles.glb', function(gltf) {

      // pringles_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'pringles';
      gltf.scene.position.set(-0.045, 0, -0.101);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      }

      // pringles_1
      doorDownLeftGroup.add(gltf.scene);

      // pringles_2
      let pringles_2 = gltf.scene.clone();
      pringles_2.position.set(-0.023, 0, -0.101);
      doorDownLeftGroup.add(pringles_2);

      // pringles_3
      let pringles_3 = gltf.scene.clone();
      pringles_3.position.set(0, 0, -0.101);
      doorDownLeftGroup.add(pringles_3);

      // Add doorDownRightGroup into door_down_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_dn_L') {
          child.add(doorDownLeftGroup);
        }
      })
    });

    resolve(`loadDoorDownLeftObjects is completed!`);
  })
}

/**
 * Load objects for door_up_left
 */
function loadDoorUpLeftObjects() {
  return new Promise(resolve => {

    doorUpLeftGroup = new THREE.Group();
    doorUpLeftGroup.name = 'doorUpLeftGroup';
    doorUpLeftGroup.position.set(0, 0, 0.1);
    doorUpLeftGroup.scale.setScalar(1);

    // Instantiate a gltfLoader
    let doorUpLeftLoader = new THREE.GLTFLoader();
    doorUpLeftLoader.setDRACOLoader( dracoLoader );

    // Load beer_can
    doorUpLeftLoader.load( mainURL + 'lgDIOS/20201214/beer_can.glb', function(gltf) {

      // beer_can_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'beer_can';
      gltf.scene.position.set(0, 0, -0.09);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      }

      // beer_can_1
      doorUpLeftGroup.add(gltf.scene);

      // beer_can_2
      let beer_can_2 = gltf.scene.clone();
      beer_can_2.position.set(-0.02, 0, -0.09);
      doorUpLeftGroup.add(beer_can_2);

      // beer_can_3
      let beer_can_3 = gltf.scene.clone();
      beer_can_3.position.set(-0.04, 0, -0.09);
      doorUpLeftGroup.add(beer_can_3);

      // Add doorUpRightGroup into door_up_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_up_L') {
          child.add(doorUpLeftGroup);
        }
      })
    });

    // Load water_bottle
    doorUpLeftLoader.load( mainURL + 'lgDIOS/draco/water_draco.glb', function(gltf) {

      // water_bottle_1
      gltf.scene.visible = true;
      gltf.scene.tag = 'InsideFridge';
      gltf.scene.name = 'water_bottle';
      gltf.scene.position.set(0, 0, -0.09);
      gltf.scene.scale.setScalar(1);

      // Create custom animation clips
      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;
      } else console.warn(`Model [${gltf.scene.name}] does not have animation.`);

      // water_bottle_1
      doorUpLeftGroup.add(gltf.scene);

      // water_bottle_2
      let water_bottle_2 = gltf.scene.clone();
      water_bottle_2.position.set(-0.02, 0, -0.09);
      doorUpLeftGroup.add(water_bottle_2);

      // water_bottle_3
      let water_bottle_3 = gltf.scene.clone();
      water_bottle_3.position.set(-0.04, 0, -0.09);
      doorUpLeftGroup.add(water_bottle_3);

      // Add doorUpRightGroup into door_up_right
      mesh.children.forEach(child => {
        if (child.name === 'axi_door_up_L') {
          child.add(doorUpLeftGroup);
        }
      })
    });

    resolve(`loadDoorUpLeftObjects is completed!`);
  })

}

/**
 * Load Ice model.
 */
function loadIce(_track){

  iceGroup = new THREE.Group();
  iceGroup.name = 'IceGroup';
  iceGroup.type = 'Ice';

  iceCubesFixed= new THREE.Group();
  iceCubesFixed.name = 'IceCubesFixed';
  iceCubesFixed.type = 'Ice';

  // Instantiate a gltfLoader
  let gltfLoader = new THREE.GLTFLoader();
  gltfLoader.setDRACOLoader( dracoLoader );

  gltfLoader.load( mainURL + 'lgDIOS/draco/ice_draco.glb', function(gltf) {

    gltf.scene.position.set(0, 0, 0);
    gltf.scene.visible = true;
    gltf.scene.tag = 'Fridge';
    gltf.scene.name = 'Ice';
    gltf.scene.rotation.y = Math.PI/180* (-10);
    gltf.scene.scale.setScalar(200);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;
    }

    // iceMesh = gltf.scene;
    iceMesh = _track(gltf.scene);

    // 1. Make ice cubes to fall down
    iceGroup.add(iceMesh);
    iceGroup.add(_track(iceMesh.clone()));
    iceGroup.add(_track(iceMesh.clone()));

    iceGroup.position.set(-0.05, 0.25, 0.09);
    iceGroup.scale.setScalar(0.01);
    iceGroup.children[0].rotateY(Math.PI/180 * 60);
    iceGroup.children[1].rotateZ(Math.PI/180 * 60);
    iceGroup.children[2].position.set(0.5, 0.5, 1);
    iceGroup.children[2].rotateZ(Math.PI/180 * -60);

    // 2. Make ice cube fixed position
    iceCubesFixed.position.set(-0.05, 0.25, 0.1);
    iceCubesFixed.scale.setScalar(0.01);

    iceCubesFixed.add(iceMesh.clone());
    iceCubesFixed.add(iceMesh.clone());
    iceCubesFixed.add(iceMesh.clone());
    iceCubesFixed.add(iceMesh.clone());

    iceCubesFixed.children[0].position.set(0.3, 0, 0);
    iceCubesFixed.children[0].rotateZ(Math.PI/180 * 60);

    iceCubesFixed.children[1].position.set(1, 0, 0);

    iceCubesFixed.children[2].position.set(0.2, 0, -1);
    iceCubesFixed.children[2].rotateX(Math.PI/180 * -30);

    iceCubesFixed.children[3].position.set(1, 0, -1);
    iceCubesFixed.children[3].rotateX(Math.PI/180 * -60);
    iceCubesFixed.children[3].rotateZ(Math.PI/180 * -30);

    iceCubesFixed.children.forEach(ice => {
      ice.children[0].material.opacity = 0.8;
    })

  });

}

/**
 * Load linear compression model
 */
function loadLinearCompression(_track){

  // Instantiate a gltfLoader
  let gltfLoader = new THREE.GLTFLoader();
  gltfLoader.setDRACOLoader( dracoLoader );

  gltfLoader.load( mainURL + 'lgDIOS/draco/inverter_output.glb', function(gltf) {

    gltf.scene.position.set(45, -220, -10);
    gltf.scene.visible = true;
    gltf.scene.tag = 'Fridge';
    gltf.scene.name = 'Inverter';
    gltf.scene.rotation.y = Math.PI/180* (-10);
    gltf.scene.scale.setScalar(600);

    // Create custom animation clips
    if (gltf.animations.length > 0) {
      gltf.scene.animations = gltf.animations;

      playLinearMixer = new THREE.AnimationMixer(gltf.scene);
      let action = playLinearMixer.clipAction(gltf.animations[0]);
      // action.play();

      let clip = THREE.AnimationUtils.subclip(gltf.animations[0], 'play_linear_clip', 15, 30, 10);
      linearAction = playLinearMixer.clipAction(clip);

    } else console.error(`Model [${gltf.scene.name}] does not have animation.`);

    linearMesh = _track(gltf.scene);
  });
}