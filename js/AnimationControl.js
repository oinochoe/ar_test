let currentMesh;

// Animation clips
let openInsideAnimationClip,
    closeInsideAnimationClip,
    openFilterAnimationClip,
    closeFilterAnimationClip,
    playDoorCaseAnimationClip,
    playSodaBottleClip,
    doorOpenAnimationClip,
    doorCloseAnimationClip,
    openLinearAnimationClip,
    stopLinearAnimationClip,
    openSlidingShelfClip,
    closeSlidingShelfClip;

// Animation mixer
let mixer,
    openInsideMixer,
    closeInsideMixer,
    openMagicDoorMixer,
    closeMagicDoorMixer,
    playDoorCaseMixer,
    playSodaBottleMixer_1,
    playSodaBottleMixer_2,
    playSodaBottleMixer_3,
    openFilterMixer,
    closeFilterMixer,
    playLinearMixer,
    linearAction,
    stopLinearMixer,
    openSlidingShelfMixer,
    closeSlidingShelfMixer;

let fadeInNum, fadeOutNum;

// Booleans
let isOpenInside = false,
    isOpenFilter = false,
    isOpenDoor = false,
    isPlayDoorCase = false,
    isOpenLinear = false;

/**
 * Create new animation clips from original clip.
 *
 * @param originClips
 */
function makeAnimationClips(originClips) {
    openInsideAnimationClip = THREE.AnimationUtils.subclip(originClips, 'open_inside', 130, 150, 10);
    closeInsideAnimationClip = THREE.AnimationUtils.subclip(originClips, 'close_inside', 230, 250, 10);

    openFilterAnimationClip = THREE.AnimationUtils.subclip(originClips, 'open_filter', 151, 190, 10);
    closeFilterAnimationClip = THREE.AnimationUtils.subclip(originClips, 'close_filter', 191, 225, 10);

    doorOpenAnimationClip = THREE.AnimationUtils.subclip(originClips, 'open_magic_space', 1, 20, 10);
    doorCloseAnimationClip = THREE.AnimationUtils.subclip(originClips, 'close_magic_space', 445, 550, 60);

    playDoorCaseAnimationClip = THREE.AnimationUtils.subclip(originClips, 'play_door_case', 35, 60, 9);

    openLinearAnimationClip = THREE.AnimationUtils.subclip(originClips, 'play_linear', 266, 290, 10);
    stopLinearAnimationClip = THREE.AnimationUtils.subclip(originClips, 'stop_linear', 320, 350, 10);

    // push to animation list
    mesh.animations.push(openInsideAnimationClip);
    mesh.animations.push(closeInsideAnimationClip);
    mesh.animations.push(openFilterAnimationClip);
    mesh.animations.push(closeFilterAnimationClip);
    mesh.animations.push(doorOpenAnimationClip);
    mesh.animations.push(playDoorCaseAnimationClip);
    mesh.animations.push(doorCloseAnimationClip);
    mesh.animations.push(openLinearAnimationClip);
    mesh.animations.push(stopLinearAnimationClip);
}

/*******************************************************************************
 ****************************** Models Animation *******************************
 ******************************************************************************/

/**
 * Fade in the number of filter.
 */
function fadeInFilterNumber() {
    fadeInNum = requestAnimationFrame(fadeInFilterNumber);

    if (btnFilterNumberOne.material.opacity < 1) btnFilterNumberOne.material.opacity += 0.05;
    /*setTimeout(() => {
    if (btnFilterNumberTwo.material.opacity < 1 ) btnFilterNumberTwo.material.opacity += 0.02;

    setTimeout(() => {
      if (btnFilterNumberThree.material.opacity < 1 ) btnFilterNumberThree.material.opacity += 0.02;
    }, 200)
  }, 200)*/

    Promise.delay(() => {
        if (btnFilterNumberTwo.material.opacity < 1) btnFilterNumberTwo.material.opacity += 0.05;
    }, 200)
        .delay(() => {
            if (btnFilterNumberThree.material.opacity < 1) btnFilterNumberThree.material.opacity += 0.05;
        }, 200)
        .delay(() => {
            mesh.add(btnFilterNumberOne, btnFilterNumberTwo, btnFilterNumberThree);
        }, 200);
}

/**
 * Fade out number of filter
 */
function fadeOutFilterNumber() {
    fadeOutNum = requestAnimationFrame(fadeOutFilterNumber);

    if (btnFilterNumberOne.material.opacity > 0) btnFilterNumberOne.material.opacity -= 0.05;
    /*setTimeout(() => {
    if (btnFilterNumberTwo.material.opacity > 0 ) btnFilterNumberTwo.material.opacity -= 0.01;

    setTimeout(() => {
      if (btnFilterNumberThree.material.opacity > 0 ) btnFilterNumberThree.material.opacity -= 0.01;

      setTimeout(() => {
        mesh.remove(btnFilterNumberOne, btnFilterNumberTwo, btnFilterNumberThree);

      }, 300)
    }, 300)
  }, 300)*/
    Promise.delay(() => {
        if (btnFilterNumberTwo.material.opacity > 0) btnFilterNumberTwo.material.opacity -= 0.05;
    }, 200)
        .delay(() => {
            if (btnFilterNumberThree.material.opacity > 0) btnFilterNumberThree.material.opacity -= 0.05;
        }, 200)
        .delay(() => {
            mesh.remove(btnFilterNumberOne, btnFilterNumberTwo, btnFilterNumberThree);
        }, 300);
}

