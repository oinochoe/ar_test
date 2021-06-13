// Buttons
let btnOpenVideo,
    btnIcePlus,
    btnOpenRightDoor,
    btnCaseDoorMoving,
    btnKnockOn,
    btnOpenFilter,
    btnFilterNumberOne,
    btnFilterNumberTwo,
    btnFilterNumberThree,
    btnIceDrop,
    btnCloseIceVideo,
    btnCloseFilterVideo,
    btnUV,
    btnFoldingShelf,
    btnMultiCorner,
    btnLargeBasket;

// Videos
let video,
    videoTexture = null,
    videoFilter,
    videoFilterTexture = null;

// Preload the textures
let mat_btnWater = new THREE.TextureLoader().load('assets/button/small/btn-water.png');
let mat_btnIcePlus = new THREE.TextureLoader().load('assets/button/btn-plus.png');
let mat_btnWaterClose = new THREE.TextureLoader().load('assets/button/small/btn-water-close.png');
let btnIceDropMat = new THREE.TextureLoader().load('assets/button/small/btn-icecube.png');
let mat_btnMagicDoor = new THREE.TextureLoader().load('assets/button/small/btn-magicspace.png');
let mat_btnMagicDoorClose = new THREE.TextureLoader().load('assets/button/small/btn-magicspace-close.png');
let mat_btnKnock = new THREE.TextureLoader().load('assets/button/small/btn-knok.png');
let mat_btnKnockClose = new THREE.TextureLoader().load('assets/button/small/btn-knok-close.png');
let mat_btnCaseMove = new THREE.TextureLoader().load('assets/button/small/btn-movbasket.png');
let mat_btnCaseMoveClose = new THREE.TextureLoader().load('assets/button/small/btn-movbasket-close.png');
let mat_btnUV = new THREE.TextureLoader().load('assets/button/small/btn-uv.png');
let mat_btnUVClose = new THREE.TextureLoader().load('assets/button/small/btn-uv-close.png');
let mat_btnFolding = new THREE.TextureLoader().load('assets/button/small/btn-folding.png');
let mat_btnFoldingClose = new THREE.TextureLoader().load('assets/button/small/btn-folding-close.png');
let mat_btnFilter = new THREE.TextureLoader().load('assets/button/small/btn-filter.png');
let mat_btnFilterNumberOne = new THREE.TextureLoader().load('assets/button/btn-filter-num-1.png');
let mat_btnFilterNumberTwo = new THREE.TextureLoader().load('assets/button/btn-filter-num-2.png');
let mat_btnFilterNumberThree = new THREE.TextureLoader().load('assets/button/btn-filter-num-3.png');
let mat_btnFilterClose = new THREE.TextureLoader().load('assets/button/small/btn-filter-close.png');
let mat_btnMultiCorner = new THREE.TextureLoader().load('assets/button/small/btn-multi.png');
let mat_btnMultiCornerClose = new THREE.TextureLoader().load('assets/button/small/btn-multi-close.png');
let mat_btnLargeBasket = new THREE.TextureLoader().load('assets/button/small/btn-largebasket.png');
let mat_btnLargeBasketClose = new THREE.TextureLoader().load('assets/button/small/btn-largebasket-close.png');

/**
 * Create custom buttons, texts and sound
 */
