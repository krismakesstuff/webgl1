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
let camXStart = 0;
let camYStart = 35;
let camZStart = 250;

const objects = [];


document.addEventListener( 'pointermove', onPointerMove );

// track colors
// let colors = ["#09f04a","#12ffd1","#0cbcff","#540fff","#cb0eff","#ff0ebc","#ff0e41","#ff510b","#ffca09"];

let colors = ["#ff1970", "#e81766", "#db12af", "#bf09d5", "#a200fa", "#6500e9", "#3c17db", "#2800d7"];

// playhead color
let playheadColor = "#ECE9E4";

// mouseOver color
let mouseOverColor = "#4C4C4C";

const width = window.innerWidth, height = window.innerHeight;

// renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1500 );
camera.position.set(camXStart, camYStart, camZStart);
//camera.lookAt(0, 0, 0 );

// camera.rotation.x = -1.39;
// camera.rotation.y = 0.005;
// camera.rotation.z = 0.03;

// light
const light = new THREE.AmbientLight( 0xE0E1DD );
scene.add( light );

// point light
const pointLight = new THREE.PointLight( 0x09f04a );
pointLight.position.set( 50, 50, 50 );

scene.add( pointLight );

// add a grid helper
const gridHelper = new THREE.GridHelper( 1000, 100 );
scene.add( gridHelper );



// raycaster
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();

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




// make a track for each color on the axis
// const tracks = [];
// const trackDistance = 300;
// const trackThickness = 10;

// for (let i = 0; i < colors.length; i++) {
// 	const trackGeometry = new THREE.BoxGeometry( trackDistance, 1, trackThickness );
// 	const trackMaterial = new THREE.MeshBasicMaterial( {color: colors[i]} );
// 	const track = new THREE.Mesh( trackGeometry, trackMaterial );
// 	track.position.x = planeSize * 2;
// 	track.position.y = -1;
// 	track.position.z = (i * trackThickness) + pathDistance * i;
// 	tracks.push(track);
// 	objects.push(track);
// 	scene.add( track );
// }


// make a track for each color, where each track is a hollow circle around the center. 
const tracks = [];
const trackDistance = 100;
const trackThickness = 10;
const trackRadius = 200;
const trackSpacing = 10;

for (let i = 0; i < colors.length; i++) {
	const trackGeometry = new THREE.TorusGeometry( trackRadius, trackThickness, 16, 100 );
	const trackMaterial = new THREE.MeshBasicMaterial( {color: colors[i]} );
	const track = new THREE.Mesh( trackGeometry, trackMaterial );
	track.position.x = 0;
	track.position.y = trackSpacing + (i * (trackThickness + trackSpacing));
	track.position.z = 0 ;
	track.rotation.x = Math.PI / 2;
	tracks.push(track);
	objects.push(track);
	scene.add( track );
}

const playheadSpacing = 10;

// make a playhead perpendicular to tracks that rotates around the tracks.
const playheadHeight = (tracks.length * trackThickness) + (tracks.length * trackSpacing) /2;
const playheadWidth = 10;
const playheadDepth = 4;

const playheadGeometry = new THREE.BoxGeometry( playheadWidth, playheadHeight, playheadDepth);
const playheadMaterial = new THREE.MeshBasicMaterial( {color: playheadColor} );
const playhead = new THREE.Mesh( playheadGeometry, playheadMaterial );
playhead.position.x = 0;
playhead.position.y = playheadHeight / 2;
playhead.position.z = 0;
playhead.rotation.y = 0;

scene.add( playhead );



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

let angle = 0;	
let rotationSpeed = 0.005;
let camDistanceMultiplier = 1.5;

function animate() {
	requestAnimationFrame( animate );

	// mesh.rotation.x += xSpeed;
	// mesh.rotation.y += ySpeed;

	let sinAngle = Math.sin(angle);
	let cosAngle = Math.cos(angle)

	// update playhead position and rotation around the tracks
	playhead.position.x = sinAngle * (trackRadius + playheadSpacing);
	playhead.position.z = cosAngle * (trackRadius + playheadSpacing);
	//playhead.rotation. += 0.01;


	camera.position.x = playhead.position.x * camDistanceMultiplier;  
	camera.position.z = playhead.position.z * camDistanceMultiplier;

	
	camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationSpeed);
	
	angle += rotationSpeed;

	//controls.update();
	
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


// mouseMove event
function onPointerMove( event ) {

	pointer.set( 
		( event.clientX / window.innerWidth ) * 2 - 1,
	 	- ( event.clientY / window.innerHeight ) * 2 + 1 
	);

	raycaster.setFromCamera( pointer, camera );

	// const intersects = raycaster.intersectObjects( objects, false );

	// if ( intersects.length > 0 ) {

	// 	const intersect = intersects[ 0 ];

	// 	intersect.object.material.color.set( mouseOverColor );
	// }
	
	// // set objects back to original color if not intersected
	// for (let i = 0; i < objects.length; i++) {
	// 	if(objects[i] !== intersects[0].object)
	// 	{
	// 		objects[i].material.color.set( colors[i] );
	// 	}
	// }
	
	renderer.render( scene, camera );
}