/**
 * Change model angle to view the multiple corner.
 */
function changeModelAngle() {
    console.info(`CHANGE MODEL ANGLE`);

    if (TWEEN) TWEEN.removeAll();

    let startValue = {
        rotationXValue: mesh.rotation.x,
    };
    let endValue = {
        // zoomValue: 5,
        rotationXValue: (Math.PI / 180) * 25,
    };

    let tween = new TWEEN.Tween(startValue).to(endValue, 800);

    tween.onUpdate(() => {
        mesh.rotation.x = startValue.rotationXValue;
    });
    tween.onComplete(() => {});

    tween.start();
}

/**
 * Reset model angle.
 */
function resetModelAngle() {
    console.info(`RESET MODEL ANGLE`);

    if (TWEEN) TWEEN.removeAll();

    let startValue = {
        rotationXValue: mesh.rotation.x,
    };
    let endValue = {
        rotationXValue: 0,
    };

    let tween = new TWEEN.Tween(startValue).to(endValue, 800);

    tween.onUpdate(() => {
        mesh.rotation.x = startValue.rotationXValue;
    });
    tween.onComplete(() => {});

    tween.start();
}

/**
 * Play Sliding Shelf animation.
 */
function playSlidingShelf(objects) {
    isAnimationPlaying = true;
    hidePot(objects)
        .then((objects) => {
            return openShelf(objects);
        })
        .then((objects) => {
            return showWatermelon(objects);
        })
        .catch((err) => {
            console.error(err);
        });
}

function hidePot(objects) {
    return new Promise((resolve, reject) => {
        let pot = objects.filter((obj) => obj.name === 'pot');
        if (pot.length > 0) {
            pot[0].visible = false;
            pot[0].position.y = -0.09;
            resolve(objects);
        } else {
            reject(objects);
        }
    });
}

function openShelf(objects) {
    return new Promise((resolve, reject) => {
        let shelf = objects.filter((obj) => obj.name === 'sliding_shelf');
        if (shelf.length > 0) {
            isOpenSlidingShelf = true;
            openSlidingShelfMixer = new THREE.AnimationMixer(shelf[0]);
            openSlidingShelfClip = shelf[0].animations[0];
            let action = openSlidingShelfMixer.clipAction(openSlidingShelfClip);
            action.setDuration(2);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();
            openSlidingShelfMixer.addEventListener('finished', () => {
                showWatermelon();
                resolve();
            });
        }
    });
}

function showWatermelon() {
    let watermelon = bodyInsideGroup.children.filter((obj) => obj.name === 'watermelon');
    if (watermelon.length > 0) {
        watermelon[0].visible = true;

        if (TWEEN) TWEEN.removeAll();

        let startValue = {
            objectPositionY: watermelon[0].position.y,
        };
        let endValue = {
            objectPositionY: 0.272,
        };

        let tween = new TWEEN.Tween(startValue).to(endValue, 800);

        tween.onUpdate(() => {
            watermelon[0].position.y = startValue.objectPositionY;
        });
        tween.onComplete(() => {
            //isShowMelonFinished = true;
            console.error(`>>> isShowMelonFinished ${isShowMelonFinished}`);
            isAnimationPlaying = false;
        });
        tween.start();
    }
}

function closeSlidingShelf(objects) {
    isAnimationPlaying = true;
    hideWatermelon(objects)
        .then((objects) => {
            return showPot(objects);
        })
        .catch((err) => {
            console.error(err);
        });
}

function hideWatermelon(objects) {
    return new Promise((resolve, reject) => {
        let watermelon = bodyInsideGroup.children.filter((obj) => obj.name === 'watermelon');
        if (watermelon.length > 0) {
            console.warn(`REMOVE WATERMELON`);
            if (TWEEN) TWEEN.removeAll();

            // hide watermelon
            watermelon[0].visible = false;
            watermelon[0].position.y = 0.31;

            isShowMelonFinished = false;
            resolve(objects);
        } else {
            reject(objects);
        }
    });
}

function showPot(objects) {
    let pot = objects.filter((obj) => obj.name === 'pot');
    if (pot.length > 0) {
        pot[0].visible = true;

        let startValue = {
            objectPositionY: pot[0].position.y,
        };
        let endValue = {
            objectPositionY: -0.12,
        };

        let tween = new TWEEN.Tween(startValue).to(endValue, 800);

        tween.onUpdate(() => {
            pot[0].position.y = startValue.objectPositionY;
        });
        tween.onComplete(() => {
            closeShelf();

            if (TWEEN) TWEEN.removeAll();
        });
        tween.start();
    }
}

