// global variables
var camera, scene, renderer;
var floor, geometry, material, mesh, light, axes;
var gui;
var stats;

// controls 
var obControl, afControl;
// rotation values
var rot_x = 0.01;
var rot_y = 0.02;

// gui settings
var settings = {
	'common': {
		'scale': 0.005,
		'autorotate': true,
		'showaxes': true
	},
	'geometry': {
		'shape': 'cube',
		'mat': 'basic'
	},
	'light': {
		'enable': true,
		'shadow': true
	},
	'affine': {
		'mode': 'none'
	}

}

init();
initGUI();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 2;
    scene = new THREE.Scene();
	
	// main object
    geometry = new THREE.BoxBufferGeometry( 0.4, 0.4, 0.4 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = false;
	mesh.name = "object";
	
	// floor
	floor = new THREE.PlaneBufferGeometry(5,5,32,32);
	var floorMat = new THREE.MeshStandardMaterial( { color: 0x222222 } )
	var floorMesh = new THREE.Mesh( floor, floorMat );
	floorMesh.receiveShadow = true;
	floorMesh.rotation.x = - Math.PI / 2.0;
	floorMesh.name = "floor";
	floorMesh.position.set(0, -0.6 ,0);

	// light
	light = new THREE.PointLight( 0xffffff, 2, 100 );
	light.position.set( 0, 1, 0 );
	light.castShadow = true;            // default false

	// axesHelper
	axes = new THREE.GridHelper( 100, 2 );

	// add object and floor to scene
    scene.add(floorMesh);
	scene.add( mesh );
	scene.add( light );
	scene.add( axes );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
   	renderer.shadowMap.enabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
	
	// stats
	stats = new Stats();
	document.body.appendChild(stats.dom);
	
	// controls
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 1;
	controls.minDistance = 1;
	controls.maxDistance = 10;

	afControl = new THREE.TransformControls( camera, renderer.domElement );
	afControl.addEventListener( 'change', function() {
		renderer.render(scene, camera);
	} );
	afControl.addEventListener( 'dragging-changed', function ( event ) {
		controls.enabled = ! event.value;
	} );

	//afControl.attach(mesh);
	scene.add(afControl);
	window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
    requestAnimationFrame( animate );
	
	if (settings['common'].autorotate == true) {
		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.02;
    }
	
    renderer.render( scene, camera );
	stats.update();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function initGUI() {
	gui = new dat.GUI();
	h = gui.addFolder("Common")
	h.add( settings['common'], 'scale', 0.0, 0.01, 0.001 ).onChange( guiChanged );
	h.add(settings['common'], 'showaxes').onChange(function() {
		if (settings['common'].showaxes == true) {
			axes.visible = true;
		}
		else {
			axes.visible = false;
		}
	})
	h.add(settings['common'], 'autorotate');

	h = gui.addFolder("Geometry")
	h.add(settings['geometry'], 'mat', ['basic', 'line', 'dot', 'shading']).onChange(matChanged);
	h.add( settings['geometry'], 'shape', ['cube', 'cone']).onChange(geometryChanged);
	h = gui.addFolder("Light")
	h.add(settings['light'], 'enable').onChange(function() {
		if (settings['light'].enable == true) {
			renderer.shadowMap.enabled = true;
		}
		else renderer.shadowMap.enabled = false;
	});

	h = gui.addFolder('Affine')
	h.add(settings['affine'], 'mode', ['none', 'translate', 'rotate', 'scale']).onChange(affineChanged);

	guiChanged();
}

function geometryChanged() {
	switch (settings['geometry'].shape) {
		case 'cone':
			geometry = new THREE.ConeBufferGeometry( 0.4, 0.4,0.4 );
			break;
		case 'cube':
			geometry = new THREE.BoxBufferGeometry( 0.4, 0.4,0.4 );
			break;
	}

	updateMesh(geometry, material);
}

function affineChanged() {
	switch (settings['affine'].mode) {
		case 'none':
			console.log('detached');
			afControl.detach();
			break;
		case 'translate':
			console.log("translating");
			afControl.setMode('translate');
			afControl.attach(mesh);
			break;
		case 'rotate':
			afControl.setMode('rotate');
			afControl.attach(mesh);
			break;
		case 'scale':
			afControl.setMode('scale');
			afControl.attach(mesh);
			break;
	}
}

function matChanged() {
	switch (settings['geometry'].mat) {
		case 'basic':
			material = new THREE.MeshBasicMaterial( { color: 0x222222 } )
			break;
		case 'line':
			material = new THREE.MeshNormalMaterial();
			material.wireframe = true;
			break;
		case 'dot':
			//TBD
			break;
		case 'shading':
			material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 10, flatShading: true } );
			break;
	}

	updateMesh(geometry, material);
}

/* utilities */
function clearGeometry() {
	for (var i = 0; i < scene.children.length; i++) {
		if (scene.children[i].name == "object")
			scene.remove(scene.children[i]); 
	}
}

function updateMesh(g, m) {
	mesh = new THREE.Mesh( g, m );
    mesh.castShadow = true;
    mesh.receiveShadow = false;
	mesh.name = "object";
	clearGeometry();
	scene.add(mesh);
}