function createButton(_track) {
    let geo, mat;

    // Button open video for Ice
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnWater }));
    geo = _track(new THREE.PlaneGeometry(1.5, 0.25, 32));
    btnOpenVideo = _track(new THREE.Mesh(geo, mat));
    btnOpenVideo.name = 'OpenWater';
    btnOpenVideo.type = 'CustomButton';
    btnOpenVideo.position.set(-0.05, 0.3, 0.11);
    btnOpenVideo.scale.setScalar(0.0625);

    // Button for IcePlus
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnIcePlus, opacity: 1 }));
    geo = _track(new THREE.CircleGeometry(0.2, 32));
    btnIcePlus = _track(new THREE.Mesh(geo, mat));
    btnIcePlus.name = 'IcePlus';
    btnIcePlus.type = 'CustomButton';
    btnIcePlus.position.set(-0.046, 0.265, 0.12);
    btnIcePlus.scale.setScalar(0.035);

    // Button open ice drop
    mat = _track(new THREE.MeshBasicMaterial({ map: btnIceDropMat }));
    geo = _track(new THREE.PlaneGeometry(1.4 / 2, 0.35 / 2, 32));
    btnIceDrop = _track(new THREE.Mesh(geo, mat));
    btnIceDrop.name = 'OpenIceDrop';
    btnIceDrop.type = 'CustomButton';
    btnIceDrop.position.set(-0.049, 0.265, 0.11);
    btnIceDrop.scale.setScalar(0.03);

    // Button open Magic door
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnMagicDoor }));
    geo = _track(new THREE.PlaneGeometry(1.2, 0.3, 32));
    btnOpenRightDoor = _track(new THREE.Mesh(geo, mat));
    btnOpenRightDoor.name = 'OpenMagicDoor';
    btnOpenRightDoor.type = 'CustomButton';
    btnOpenRightDoor.position.set(0.04, 0.208, 0.11);
    btnOpenRightDoor.scale.setScalar(0.0625);

    // Button knock-on the door
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnKnock }));
    geo = _track(new THREE.PlaneGeometry(0.7, 0.24, 32));
    btnKnockOn = _track(new THREE.Mesh(geo, mat));
    btnKnockOn.name = 'KnockOn';
    btnKnockOn.type = 'CustomButton';
    btnKnockOn.position.set(0.05, 0.385, 0.11);
    btnKnockOn.scale.setScalar(0.0625);

    // Button case moving
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnCaseMove }));
    geo = _track(new THREE.PlaneGeometry(0.8, 0.2, 32));
    btnCaseDoorMoving = _track(new THREE.Mesh(geo, mat));
    btnCaseDoorMoving.name = 'CaseDoorMoving';
    btnCaseDoorMoving.type = 'CustomButton';
    btnCaseDoorMoving.position.set(-0.01, 0.3, 0.11);
    btnCaseDoorMoving.scale.setScalar(0.09);

    // Button UV
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnUV }));
    geo = _track(new THREE.PlaneGeometry(0.8, 0.18, 32));
    btnUV = _track(new THREE.Mesh(geo, mat));
    btnUV.name = 'UVClick';
    btnUV.type = 'CustomButton';
    btnUV.position.set(-0.06, 0.365, -0.07);
    btnUV.scale.setScalar(0.08);

    // Button FoldingShelf
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnFolding }));
    geo = _track(new THREE.PlaneGeometry(0.65, 0.2, 32));
    btnFoldingShelf = _track(new THREE.Mesh(geo, mat));
    btnFoldingShelf.name = 'FoldingShelf';
    btnFoldingShelf.type = 'CustomButton';
    // btnFoldingShelf.position.set(0.04, 0.32, 0.05);
    btnFoldingShelf.position.set(-0.025, 0.32, 0.05);
    btnFoldingShelf.scale.setScalar(0.095);

    // Button open Filter
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnFilter }));
    geo = _track(new THREE.PlaneGeometry(1.4, 0.25, 32));
    btnOpenFilter = _track(new THREE.Mesh(geo, mat));
    btnOpenFilter.name = 'OpenFilter';
    btnOpenFilter.type = 'CustomButton';
    btnOpenFilter.position.set(0.03, 0.275, 0.05);
    btnOpenFilter.scale.setScalar(0.08);

    // Button for Filter number #1
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnFilterNumberOne, opacity: 0, transparent: true }));
    geo = _track(new THREE.CircleGeometry(0.2, 32));
    btnFilterNumberOne = _track(new THREE.Mesh(geo, mat));
    btnFilterNumberOne.name = 'FilterOne';
    btnFilterNumberOne.type = 'CustomButton';
    btnFilterNumberOne.position.set(0.03, 0.245, 0.07);
    btnFilterNumberOne.scale.setScalar(0.03);

    // Button for Filter number #2
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnFilterNumberTwo, opacity: 0, transparent: true }));
    geo = _track(new THREE.CircleGeometry(0.2, 32));
    btnFilterNumberTwo = _track(new THREE.Mesh(geo, mat));
    btnFilterNumberTwo.name = 'FilterTwo';
    btnFilterNumberTwo.type = 'CustomButton';
    btnFilterNumberTwo.position.set(0.03, 0.232, 0.07);
    btnFilterNumberTwo.scale.setScalar(0.03);

    // Button for Filter number #3
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnFilterNumberThree, opacity: 0, transparent: true }));
    geo = _track(new THREE.CircleGeometry(0.2, 32));
    btnFilterNumberThree = _track(new THREE.Mesh(geo, mat));
    btnFilterNumberThree.name = 'FilterThree';
    btnFilterNumberThree.type = 'CustomButton';
    btnFilterNumberThree.position.set(0.03, 0.218, 0.07);
    btnFilterNumberThree.scale.setScalar(0.03);

    // Button MultiCorner
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnMultiCorner }));
    geo = _track(new THREE.PlaneGeometry(1.1, 0.25, 32));
    btnMultiCorner = _track(new THREE.Mesh(geo, mat));
    btnMultiCorner.name = 'MultiCorner';
    btnMultiCorner.type = 'CustomButton';
    // btnMultiCorner.position.set(-0.04, 0.2, 0.1);
    btnMultiCorner.position.set(-0.043, 0.21, 0.05);
    btnMultiCorner.scale.setScalar(0.07);

    // Button LargeBasket
    mat = _track(new THREE.MeshBasicMaterial({ map: mat_btnLargeBasket }));
    geo = _track(new THREE.PlaneGeometry(1.2, 0.25, 32));
    btnLargeBasket = _track(new THREE.Mesh(geo, mat));
    btnLargeBasket.name = 'LargeBasket';
    btnLargeBasket.type = 'CustomButton';
    btnLargeBasket.position.set(0.05, 0.06, 0.12);
    btnLargeBasket.scale.setScalar(0.07);

    // Only add main buttons to Mesh as beginning
    mesh.add(btnOpenVideo, btnOpenRightDoor, btnKnockOn);
}