function closeShelf() {
    let shelf = bodyInsideGroup.children.filter((obj) => obj.name === 'sliding_shelf');

    if (shelf.length > 0) {
        closeSlidingShelfMixer = new THREE.AnimationMixer(shelf[0]);
        closeSlidingShelfClip = shelf[0].animations[1];
        let action = closeSlidingShelfMixer.clipAction(closeSlidingShelfClip);
        action.setDuration(2);
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
        action.play();

        closeSlidingShelfMixer.addEventListener('finished', () => {
            console.warn(`closeSlidingShelf PLAY END`);
            isAnimationPlaying = false;
            isOpenSlidingShelf = false;

            let changeMat = new THREE.MeshBasicMaterial({ map: mat_btnFolding });
            btnFoldingShelf.material = changeMat;
            btnFoldingShelf.name = 'FoldingShelf';

            mesh.add(btnOpenFilter, btnMultiCorner, btnLargeBasket, btnUV);
        });
    }
}

/**
 * Stop Door case and Soda bottle animation.
 */
function stopDoorCaseAndSodaBottle() {
    if (openMagicDoorMixer) openMagicDoorMixer.existingAction(mesh.animations[4], mesh).stop();
    mesh.remove(btnCaseDoorMoving);

    if (playDoorCaseMixer) playDoorCaseMixer.existingAction(mesh.animations[5], mesh).stop();
    if (playSodaBottleMixer_1) playSodaBottleMixer_1.existingAction(doorUpRightGroup.children[6].animations[1], doorUpRightGroup.children[6]).stop();
    if (playSodaBottleMixer_2) playSodaBottleMixer_2.existingAction(doorUpRightGroup.children[7].animations[1], doorUpRightGroup.children[7]).stop();
    if (playSodaBottleMixer_3) playSodaBottleMixer_3.existingAction(doorUpRightGroup.children[8].animations[1], doorUpRightGroup.children[8]).stop();
}

/**
 * Proceed animation clips
 * @param clipName
 */
