// global variables
var camera, scene, renderer;
var geometry, material, mesh;
var gui;

// gui settings
var settings = {
	'scale': 0.005,
	'wireframe': false,
	'geometries': 'cube'
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
	h.add( settings, 'geometries', ['cube', 'cone']).onChange(guiChanged);
	guiChanged();
}

function materialChanged() {
	if ( material.wireframe == false) {
		material.wireframe = true;
	} else {
		material.wireframe = false;
	}
}

function guiChanged() {
}