let tube, stripMesh, stripMeshUp, texture, textureUp;
let nEnd = 0,
    nMax,
    nStep = 90; // 30 faces * 3 vertices/face

/**
 * Create pipeline of smoke
 */
function createSmokePipeline(_track) {
    const radiusTop = 1;
    const height = 10;

    // 1. Create horizontal arrows
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = 64;
    ctx.canvas.height = 64;
    ctx.translate(32, 32);
    ctx.rotate(Math.PI * 0.5);
    ctx.fillStyle = 'rgb(1,129,164)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '48px sans-serif';
    ctx.fillText('锟解埥韴�', 0, 0);

    texture = new THREE.CanvasTexture(ctx.canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 1;
    texture.repeat.y = 3.5;

    const stripGeo = _track(new THREE.PlaneBufferGeometry(radiusTop * 1.7, 7));
    const stripMat = _track(
        new THREE.MeshBasicMaterial({
            map: texture,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: false,
            transparent: true,
        }),
    );
    stripMesh = _track(new THREE.Mesh(stripGeo, stripMat));
    stripMesh.name = 'Arrow';
    stripMesh.position.set(-2, -1.5, 1.5);
    stripMesh.rotateZ((Math.PI / 180) * -90);

    // 2. Create vertical (up) arrows
    const ctxUp = document.createElement('canvas').getContext('2d');
    ctxUp.canvas.width = 64;
    ctxUp.canvas.height = 64;
    ctxUp.translate(28, 28);
    ctxUp.rotate(Math.PI * 0.5);
    ctxUp.fillStyle = 'rgb(1,129,164)';
    ctxUp.textAlign = 'center';
    ctxUp.textBaseline = 'middle';
    ctxUp.font = '48px sans-serif';
    ctxUp.fillText('锟解埥韴�', 0, 0);

    textureUp = new THREE.CanvasTexture(ctxUp.canvas);
    textureUp.wrapS = THREE.RepeatWrapping;
    textureUp.wrapT = THREE.RepeatWrapping;
    textureUp.repeat.x = 1;
    textureUp.repeat.y = 2;

    const stripGeoUp = _track(new THREE.PlaneBufferGeometry(radiusTop * 1.7, 4));
    const stripMatUp = _track(
        new THREE.MeshBasicMaterial({
            map: textureUp,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: false,
            transparent: true,
        }),
    );
    stripMeshUp = _track(new THREE.Mesh(stripGeoUp, stripMatUp));
    stripMeshUp.name = 'ArrowUp';
    stripMeshUp.position.set(-1, -1.5, 1.5);
    stripMeshUp.rotateZ((Math.PI / 180) * -90);

    // 2. Create points
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, 0, 5),
        new THREE.Vector3(1, 0, 5),
        new THREE.Vector3(0, 0, 5),
        new THREE.Vector3(-1, 0, 5),
        new THREE.Vector3(-2, 0, 5),
        new THREE.Vector3(-3, 0, 5),
        new THREE.Vector3(-4, 0, 5),
        new THREE.Vector3(-5, 0, 5), // p=8
        //backward
        new THREE.Vector3(-5, 0, 4),
        new THREE.Vector3(-5, 0, 3),
        new THREE.Vector3(-5, 0, 2),
        new THREE.Vector3(-5, 0, 1),
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(-5, 0, -1),
        new THREE.Vector3(-5, 0, -2),
        new THREE.Vector3(-5, 0, -3),
        new THREE.Vector3(-5, 0, -4),
        new THREE.Vector3(-5, 0, -5), // p=18
        // go right
        new THREE.Vector3(-4, 0, -5),
        new THREE.Vector3(-3, 0, -5),
        new THREE.Vector3(-2, 0, -5),
        new THREE.Vector3(-1, 0, -5),
        new THREE.Vector3(0, 0, -5),
        new THREE.Vector3(1, 0, -5),
        new THREE.Vector3(2, 0, -5),
        new THREE.Vector3(3, 0, -5),
        new THREE.Vector3(4, 0, -5),
        new THREE.Vector3(5, 0, -5), // p=28
        // go up
        new THREE.Vector3(5, 1, -5),
        new THREE.Vector3(5, 2, -5),
        new THREE.Vector3(5, 3, -5),
        new THREE.Vector3(5, 4, -5), // p=32
        // forward
        new THREE.Vector3(5, 4, -4),
        new THREE.Vector3(5, 4, -3),
        new THREE.Vector3(5, 4, -2),
        new THREE.Vector3(5, 4, -1),
        new THREE.Vector3(5, 4, 0),
        new THREE.Vector3(5, 4, 1),
        new THREE.Vector3(5, 4, 2),
        new THREE.Vector3(5, 4, 3),
        new THREE.Vector3(5, 4, 4),
        new THREE.Vector3(5, 4, 5), //p=42
        // go left
        new THREE.Vector3(4, 4, 5),
        new THREE.Vector3(3, 4, 5),
        new THREE.Vector3(2, 4, 5),
        new THREE.Vector3(1, 4, 5),
        new THREE.Vector3(0, 4, 5),
        new THREE.Vector3(-1, 4, 5),
        new THREE.Vector3(-2, 4, 5),
        new THREE.Vector3(-3, 4, 5),
        new THREE.Vector3(-4, 4, 5),
        new THREE.Vector3(-5, 4, 5), // p=52
        //backward
        new THREE.Vector3(-5, 4, 4),
        new THREE.Vector3(-5, 4, 3),
        new THREE.Vector3(-5, 4, 2),
        new THREE.Vector3(-5, 4, 1),
        new THREE.Vector3(-5, 4, 0),
        new THREE.Vector3(-5, 4, -1),
        new THREE.Vector3(-5, 4, -2),
        new THREE.Vector3(-5, 4, -3),
        new THREE.Vector3(-5, 4, -4),
        new THREE.Vector3(-5, 4, -5), // p=62
        // go right
        new THREE.Vector3(-4, 4, -5),
        new THREE.Vector3(-3, 4, -5),
        new THREE.Vector3(-2, 4, -5),
        new THREE.Vector3(-1, 4, -5),
        new THREE.Vector3(0, 4, -5),
        new THREE.Vector3(1, 4, -5),
        new THREE.Vector3(2, 4, -5),
        new THREE.Vector3(3, 4, -5),
        new THREE.Vector3(4, 4, -5),
        new THREE.Vector3(5, 4, -5), // p=72
        // go up
        new THREE.Vector3(5, 5, -5),
        new THREE.Vector3(5, 6, -5),
        new THREE.Vector3(5, 7, -5),
        new THREE.Vector3(5, 8, -5), // p=76
        // forward
        new THREE.Vector3(5, 8, -4),
        new THREE.Vector3(5, 8, -3),
        new THREE.Vector3(5, 8, -2),
        new THREE.Vector3(5, 8, -1),
        new THREE.Vector3(5, 8, 0),
        new THREE.Vector3(5, 8, 1),
        new THREE.Vector3(5, 8, 2),
        new THREE.Vector3(5, 8, 3),
        new THREE.Vector3(5, 8, 4),
        new THREE.Vector3(5, 8, 5), //p=86
        // go left
        new THREE.Vector3(4, 8, 5),
        new THREE.Vector3(3, 8, 5),
        new THREE.Vector3(2, 8, 5),
        new THREE.Vector3(1, 8, 5),
        new THREE.Vector3(0, 8, 5),
        new THREE.Vector3(-1, 8, 5),
        new THREE.Vector3(-2, 8, 5),
        new THREE.Vector3(-3, 8, 5),
        new THREE.Vector3(-4, 8, 5),
        new THREE.Vector3(-5, 8, 5), // p=96
        //backward
        new THREE.Vector3(-5, 8, 4),
        new THREE.Vector3(-5, 8, 3),
        new THREE.Vector3(-5, 8, 2),
        new THREE.Vector3(-5, 8, 1),
        new THREE.Vector3(-5, 8, 0),
        new THREE.Vector3(-5, 8, -1),
        new THREE.Vector3(-5, 8, -2),
        new THREE.Vector3(-5, 8, -3),
        new THREE.Vector3(-5, 8, -4),
        new THREE.Vector3(-5, 8, -5), // p106
        // go right
        new THREE.Vector3(-4, 8, -5),
        new THREE.Vector3(-3, 8, -5),
        new THREE.Vector3(-2, 8, -5),
        new THREE.Vector3(-1, 8, -5),
        new THREE.Vector3(0, 8, -5),
        new THREE.Vector3(1, 8, -5),
        new THREE.Vector3(2, 8, -5),
        new THREE.Vector3(3, 8, -5),
        new THREE.Vector3(4, 8, -5),
        new THREE.Vector3(5, 8, -5), // p=116
        // go up
        new THREE.Vector3(5, 9, -5),
        new THREE.Vector3(5, 10, -5),
        new THREE.Vector3(5, 11, -5),
        new THREE.Vector3(5, 12, -5), // p=120
        // forward
        new THREE.Vector3(5, 12, -4),
        new THREE.Vector3(5, 12, -3),
        new THREE.Vector3(5, 12, -2),
        new THREE.Vector3(5, 12, -1),
        new THREE.Vector3(5, 12, 0),
        new THREE.Vector3(5, 12, 1),
        new THREE.Vector3(5, 12, 2),
        new THREE.Vector3(5, 12, 3),
        new THREE.Vector3(5, 12, 4),
        new THREE.Vector3(5, 12, 5), //p=130
        // go left
        new THREE.Vector3(4, 12, 5),
        new THREE.Vector3(3, 12, 5),
        new THREE.Vector3(2, 12, 5),
        new THREE.Vector3(1, 12, 5),
        new THREE.Vector3(0, 12, 5),
        new THREE.Vector3(-1, 12, 5),
        new THREE.Vector3(-2, 12, 5),
        new THREE.Vector3(-3, 12, 5),
        new THREE.Vector3(-4, 12, 5),
        new THREE.Vector3(-5, 12, 5), // p=140
        //backward
        new THREE.Vector3(-5, 12, 4),
        new THREE.Vector3(-5, 12, 3),
        new THREE.Vector3(-5, 12, 2),
        new THREE.Vector3(-5, 12, 1),
        new THREE.Vector3(-5, 12, 0),
        new THREE.Vector3(-5, 12, -1),
        new THREE.Vector3(-5, 12, -2),
        new THREE.Vector3(-5, 12, -3),
        new THREE.Vector3(-5, 12, -4),
        new THREE.Vector3(-5, 12, -5), // p=150
        // go right
        new THREE.Vector3(-4, 12, -5),
        new THREE.Vector3(-3, 12, -5),
        new THREE.Vector3(-2, 12, -5),
        new THREE.Vector3(-1, 12, -5),
        new THREE.Vector3(0, 12, -5),
        new THREE.Vector3(1, 12, -5),
        new THREE.Vector3(2, 12, -5),
        new THREE.Vector3(3, 12, -5),
        new THREE.Vector3(4, 12, -5),
        new THREE.Vector3(5, 12, -5), // p=160
        // go up
        new THREE.Vector3(5, 13, -5),
        new THREE.Vector3(5, 14, -5),
        new THREE.Vector3(5, 15, -5),
        new THREE.Vector3(5, 16, -5), // p=164
        // forward
        new THREE.Vector3(5, 16, -4),
        new THREE.Vector3(5, 16, -3),
        new THREE.Vector3(5, 16, -2),
        new THREE.Vector3(5, 16, -1),
        new THREE.Vector3(5, 16, 0),
        new THREE.Vector3(5, 16, 1),
        new THREE.Vector3(5, 16, 2),
        new THREE.Vector3(5, 16, 3),
        new THREE.Vector3(5, 16, 4),
        new THREE.Vector3(5, 16, 5), //p=174
        // go left
        new THREE.Vector3(4, 16, 5),
        new THREE.Vector3(3, 16, 5),
        new THREE.Vector3(2, 16, 5),
        new THREE.Vector3(1, 16, 5),
        new THREE.Vector3(0, 16, 5),
        new THREE.Vector3(-1, 16, 5),
        new THREE.Vector3(-2, 16, 5),
        new THREE.Vector3(-3, 16, 5),
        new THREE.Vector3(-4, 16, 5),
        new THREE.Vector3(-5, 16, 5), // p=184
        //backward
        new THREE.Vector3(-5, 16, 4),
        new THREE.Vector3(-5, 16, 3),
        new THREE.Vector3(-5, 16, 2),
        new THREE.Vector3(-5, 16, 1),
        new THREE.Vector3(-5, 16, 0),
        new THREE.Vector3(-5, 16, -1),
        new THREE.Vector3(-5, 16, -2),
        new THREE.Vector3(-5, 16, -3),
        new THREE.Vector3(-5, 16, -4),
        new THREE.Vector3(-5, 16, -5), // p=194
        // go right
        new THREE.Vector3(-4, 16, -5),
        new THREE.Vector3(-3, 16, -5),
        new THREE.Vector3(-2, 16, -5),
        new THREE.Vector3(-1, 16, -5),
        new THREE.Vector3(0, 16, -5),
        new THREE.Vector3(1, 16, -5),
        new THREE.Vector3(2, 16, -5),
        new THREE.Vector3(3, 16, -5),
        new THREE.Vector3(4, 16, -5),
        new THREE.Vector3(5, 16, -5), // p=204
        // go up
        new THREE.Vector3(5, 17, -5),
        new THREE.Vector3(5, 18, -5),
        new THREE.Vector3(5, 19, -5),
        new THREE.Vector3(5, 20, -5), // p=208
        // forward
        new THREE.Vector3(5, 20, -4),
        new THREE.Vector3(5, 20, -3),
        new THREE.Vector3(5, 20, -2),
        new THREE.Vector3(5, 20, -1),
        new THREE.Vector3(5, 20, 0),
        new THREE.Vector3(5, 20, 1),
        new THREE.Vector3(5, 20, 2),
        new THREE.Vector3(5, 20, 3),
        new THREE.Vector3(5, 20, 4),
        new THREE.Vector3(5, 20, 5), //p=218
        // go left
        new THREE.Vector3(4, 20, 5),
        new THREE.Vector3(3, 20, 5),
        new THREE.Vector3(2, 20, 5),
        new THREE.Vector3(1, 20, 5),
        new THREE.Vector3(0, 20, 5),
        new THREE.Vector3(-1, 20, 5),
        new THREE.Vector3(-2, 20, 5),
        new THREE.Vector3(-3, 20, 5),
        new THREE.Vector3(-4, 20, 5),
        new THREE.Vector3(-5, 20, 5), // p=228
        //backward
        new THREE.Vector3(-5, 20, 4),
        new THREE.Vector3(-5, 20, 3),
        new THREE.Vector3(-5, 20, 2),
        new THREE.Vector3(-5, 20, 1),
        new THREE.Vector3(-5, 20, 0),
        new THREE.Vector3(-5, 20, -1),
        new THREE.Vector3(-5, 20, -2),
        new THREE.Vector3(-5, 20, -3),
        new THREE.Vector3(-5, 20, -4),
        new THREE.Vector3(-5, 20, -5), // p=238
    ]);
    let num = 238;
    const points = curve.getPoints(num);

    // 3. Path
    let path = new THREE.CatmullRomCurve3(points);

    // 4. Define params
    let pathSegments = 256, //speed
        tubeRadius = 0.6,
        radiusSegments = 16,
        closed = false;

    // 5. Geometry
    let geometry = _track(new THREE.TubeGeometry(path, pathSegments, tubeRadius, radiusSegments, closed));

    // 6. Convert Geometry to BufferGoemetry
    geometry = _track(new THREE.BufferGeometry().fromGeometry(geometry));
    nMax = geometry.attributes.position.count;

    // 7. Material
    let smokeTexture = _track(new THREE.TextureLoader().load('https://demo.letsee.io/confinity/assets/fog10.png'));
    let material = _track(
        new THREE.MeshBasicMaterial({
            // color: 0x00aee4,
            opacity: 1,
            side: THREE.FrontSide,
            depthWrite: false,
            depthTest: false,
            map: smokeTexture,
            transparent: true,
        }),
    );

    // 8. Create tube mesh
    tube = _track(new THREE.Mesh(geometry, material));
    // tube.add( new THREE.AxesHelper( 300 ) );
    tube.name = 'SmokePipeline';
    tube.position.set(0, 0.05, -0.01);
    tube.scale.setScalar(1 / 60);
    tube.rotateY((Math.PI / 180) * 180);

    // 9. Create smoke flow
    createSmokeFlow(_track);
}