function proceedAnimation(clipName, _is3Dview) {
    console.warn(`proceedAnimation`, _is3Dview);

    let clip, action;
    isAnimationPlaying = true;

    switch (clipName) {
        case 'open_inside':
            if (isMagicSpaceDoorClicked) {
                console.error(`Remove all buttons!`);
                mesh.remove(btnOpenRightDoor, btnOpenVideo, btnKnockOn);
            }

            isOpenInside = true;
            openInsideMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[0];
            action = openInsideMixer.clipAction(clip);
            action.setDuration(1.2);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            openInsideMixer.addEventListener('finished', () => {
                console.warn(`OPEN INSIDE PLAY END`);
                isAnimationPlaying = false;
                if (!_is3Dview) {
                    // Add buttons
                    mesh.add(btnOpenFilter, btnUV, btnFoldingShelf, btnMultiCorner, btnLargeBasket);
                }
            });
            break;
        case 'close_inside':
            closeInsideMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[1];
            action = closeInsideMixer.clipAction(clip);
            action.setDuration(1.2);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            closeInsideMixer.addEventListener('finished', () => {
                console.warn(`CLOSE INSIDE PLAY END`);
                isOpenInside = false;
                isAnimationPlaying = false;

                mesh.remove(btnOpenFilter, btnUV, btnFoldingShelf, btnMultiCorner, btnLargeBasket);

                if (!_is3Dview) {
                    mesh.add(btnOpenVideo, btnOpenRightDoor, btnKnockOn);
                }
            });
            break;
        case 'open_filter':
            // Cancel previous animation first
            cancelAnimationFrame(fadeOutNum);
            console.error(`CANCEL FADE OUT: ${fadeOutNum}`);

            isOpenFilter = true;
            openFilterMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[2];
            action = openFilterMixer.clipAction(clip);
            action.setDuration(2.0);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            // Add numbers for filter, use setTimeOut to sync with filter animation
            setTimeout(() => {
                fadeInFilterNumber();
            }, 500);

            openFilterMixer.addEventListener('finished', () => {
                console.warn(`OPEN FILTER PLAY END`);
                isAnimationPlaying = false;

                // 1. Stop all audios except click sound and filterSound
                iceSound.pause();
                iceSound.currentTime = 0;
                magicDisplaySound.pause();
                magicDisplaySound.currentTime = 0;
                magicSpaceDoorSound.pause();
                magicSpaceDoorSound.currentTime = 0;
                magicSpaceKnockOnSound.pause();
                magicSpaceKnockOnSound.currentTime = 0;
                uvSound.pause();
                uvSound.currentTime = 0;
                doorCaseSound.pause();
                doorCaseSound.currentTime = 0;
                linearCompressorSound.pause();
                linearCompressorSound.currentTime = 0;

                // Show bottom narration text
                document.getElementById('message').style.display = 'none';
                document.getElementById('narration-panel').style.display = 'flex';
                document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-filter.svg';
                $('.scroll-left p').addClass('on');
                document.getElementById('tts-text').innerHTML =
                    '锟疥鲸鈹佺Щ雽€雮� 锟疥惊杲�+ : 浠ル瑤韴戯拷锟� 7閱拷 (锟届剰锟�, 锟斤拷, 閸京雰�, 绉浑寑氡惰锟�, 铵ｏ拷, 锟诫毊锛堣獦氇冸拞, 锟斤拷), 锟届毽帮拷敕€敫拌嚲靽膘瓘 锟斤拷 锟届牍愯嚲靽膘瓘 锟届挀甑� / UF 锟疥惊杲� : 瑾橂獎杲拷雮嗢槃 璜涳拷 璜涬亥雬掔敱褗敫� 锟届挀甑� / 锟窖婋挭锟诫獎氕呰箓锟� 锟疥惊杲� : 婀碴碃锟� 锟届牍愯嚲靽膘瓘 锟届挀甑�';

                // 2. Play sound for filter
                filterSound.volume = 0.6;
                filterSound.loop = false;
                filterSound.play().then(() => {});
            });
            break;
        case 'close_filter':
            console.warn('close_filter');

            // Cancel previous animation first
            cancelAnimationFrame(fadeInNum);
            console.error(`CANCEL FADE-IN: ${fadeInNum}`);

            // Play fade-out animation for filter numbers
            fadeOutFilterNumber();

            closeFilterMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[3];
            action = closeFilterMixer.clipAction(clip);
            action.setDuration(2.0);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            closeFilterMixer.addEventListener('finished', () => {
                console.warn(`CLOSE FILTER PLAY END`);
                isAnimationPlaying = false;
                mesh.add(btnUV, btnMultiCorner, btnLargeBasket, btnFoldingShelf);
                isOpenFilter = false;
            });
            break;
        case 'open_magic_space':
            isOpenDoor = true;

            openMagicDoorMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[4];
            action = openMagicDoorMixer.clipAction(clip);
            action.setDuration(1.2);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            openMagicDoorMixer.addEventListener('finished', () => {
                console.warn(`OPEN MAGIC DOOR PLAY END`);
                isAnimationPlaying = false;

                mesh.add(btnCaseDoorMoving);
            });

            break;
        case 'close_magic_space':
            // stop door case animation
            stopDoorCaseAndSodaBottle();

            closeMagicDoorMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[6];
            action = closeMagicDoorMixer.clipAction(clip);
            action.setDuration(1.2);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            closeMagicDoorMixer.addEventListener('finished', () => {
                console.warn(`CLOSE MAGIC DOOR PLAY END`);
                isOpenDoor = false;
                isAnimationPlaying = false;

                // Update button
                if (!isMagicSpaceDoorClicked) {
                    mesh.add(btnOpenVideo);
                    mesh.add(btnOpenRightDoor);
                    mesh.add(btnKnockOn);
                }

                // zoomOutCameraForDoor();
            });
            break;
        case 'play_door_case':
            isPlayDoorCase = true;

            // Play soda bottles first because its animation is fast
            // playSodaBottleAnim();

            playDoorCaseMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[5];
            action = playDoorCaseMixer.clipAction(clip);
            action.setDuration(1.5);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopRepeat;
            action.play();

            setTimeout(() => {
                playSodaBottleAnim();
            }, 10);

            playDoorCaseMixer.addEventListener('finished', () => {
                console.warn(`DOOR CASE PLAY END`);
                isAnimationPlaying = false;
            });

            break;
        case 'play_linear':
            isOpenLinear = true;
            // mesh.add(btnLinearCompression);

            playLinearMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[7];
            action = playLinearMixer.clipAction(clip);

            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            playLinearMixer.addEventListener('finished', () => {
                console.warn(`LINEAR PLAY END`);
                isAnimationPlaying = false;
                // Move Inverter to backsize
                mesh.children[8].position.z = -0.22;
                mesh.children[8].position.y = 0.035;
                mesh.children[8].rotateY((Math.PI / 180) * 180);
            });
            break;
        case 'stop_linear':
            stopLinearMixer = new THREE.AnimationMixer(mesh);
            clip = mesh.animations[8];
            action = stopLinearMixer.clipAction(clip);

            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();

            stopLinearMixer.addEventListener('finished', () => {
                console.warn(`STOP LINEAR PLAY END`);
                isAnimationPlaying = false;
                isOpenLinear = false;
            });
            break;
    }

    return true;
}

/**
 * Play OpenMagicDoor animation.
 */
function openMagicDoor() {
    console.warn(`OPEN MAGIC DOOR`);
    if (mixer) mixer.stopAllAction();

    if (TWEEN) TWEEN.removeAll();

    // 1. Update button
    mesh.remove(btnOpenVideo);
    // mesh.remove(btnOpenRightDoor);
    mesh.remove(btnKnockOn);

    // 2. Proceed animation
    proceedAnimation('open_magic_space');
}

/**
 * Close MagicDoor.
 */
function closeMagicDoor() {
    console.warn(`CLOSE THE DOOR`);
    if (TWEEN) TWEEN.removeAll();

    proceedAnimation('close_magic_space');
}

