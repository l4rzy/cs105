// global variables
var camera, scene, renderer;
var floor, geometry, material, mesh, light, axes;
var gui;
var stats;

var afControl;
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
		'wireframe': false
	},
	'light': {
		'enable': true,
		'shadow': true
	},
	'affine': {
		'mode': 'traslate'
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
    phongMat = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 10, flatShading: true } );
    mesh = new THREE.Mesh( geometry, phongMat );
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
	axes = new THREE.AxesHelper( 5 );

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
	h.add( settings['geometry'], 'wireframe').onChange(materialChanged);
	h.add( settings['geometry'], 'shape', ['cube', 'cone']).onChange(geometryChanged);
	h = gui.addFolder("Light")
	h.add(settings['light'], 'enable').onChange(function() {
		if (settings['light'].enable == true) {
			renderer.shadowMap.enabled = true;
		}
		else renderer.shadowMap.enabled = false;
	});

	h = gui.addFolder('Affine')
	h.add(settings['affine'], 'mode', ['translate', 'rotate', 'scale']).onChange(affineChanged);

	guiChanged();
}

function materialChanged() {
	if ( material.wireframe == false) {
		material.wireframe = true;
	} else {
		material.wireframe = false;
	}
}

function geometryChanged() {
	switch (settings['geometry'].shape) {
		case 'cone':
			geometry = new THREE.ConeBufferGeometry( 0.4, 0.4,0.4 );
			mesh = new THREE.Mesh( geometry, material );
		    mesh.castShadow = true;
		    mesh.receiveShadow = false;
			mesh.name = "object";
			clearGeometry();
			scene.add(mesh);
			console.log('created cone');
			break;
		case 'cube':
			geometry = new THREE.BoxBufferGeometry( 0.4, 0.4,0.4 );
			mesh = new THREE.Mesh( geometry, material );
		    mesh.castShadow = true;
		    mesh.receiveShadow = false;
			mesh.name = "object";
			clearGeometry();
			scene.add(mesh);
			console.log('created cube');
			break;
	}
}

function guiChanged() {
}

function affineChanged() {
}

/* utilities */
function clearGeometry() {
	for (var i = 0; i < scene.children.length; i++) {
		if (scene.children[i].name == "object")
			scene.remove(scene.children[i]); 
	}
}