/**
 * Reset main button materials.
 */
function resetButtonMaterials() {
    console.warn(`resetButtonMaterials`);

    btnOpenVideo.material = new THREE.MeshBasicMaterial({ map: mat_btnWater });
    btnOpenVideo.name = 'OpenWater';

    btnOpenRightDoor.material = new THREE.MeshBasicMaterial({ map: mat_btnMagicDoor });
    btnOpenRightDoor.name = 'OpenMagicDoor';

    btnKnockOn.material = new THREE.MeshBasicMaterial({ map: mat_btnKnock });
    btnKnockOn.name = 'KnockOn';

    btnCaseDoorMoving.material = new THREE.MeshBasicMaterial({ map: mat_btnCaseMove });
    btnCaseDoorMoving.name = 'CaseDoorMoving';

    btnUV.material = new THREE.MeshBasicMaterial({ map: mat_btnUV });
    btnUV.name = 'UVClick';

    btnFoldingShelf.material = new THREE.MeshBasicMaterial({ map: mat_btnFolding });
    btnFoldingShelf.name = 'FoldingShelf';

    btnOpenFilter.material = new THREE.MeshBasicMaterial({ map: mat_btnFilter });
    btnOpenFilter.name = 'OpenFilter';

    btnMultiCorner.material = new THREE.MeshBasicMaterial({ map: mat_btnMultiCorner });
    btnMultiCorner.name = 'MultiCorner';

    btnLargeBasket.material = new THREE.MeshBasicMaterial({ map: mat_btnLargeBasket });
    btnLargeBasket.name = 'LargeBasket';

    btnIcePlus.material = new THREE.MeshBasicMaterial({ map: mat_btnIcePlus });
    btnIceDrop.material = new THREE.MeshBasicMaterial({ map: btnIceDropMat });
}

/**
 * Change the material for button click.
 * @param buttonName
 */