function stopSodaBottleAnim() {
    console.warn(`stopSodaBottleAnim`);

    isPlayDoorCase = false;

    // 1. stop door case animation
    if (playDoorCaseMixer) playDoorCaseMixer.existingAction(mesh.animations[5], mesh).stop();
    if (playSodaBottleMixer_1) playSodaBottleMixer_1.existingAction(doorUpRightGroup.children[6].animations[1], doorUpRightGroup.children[6]).stop();
    if (playSodaBottleMixer_2) playSodaBottleMixer_2.existingAction(doorUpRightGroup.children[7].animations[1], doorUpRightGroup.children[7]).stop();
    if (playSodaBottleMixer_3) playSodaBottleMixer_3.existingAction(doorUpRightGroup.children[8].animations[1], doorUpRightGroup.children[8]).stop();

    // 2. Close the door
    closeMagicDoor();
}

/**
 * Play animation of three soda bottles at once.
 * TODO: Need to find a way to sync these bottle animation
 * with play_door_case
 */
function playSodaBottleAnim() {
    console.warn(`playSodaBottleAnim`);

    // let doorUpRightMesh = mesh.children.find(c => c.name === 'axi_door_up_R');

    playSodaBottleMixer_1 = new THREE.AnimationMixer(doorUpRightGroup.children[6]);
    let clip_1 = mesh.animations[9];
    let action_1 = playSodaBottleMixer_1.clipAction(clip_1);
    action_1.setDuration(1.5);
    action_1.clampWhenFinished = true;
    action_1.loop = THREE.LoopRepeat;
    action_1.play();

    playSodaBottleMixer_1.addEventListener('finished', () => {
        console.warn(`SODA BOTTLE 1 PLAY END`);
    });

    playSodaBottleMixer_2 = new THREE.AnimationMixer(doorUpRightGroup.children[7]);
    let clip_2 = mesh.animations[9];
    let action_2 = playSodaBottleMixer_2.clipAction(clip_2);
    action_2.setDuration(1.5);
    action_2.clampWhenFinished = true;
    action_2.loop = THREE.LoopRepeat;
    action_2.play();

    playSodaBottleMixer_2.addEventListener('finished', () => {
        console.warn(`SODA BOTTLE 2 PLAY END`);
    });

    playSodaBottleMixer_3 = new THREE.AnimationMixer(doorUpRightGroup.children[8]);
    let clip_3 = mesh.animations[9];
    let action_3 = playSodaBottleMixer_3.clipAction(clip_3);
    action_3.setDuration(1.5);
    action_3.clampWhenFinished = true;
    action_3.loop = THREE.LoopRepeat;
    action_3.play();

    playSodaBottleMixer_3.addEventListener('finished', () => {
        console.warn(`SODA BOTTLE  3PLAY END`);
    });
}

/**
 * Open Inside.
 */
function openInside(_is3Dview) {
    console.warn(`OPEN INSIDE`);
    if (TWEEN) TWEEN.removeAll();

    /*mesh.children.forEach(c => {
    if (c.type === 'CustomButton') {
      mesh.remove(c);
    }
  })*/
    mesh.remove(btnOpenVideo, btnOpenRightDoor, btnKnockOn, btnCaseDoorMoving, iceGroup, iceCubesFixed, btnIceDrop, btnCloseIceVideo);

    // 1.Update button
    // isOpenInside = true;

    // 2. Proceed animation
    proceedAnimation('open_inside', _is3Dview);
}

/**
 * Close Inside.
 */
function closeInside(_is3Dview) {
    console.warn(`CLOSE INSIDE`);
    if (TWEEN) TWEEN.removeAll();

    proceedAnimation('close_inside', _is3Dview);
}

/**
 * Open Filter animation
 */
function openFilterAnimation() {
    console.warn(`OPEN FILTER ANIMATION.`);
    if (TWEEN) TWEEN.removeAll();

    // 1. Update button
    isFilterClick = true;
    isOpenFilter = true;

    // 2. Proceed animation
    proceedAnimation('open_filter');
}

/**
 * Close Filter.
 */
function closeFilterAnimation() {
    console.warn(`closeFilterAnimation`);
    if (TWEEN) TWEEN.removeAll();

    proceedAnimation('close_filter');
}

/**
 * Play Linear compression part
 */
function playLinearAnimation() {
    console.warn(`playLinearAnimation`);
    linearAction.setDuration(1.2);
    linearAction.play();
}

/*******************************************************************************
 ****************************** TWEEN.js Animation *****************************
 ******************************************************************************/

/**
 * Make model bigger when open video for Ice.
 */
function zoomInCameraForVideo(_track) {
    console.info(`ZOOM-IN MODEL FOR ICE VIDEO.`);

    if (TWEEN) TWEEN.removeAll();

    // Update buttons
    mesh.remove(btnOpenRightDoor);
    mesh.remove(btnKnockOn);
    mesh.remove(btnIcePlus);

    let startValue = {
        zoomValue: camera.zoom,
        rotationValue: camera.rotation.y,
        objectPositionX: mesh.position.x,
        objectPositionY: mesh.position.y,
        objectZoomValue: mesh.scale.x,
    };
    let endValue = {
        zoomValue: 5,
        rotationValue: (Math.PI / 180) * 3,
        objectPositionX: 50,
        objectPositionY: -250,
        objectZoomValue: 1300,
    };

    let tween = new TWEEN.Tween(startValue).to(endValue, 1000);

    tween.onUpdate(() => {
        mesh.scale.setScalar(startValue.objectZoomValue);
        mesh.position.x = startValue.objectPositionX;
        mesh.position.y = startValue.objectPositionY;
        // camera.updateProjectionMatrix();
    });
    tween.onComplete(() => {
        // At the moment, we dont open video
        // createVideo(_track);

        // Update buttons
        mesh.add(btnIceDrop);
    });

    tween.start();
}

