// global variables
var camera, scene, renderer;
var geometry, material, mesh;
var gui;

// gui settings
var settings = {
	'scale': 0.005,
	'wireframe': false,
	'autorotate': true,
	'geometry': 'cube'
}

init();
initGUI();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    scene = new THREE.Scene();
    geometry = new THREE.BoxBufferGeometry( 0.4, 0.4, 0.4 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function initGUI() {
	gui = new dat.GUI();
	h = gui.addFolder("Common")
	h.add( settings, 'scale', 0.0, 0.01, 0.001 ).onChange( guiChanged );
	h.add( settings, 'wireframe').onChange(materialChanged);
	h = gui.addFolder("Geometry")
	h.add( settings, 'geometry', ['cube', 'cone']).onChange(geometryChanged);
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
	switch (settings.geometry) {
		case 'cone':
			geometry = new THREE.ConeBufferGeometry( 0.4, 0.4,0.4 );
			mesh = new THREE.Mesh( geometry, material );
			clearScene();
			scene.add(mesh);
			console.log('created cone');
			break;
		case 'cube':
			geometry = new THREE.BoxBufferGeometry( 0.4, 0.4,0.4 );
			mesh = new THREE.Mesh( geometry, material );
			clearScene();
			scene.add(mesh);
			console.log('created cube');
			break;
	}
}

function guiChanged() {
}

/* utilities */
function clearScene() {
	while(scene.children.length > 0){ 
		scene.remove(scene.children[0]); 
	}
}