function toogleButton(buttonName) {
    console.error(`The animation clip is still playing =>>> ${isAnimationPlaying}`);
    if (isAnimationPlaying) return;

    console.warn('toogleButton', buttonName);
    let changeMat;

    switch (buttonName) {
        case 'OpenWater':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnWaterClose });
            btnOpenVideo.material = changeMat;
            btnOpenVideo.name = 'CloseWater';

            mesh.remove(btnKnockOn, btnOpenRightDoor);
            // show plus button
            mesh.add(btnIcePlus);

            break;
        case 'CloseWater':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnWater });
            btnOpenVideo.material = changeMat;
            btnOpenVideo.name = 'OpenWater';
            break;
        case 'KnockOn':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnKnockClose });
            btnKnockOn.material = changeMat;
            btnKnockOn.name = 'KnockOff';
            break;
        case 'KnockOff':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnKnock });
            btnKnockOn.material = changeMat;
            btnKnockOn.name = 'KnockOn';
            break;
        case 'OpenMagicDoor':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnMagicDoorClose });
            btnOpenRightDoor.material = changeMat;
            btnOpenRightDoor.name = 'CloseMagicDoor';
            break;
        case 'CloseMagicDoor':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnMagicDoor });
            btnOpenRightDoor.material = changeMat;
            btnOpenRightDoor.name = 'OpenMagicDoor';
            break;
        case 'CaseDoorMoving':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnCaseMoveClose });
            btnCaseDoorMoving.material = changeMat;
            btnCaseDoorMoving.name = 'CaseDoorClose';
            break;
        case 'CaseDoorClose':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnCaseMove });
            btnCaseDoorMoving.material = changeMat;
            btnCaseDoorMoving.name = 'CaseDoorMoving';
            resetButtonMaterials();

            break;
        case 'OpenFilter':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnFilterClose });
            btnOpenFilter.material = changeMat;
            btnOpenFilter.name = 'CloseFilter';

            mesh.remove(btnUV, btnMultiCorner, btnLargeBasket, btnFoldingShelf);
            break;
        case 'CloseFilter':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnFilter });
            btnOpenFilter.material = changeMat;
            btnOpenFilter.name = 'OpenFilter';
            break;
        case 'UVClick':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnUVClose });
            btnUV.material = changeMat;
            btnUV.name = 'UVClose';

            mesh.remove(btnOpenFilter, btnMultiCorner, btnLargeBasket, btnFoldingShelf);
            break;
        case 'UVClose':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnUV });
            btnUV.material = changeMat;
            btnUV.name = 'UVClick';

            mesh.add(btnOpenFilter, btnMultiCorner, btnLargeBasket, btnFoldingShelf);
            break;
        case 'FoldingShelf':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnFoldingClose });
            btnFoldingShelf.material = changeMat;
            btnFoldingShelf.name = 'FoldingShelfClose';

            mesh.remove(btnOpenFilter, btnMultiCorner, btnLargeBasket, btnUV);

            // Animation sequence:
            //  1. Hide the pot
            //  2. Open the sliding shelf
            //  3. Show the watermelon
            playSlidingShelf(bodyInsideGroup.children);

            break;
        case 'FoldingShelfClose':
            // Animation sequence:
            //  1. Remove watermelon
            //  2. Put the pot back
            //  3. Close sliding shelf
            closeSlidingShelf(bodyInsideGroup.children);

            break;
        case 'MultiCorner':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnMultiCornerClose });
            btnMultiCorner.material = changeMat;
            btnMultiCorner.name = 'MultiCornerClose';

            mesh.remove(btnOpenFilter, btnFoldingShelf, btnLargeBasket, btnUV);
            changeModelAngle();

            break;
        case 'MultiCornerClose':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnMultiCorner });
            btnMultiCorner.material = changeMat;
            btnMultiCorner.name = 'MultiCorner';

            mesh.add(btnOpenFilter, btnFoldingShelf, btnLargeBasket, btnUV);
            resetModelAngle();

            break;
        case 'LargeBasket':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnLargeBasketClose });
            btnLargeBasket.material = changeMat;
            btnLargeBasket.name = 'LargeBasketClose';

            mesh.remove(btnOpenFilter, btnFoldingShelf, btnMultiCorner, btnUV);
            break;
        case 'LargeBasketClose':
            changeMat = new THREE.MeshBasicMaterial({ map: mat_btnLargeBasket });
            btnLargeBasket.material = changeMat;
            btnLargeBasket.name = 'LargeBasket';

            mesh.add(btnOpenFilter, btnFoldingShelf, btnMultiCorner, btnUV);
            break;
    }
}