/**
 * Make model smaller when open video for Ice.
 */
function zoomOutCameraForVideo() {
    console.info(`ZOOM-OUT MODEL FOR ICE VIDEO.`);

    if (TWEEN) TWEEN.removeAll();

    iceSound.pause();
    iceSound.load();

    let startValue = {
        zoomValue: camera.zoom,
        rotationValue: camera.rotation.y,
        objectPositionX: mesh.position.x,
        objectPositionY: mesh.position.y,
        objectZoomValue: mesh.scale.x,
    };
    let endValue = {
        zoomValue: 1,
        rotationValue: (Math.PI / 180) * 4,
        objectPositionX: 0,
        objectPositionY: -100,
        objectZoomValue: 400,
    };
    let tween = new TWEEN.Tween(startValue).to(endValue, 1000);

    tween.onUpdate(function () {
        mesh.scale.setScalar(startValue.objectZoomValue);
        mesh.position.x = startValue.objectPositionX;
        mesh.position.y = startValue.objectPositionY;
        camera.updateProjectionMatrix();
    });
    tween.onComplete(() => {
        iceSound.pause();
        iceSound.load();

        // Update button
        mesh.remove(btnCloseIceVideo);
        mesh.remove(btnIceDrop);
        // mesh.add(btnOpenVideo);
        mesh.add(btnOpenRightDoor);
        mesh.add(btnKnockOn);
    });

    tween.start();
}

/**
 * Make model bigger when open MagicDoor.
 * [BACKUP] - We dont zoomIn camera.
 */
/*function zoomInCameraForDoor() {

  console.info(`ZOOM-IN MODEL FOR MAGIC DOOR.`);

  if (TWEEN) TWEEN.removeAll();

  let startValue = {
    objectPositionX: mesh.position.x,
    objectPositionY: mesh.position.y,
    objectZoomValue: mesh.scale.x,
  };
  let endValue = {
    objectPositionX: -50,
    objectPositionY: -250,
    objectZoomValue: 1000,
  };

  let tween = new TWEEN.Tween(startValue).to(endValue, 1000);
  // .easing( TWEEN.Easing.Elastic.InOut );

  tween.onUpdate(() => {
    mesh.scale.setScalar(startValue.objectZoomValue);
    mesh.position.x = startValue.objectPositionX;
    mesh.position.y = startValue.objectPositionY;
  });
  tween.onComplete(() => {
    // proceedAnimation('play_door_case');

    // Add button for door case moving
    mesh.add(btnCaseDoorMoving);
  });
  tween.start();
}*/

/**
 * Make model smaller when close MagicDoor.
 */
function zoomOutCameraForDoor() {
    console.info(`ZOOM-OUT MODEL FOR MAGIC DOOR.`);
    if (TWEEN) TWEEN.removeAll();

    let startValue = {
        objectPositionX: mesh.position.x,
        objectPositionY: mesh.position.y,
        objectZoomValue: mesh.scale.x,
    };
    let endValue = {
        objectPositionX: 0,
        objectPositionY: -100,
        objectZoomValue: 400,
    };
    let tween = new TWEEN.Tween(startValue).to(endValue, 500);
    // .easing( TWEEN.Easing.Elastic.InOut );

    tween.onUpdate(function () {
        mesh.scale.setScalar(startValue.objectZoomValue);
        mesh.position.x = startValue.objectPositionX;
        mesh.position.y = startValue.objectPositionY;
    });
    tween.onComplete(() => {});
    tween.start();
}

/**
 * Animate cube to make it drops down.
 */