/**
 * Create arrow strips for smoke flow
 * @param _track
 */
function createSmokeFlow(_track) {
    // strip #1 - left
    tube.add(stripMesh);
    stripMesh.visible = true;

    // strip #2 - backward
    let strip2 = stripMesh.clone();
    strip2.name = 'strip2';
    strip2.position.set(-5, 0, -1);
    strip2.rotateZ((Math.PI / 180) * -90);
    strip2.rotateX((Math.PI / 180) * -270);
    strip2.visible = false;
    tube.add(strip2);

    // strip #3 - right
    let strip3 = stripMesh.clone();
    strip3.name = 'strip3';
    strip3.position.set(0, 1, -1);
    strip3.rotateZ((Math.PI / 180) * 180);
    strip3.visible = false;
    tube.add(strip3);

    // strip #4 - up
    let strip4 = stripMeshUp.clone();
    strip4.name = 'strip4Up';
    strip4.position.set(4.5, 3, -0.5);
    strip4.rotateZ((Math.PI / 180) * -90);
    strip4.visible = false;
    tube.add(strip4);

    // strip #5 - forward
    let strip5 = strip2.clone();
    strip5.name = 'strip5';
    strip5.position.set(4.5, 4.5, 2);
    strip5.rotateZ((Math.PI / 180) * -180);
    strip5.visible = false;
    tube.add(strip5);

    // strip #6 - left
    let strip6 = stripMesh.clone();
    strip6.name = 'strip6';
    strip6.position.set(0, 4, 5.5);
    strip6.visible = false;
    tube.add(strip6);

    // strip #7 - backward
    let strip7 = strip2.clone();
    strip7.name = 'strip7';
    strip7.position.set(-5, 4, -1);
    strip7.visible = false;
    tube.add(strip7);

    // strip #8 - right
    let strip8 = strip3.clone();
    strip8.name = 'strip8';
    strip8.position.set(0, 4, -1);
    strip8.visible = false;
    tube.add(strip8);

    // strip #9 - up
    let strip9 = strip4.clone();
    strip9.name = 'strip9Up';
    strip9.position.set(4.5, 6, -1);
    strip9.visible = false;
    tube.add(strip9);

    // strip #10 - forward
    let strip10 = strip5.clone();
    strip10.name = 'strip10';
    strip10.position.set(4.5, 8, -1);
    strip10.visible = false;
    tube.add(strip10);

    // strip #11 - left
    let strip11 = strip6.clone();
    strip11.name = 'strip11';
    strip11.position.set(0, 8, 5.5);
    strip11.visible = false;
    tube.add(strip11);

    // strip #12 - backward
    let strip12 = strip7.clone();
    strip12.name = 'strip12';
    strip12.position.set(-5, 8, -1);
    strip12.visible = false;
    tube.add(strip12);

    // strip #13 - right
    let strip13 = strip8.clone();
    strip13.name = 'strip13';
    strip13.position.set(0, 8, -1);
    strip13.visible = false;
    tube.add(strip13);

    // strip #14 - up
    let strip14 = strip9.clone();
    strip14.name = 'strip14Up';
    strip14.position.set(4.5, 10, -1);
    strip14.visible = false;
    tube.add(strip14);

    // strip #15 - forward
    let strip15 = strip10.clone();
    strip15.name = 'strip15';
    strip15.position.set(4.5, 12, 0);
    strip15.visible = false;
    tube.add(strip15);

    // strip #16 - left
    let strip16 = strip11.clone();
    strip16.name = 'strip16';
    strip16.position.set(0, 12, 5.5);
    strip16.visible = false;
    tube.add(strip16);

    // strip #17 - backward
    let strip17 = strip12.clone();
    strip17.name = 'strip17';
    strip17.position.set(-5, 12, -1);
    strip17.visible = false;
    tube.add(strip17);

    // strip #18 - right
    let strip18 = strip13.clone();
    strip18.name = 'strip18';
    strip18.position.set(0, 12, -1);
    strip18.visible = false;
    tube.add(strip18);

    // strip #19 - up
    let strip19 = strip14.clone();
    strip19.name = 'strip19Up';
    strip19.position.set(4.5, 14, -1);
    strip19.visible = false;
    tube.add(strip19);

    // strip #20 - forward
    let strip20 = strip15.clone();
    strip20.name = 'strip20';
    strip20.position.set(4.5, 16.5, 0);
    strip20.visible = false;
    tube.add(strip20);

    // strip #21 - left
    let strip21 = strip16.clone();
    strip21.name = 'strip21';
    strip21.position.set(0, 16.5, 5.5);
    strip21.visible = false;
    tube.add(strip21);

    // strip #22 - backward
    let strip22 = strip17.clone();
    strip22.name = 'strip22';
    strip22.position.set(-5, 16.5, -1);
    strip22.visible = false;
    tube.add(strip22);

    // strip #23 - right
    let strip23 = strip18.clone();
    strip23.name = 'strip23';
    strip23.position.set(0, 16.5, -1);
    strip23.visible = false;
    tube.add(strip23);

    // strip #24 - up
    let strip24 = strip19.clone();
    strip24.name = 'strip24Up';
    strip24.position.set(4.5, 18.5, -1);
    strip24.visible = false;
    tube.add(strip24);

    // strip #25 - forward
    let strip25 = strip20.clone();
    strip25.name = 'strip25';
    strip25.position.set(4.5, 20, 0);
    strip25.visible = false;
    tube.add(strip25);

    // strip #26 - left
    let strip26 = strip21.clone();
    strip26.name = 'strip26';
    strip26.position.set(0, 20, 5.5);
    strip26.visible = false;
    tube.add(strip26);

    // strip #27 - backward
    let strip27 = strip22.clone();
    strip27.name = 'strip27';
    strip27.position.set(-5, 20, -1);
    strip27.visible = false;
    tube.add(strip27);
}

function animateTube(time) {
    // tube
    nEnd = (nEnd + nStep) % nMax;
    tube.geometry.setDrawRange(0, nEnd);

    const currentPoint = nEnd;
    const divide = nMax / 27;

    for (let i = 1; i <= 26; i++) {
        const pointLow = Math.round(i * divide);
        const pointHigh = Math.round((i + 1) * divide);
        if (pointLow < currentPoint && currentPoint < pointHigh) {
            tube.children[i].visible = true;
            tube.children[0].visible = true;
        }
    }

    if (currentPoint >= nMax * 0.99) {
        tube.children.forEach((item, index) => {
            if (index === 1) {
                item.visible = true;
                return;
            }
            item.visible = false;
        });
    }

    // arrow
    time *= 0.0005;
    textureUp.offset.y = texture.offset.y = (time * 3) % 1;

    idTubeAnim = requestAnimationFrame(animateTube);
}

/**
 * Getting a random number between two values.
 * Refer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
