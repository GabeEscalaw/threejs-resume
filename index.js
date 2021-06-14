import {OrbitControls} from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
const canvas = document.querySelector('canvas.webgl')


// Here we always need 3 ObjectSpaceNormalMap
// 1. Scene - Container that has all the objects, lights, etc
// 2. Camera - To see what's in the scene
// 3. Renderer - To actually render out the graphics in the scene and make the magic happen

// Set-up
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera ( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // ( FOV, Aspect Ratio, View Frustrum (near and far))

const renderer = new THREE.WebGLRenderer({ // needs to know the domain to use which is the canvas with an id of #bg
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

renderer.render( scene, camera ); // Renderer == Draw

// Torus

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshStandardMaterial( { color: 0x00A7F0, wireframe: true, vertexColors: true } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper( 200, 50 );
// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

// Stars

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25);
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff} )
    const star = new THREE.Mesh( geometry, material );

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );

    star.position.set(x, y, z);
    scene.add(star)

}

Array(200).fill().forEach(addStar);

// Background Image

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Cube with Picture

const gabeTexture = new THREE.TextureLoader().load('tesseract.jpg')

const gabe = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial( { map: gabeTexture } )
);

scene.add(gabe);

// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial( {
        map: moonTexture,
        normalMap: normalTexture
    } )
);

scene.add(moon);

moon.position.z = 30; // 1 
moon.position.setX(-10); // 2

gabe.position.x = 2;
gabe.position.z = -5;
// These are 2 ways of setting dimensions and they do the same thing

function moveCamera() {
    const t = document.body.getBoundingClientRect().top; 
    // Gives the dimensions of the viewport, where the top property will show us exactly how far we are from the top of the webpage
    // From there we can start changing properties on our 3D Objects whenever this function is called
    // What's important here is changing the position of the actual camera (top value will always be negative, hence why we're multiplying it by a neg number )

    moon.rotation.x += 0.05;
    moon.rotation.x += 0.075;
    moon.rotation.x += 0.05;

    gabe.rotation.y += 0.01;
    gabe.rotation.z += 0.01;

    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
    camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera

function animate() {
    requestAnimationFrame( animate );

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    //controls.update();
    renderer.render( scene, camera );
}

animate()