function animateIceCube() {
    console.info(`ANIMATE ICE CUBE`);

    let startValue_0 = {
        ice0PositionX: iceGroup.children[0].position.x,
        ice0PositionY: iceGroup.children[0].position.y,
        ice0RotationY: iceGroup.children[0].rotation.y,
    };
    let endValue_0 = {
        ice0PositionX: -0.8,
        ice0PositionY: -4.5,
        ice0RotationY: (Math.PI / 180) * 90,
    };

    let startValue_1 = { ice1PositionY: iceGroup.children[1].position.y };
    let endValue_1 = {
        ice1PositionY: -4.5,
    };

    let startValue_2 = {
        ice2PositionX: iceGroup.children[2].position.x,
        ice2PositionY: iceGroup.children[2].rotation.y,
    };
    let endValue_2 = {
        ice2PositionX: 1.5,
        ice2PositionY: -4.5,
        ice2RotationY: (Math.PI / 180) * 90,
    };

    let startValue_3 = { iceFixedPositionY: iceCubesFixed.position.y };
    let endValue_3 = {
        iceFixedPositionY: 0.206,
    };

    // build the tween for ice0
    let tween_0 = new TWEEN.Tween(startValue_0)
        .to(endValue_0, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .delay(0)
        .onUpdate(() => {
            iceGroup.children[0].position.x = startValue_0.ice0PositionX;
            iceGroup.children[0].position.y = startValue_0.ice0PositionY;
        });

    // build the tween for ice1
    let tween_1 = new TWEEN.Tween(startValue_1)
        .to(endValue_1, 1500)
        .delay(100)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            if (iceGroup.children[1]) iceGroup.children[1].position.y = startValue_1.ice1PositionY;
        });

    // build the tween for ice2
    let tween_2 = new TWEEN.Tween(startValue_2)
        .to(endValue_2, 1500)
        .delay(0)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            iceGroup.children[2].position.x = startValue_2.ice2PositionX;
            iceGroup.children[2].position.y = startValue_2.ice2PositionY;
        });

    // build the tween for iceCubesFixed
    let tween_3 = new TWEEN.Tween(startValue_3)
        .to(endValue_3, 1500)
        .delay(0)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            iceCubesFixed.position.y = startValue_3.iceFixedPositionY;
        });

    tween_3.onComplete(() => {
        //
    });

    tween_0.onComplete(() => {
        iceGroup.children[0].position.x = -0.8;
        iceGroup.children[0].position.y = -4.5;
    });

    tween_1.onComplete(() => {
        if (iceGroup.children[1]) iceGroup.children[1].rotateZ((Math.PI / 180) * 30);
        if (iceGroup.children[1]) iceGroup.children[1].position.y = -4.5;
    });

    tween_2.onComplete(() => {
        iceGroup.children[2].position.x = 1.5;
        iceGroup.children[2].position.y = -4.5;

        // Add the moment, we don't repeat the ice drop.
        // When tween_2 completes => reset all ice cubes
        /*mesh.remove(iceGroup);

    setTimeout(() => {
      resetIceGroupAnimation();
    }, 10)*/
    });

    // start all tweens
    tween_3.start();
    tween_0.start();
    tween_1.start();
    tween_2.start();

    setTimeout(() => {
        iceSound.volume = 0.6;
        iceSound.play().then(() => {});
    }, 1000);
}

/**
 * Rotate mesh to backside
 */
function rotateModelBackside(_track) {
    console.warn(`rotateModelBackside`);

    if (TWEEN) TWEEN.removeAll();

    let startValue = {
        objectRotateY: transparentMesh.rotation.y,
    };
    let endValue = {
        objectRotateY: THREE.Math.degToRad(180),
    };

    let tween = new TWEEN.Tween(startValue).to(endValue, 800).easing(TWEEN.Easing.Circular.InOut);

    tween.onUpdate(() => {
        transparentMesh.rotation.y = startValue.objectRotateY;
    });
    tween.onComplete(() => {
        // 1. Stop all audios
        iceSound.pause();
        iceSound.currentTime = 0;
        magicDisplaySound.pause();
        magicDisplaySound.currentTime = 0;
        magicSpaceDoorSound.pause();
        magicSpaceDoorSound.currentTime = 0;
        magicSpaceKnockOnSound.pause();
        magicSpaceKnockOnSound.currentTime = 0;
        filterSound.pause();
        filterSound.currentTime = 0;

        // 2. Play audio for linear compressor
        linearCompressorSound.volume = 0.6;
        linearCompressorSound.loop = false;
        linearCompressorSound.play().then(() => {});

        // Show bottom narration text
        document.getElementById('message').style.display = 'none';
        document.getElementById('narration-panel').style.display = 'flex';
        document.getElementById('lbl-bottom').src = 'https://demo.letsee.io/confinity/assets/bottom/lbl-linear.svg';
        $('.scroll-left p').removeClass('on');
        document.getElementById('tts-text').innerHTML = '뭐라하노? 마산내려갈래?'

        // transparentMesh.add(btnLinearCompression);
        // btnLinearCompression.visible = true;
        toystory.add(linearMesh);
        playLinearAnimation();

        // WARNING: At the moment, we don't use this
        /*toystory.add(tube);
    animateTube();
    createSmoke(_track);*/

        transparentMesh.add(tube);
        createSmokeFlow(_track);
        animateTube();
    });
    tween.start();
}

/*******************************************************************************
 ********************************* Hammer.js ***********************************
 ******************************************************************************/

/**
 * Rotate and Scale model using Hammer.
 */
