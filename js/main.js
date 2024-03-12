var xSpeed = 0.01;
var ySpeed = 0.01;

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
//import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// const controls = new OrbitControls( camera, renderer.domElement );

// const loader = new GLTFLoader();

// load font
// const fontLoader = new FontLoader();
// const font = fontLoader.load(
// 	// resource URL
// 	'fonts/Montserrat Thin_Regular.json',

// 	// onLoad callback
// 	function ( font ) {
// 		// do something with the font
// 		console.log( font );
// 	},

// 	// onProgress callback
// 	function ( xhr ) {
// 		console.log( 'font ' + (xhr.loaded / xhr.total * 100) + '% loaded' );
// 	},

// 	// onError callback
// 	function ( err ) {
// 		console.log( 'An error happened' );
// 	}
// );




// init


let seqRowLength = 16;
let numInstruments = 8;
let camXStatrt = 75;
let camYStart = 120;
let camZStart = 150;

// track colors
let colors = ["#09f04a","#12ffd1","#0cbcff","#540fff","#cb0eff","#ff0ebc","#ff0e41","#ff510b","#ffca09"];

// playhead color
let playheadColor = "#000000";

const width = window.innerWidth, height = window.innerHeight;

// renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
camera.position.set(camXStatrt, camYStart, camZStart);
camera.lookAt(0, 0, 0 );
camera.rotation.x = -1.39;
camera.rotation.y = 0.005;
camera.rotation.z = 0.03;

// light
const light = new THREE.AmbientLight( 0xE0E1DD );
scene.add( light );


// controls 
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// add base plane
const planeSize = 10;
const planeGeometry = new THREE.PlaneGeometry( planeSize, planeSize, 32 );
// const planeMaterial = new THREE.MeshBasicMaterial( {color: colors[i], side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( planeGeometry, planeMaterial );

// plane.rotation.x = Math.PI / 2;
// scene.add( plane );


// make a path, made of planes seperated by a distance
const path = [];
const pathDistance = 2;
//const pathLength = 50;

for (let i = 0; i < colors.length; i++) {
	const planeMaterial = new THREE.MeshBasicMaterial( {color: playheadColor, side: THREE.DoubleSide} );
	const pathPlane = new THREE.Mesh( planeGeometry, planeMaterial );
	pathPlane.position.z = (i * planeSize) + pathDistance * i;
	pathPlane.rotation.x = Math.PI / 2;
	path.push(pathPlane);
	scene.add( pathPlane );
}


// make a track for each color on the axis
const tracks = [];
const trackDistance = 100;
const trackThickness = planeSize * 0.9;

for (let i = 0; i < colors.length; i++) {
	const trackGeometry = new THREE.BoxGeometry( trackDistance, 1, trackThickness );
	const trackMaterial = new THREE.MeshBasicMaterial( {color: colors[i]} );
	const track = new THREE.Mesh( trackGeometry, trackMaterial );
	track.position.x = planeSize * 2;
	track.position.y = -1;
	track.position.z = (i * trackThickness) + pathDistance * i;
	tracks.push(track);
	scene.add( track );
}



// line
// const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
// const points = [
// 	new THREE.Vector3( -10, 0, 0 ),
// 	new THREE.Vector3( 0, 10, 0 ),
// 	new THREE.Vector3( 10, 0, 0 )

// ];

// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const line = new THREE.Line( geometry, material );

// const mesh = new THREE.Mesh( geometry, material );

// scene.add( line );



// const textGeometry = new TextGeometry( 'Hello three.js!', {
// 	font: font,
// 	size: 2000,
// 	height: 500,
// 	curveSegments: 12,
// 	bevelEnabled: true,
// 	bevelThickness: 10,
// 	bevelSize: 8,
// 	bevelOffset: 0,
// 	bevelSegments: 5
// } );

// const textMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
// const textMesh = new THREE.Mesh( textGeometry, textMaterial );


// scene.add( textMesh );

// loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

// 	const textGeometry = new TextGeometry( 'Hello three.js!', {
// 		font: font,
// 		size: 80,
// 		height: 5,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 10,
// 		bevelSize: 8,
// 		bevelOffset: 0,
// 		bevelSegments: 5
// 	} );

// 	scene.add( textGeometry );
// } );




// drawing frame



function animate() {
	requestAnimationFrame( animate );

	// mesh.rotation.x += xSpeed;
	// mesh.rotation.y += ySpeed;

	controls.update();
	
	//console.log("position: " + camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
	//console.log("rotation: " + camera.rotation.x + ", " + camera.rotation.y + ", " + camera.rotation.z);
	renderer.render( scene, camera );
}

// check if WebGL is available
if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	console.log('WebGL is available');
	animate();

} else {

	console.log('WebGL is not available');
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}