function rotateAndScale() {
    console.warn(`ROTATE AND SCALE`);

    // 1. Play click sound
    clickSound.play().then(() => {});

    is3Dview = true;

    // Pause tracking and set model into center.
    // const isPaused = letsee.pause([0.9996717718958484, 0.0062402214640219465, -0.02484769829772193, 0, -0.0025224514927073274, 0.9891437930727777, 0.14692921378699628, 0, 0.02549481737690216, -0.14681831037604906, 0.988834868936791, 0, -10.489514205452574, -2.8702186425177274, -300.4471307995897, 1]);
    const isPaused = letsee.pause([
        0.9996717718958484, 0.0062402214640219465, -0.02484769829772193, 0, -0.0025224514927073274, 0.9891437930727777, 0.14692921378699628, 0,
        0.02549481737690216, -0.14681831037604906, 0.988834868936791, 0, -10.489514205452574, 30.5702186425177274, -250.4471307995897, 1,
    ]);
    console.error(`isPAUSED >>> ${isPaused}`);

    // Change GUI
    document.getElementById('btn-exterior').src = 'https://demo.letsee.io/confinity/assets/menu/ico-exterior.svg';
    document.getElementById('btn-inside').src = 'https://demo.letsee.io/confinity/assets/menu/ico-inside.svg';
    document.getElementById('btn-cooling').src = 'https://demo.letsee.io/confinity/assets/menu/ico-cooling.svg';

    $('#tab-1').css('background', '#ffffff');
    $('#tab-1 p').css('color', '#9b9b9b');

    $('#tab-2').css('background', '#ffffff');
    $('#tab-2 p').css('color', '#9b9b9b');

    $('#tab-3').css('background', '#ffffff');
    $('#tab-3 p').css('color', '#9b9b9b');

    document.getElementById('message').style.display = 'none';
    document.getElementById('narration-panel').style.display = 'none';
    document.getElementById('btnRotate').src = 'https://demo.letsee.io/confinity/assets/menu/btn-3-dtop-on.png';
    document.getElementById('bottom').style.display = 'flex';
    document.getElementById('controlPanel').style.display = 'flex';

    // 1. Remove handler to prevent raycasting
    removeHandler();

    // 2. Reset all buttons and again add only main buttons.
    mesh.remove(
        btnOpenVideo,
        btnKnockOn,
        btnOpenRightDoor,
        btnOpenFilter,
        btnIceDrop,
        btnIcePlus,
        btnCloseIceVideo,
        btnCloseFilterVideo,
        btnUV,
        btnFoldingShelf,
        btnMultiCorner,
        btnLargeBasket,
    );
    resetButtonMaterials();

    // 3. Stop all audios
    iceSound.pause();
    iceSound.currentTime = 0;
    magicDisplaySound.pause();
    magicDisplaySound.currentTime = 0;
    magicSpaceDoorSound.pause();
    magicSpaceDoorSound.currentTime = 0;
    magicSpaceKnockOnSound.pause();
    magicSpaceKnockOnSound.currentTime = 0;
    filterSound.pause();
    filterSound.currentTime = 0;
    linearCompressorSound.pause();
    linearCompressorSound.currentTime = 0;

    // 4. Reset model and get current active item
    console.warn(`topTabFlag: ${topTabFlag}`);
    switch (topTabFlag) {
        case 'exterior':
            resetModel();
            // currentMesh = mesh;
            break;
        case 'inside':
            // Set fridge at origin state with door close
            closeInside((is3Dview = true));
            // currentMesh = mesh;
            break;
        case 'cooling':
            toystory.remove(transparentMesh);
            toystory.children = [];

            toystory.add(mesh);
            // currentMesh = mesh;

            /*transparentMesh.visible = false;
      mesh.visible= false;

      // Hide tube
      tube.visible = false;

      //  WARNING: At the moment, we don't use this
      // Hide SmokeParticle
      /!*toystory.children.forEach(child => {
        if (child.name === 'SmokeParticle') child.visible = false;
      })*!/

      currentMesh = linearMesh;*/
            break;
    }

    // 5. Active Hammer
    let myElement = document.getElementById('myElement');
    myElement.style.display = 'block';

    let mc = new Hammer(myElement);
    mc.get('pinch').set({ enable: true });
    mc.get('pan').set({ enable: true, direction: Hammer.DIRECTION_ALL, velocity: 0.000000001, threshold: 0 });

    // Scale object, 2 fingers
    mc.on('pinch', (ev) => {
        console.error(`Scale`);
        mesh.scale.setScalar(ev.scale * 400);
    });

    // Rotate object left/right, 1 finger
    let lastDeltaX = 0;
    mc.on('panright panleft', function (ev) {
        const { deltaX } = ev;
        const ratateY = deltaX - lastDeltaX;
        mesh.rotation.y = mesh.rotation.y + ratateY * 0.02;

        lastDeltaX = deltaX;
    });

    /* At the moment, we just rotate model left and right.
  // Rotate object down, 1 finger
  mc.on('pandown', function(ev) {
    console.warn(ev);
    // rotateAboutPoint(mesh, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(10));
    rotateAboutPoint(currentMesh, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(10));
    // const _x = THREE.Math.degToRad(Math.abs(ev.angle));
    // mesh.rotateX(_x);
    // console.error(`panup`, _x);
  });

  // Rotate object up, 1 finger
  mc.on('panup', function(ev) {
    console.warn(ev);
    // rotateAboutPoint(mesh, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 0, 0), THREE.Math.degToRad(10));
    rotateAboutPoint(currentMesh, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 0, 0), THREE.Math.degToRad(10));
  });*/
}
