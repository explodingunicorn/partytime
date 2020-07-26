//Function for creating the audio node and connecting it
var context = new AudioContext();

var audioElement = document.getElementById('music');
var source = context.createMediaElementSource(audioElement);

var analyser = context.createAnalyser();

//default fftSize
analyser.fftSize = 2048;

//Need an array that is half the size of the fftSize
//Unsigned integer
var frequencyData = new Uint8Array(1048);
analyser.getByteFrequencyData(frequencyData);

source.connect(analyser);
analyser.connect(context.destination);
console.log("connection made");


//On click play the song
$("#play").click(function()
{
	audioElement.play();
	console.log("playing");
});


//On click pause the song
$("#pause").click(function()
{
	audioElement.pause();
});

$("#submit").click(function()
{
	deleteArrays(randParticles, particleMaterials, particleSystems);
	numSystems = parseInt($("#systems").val());
	numParticles = parseInt($("#particles").val());
	red = parseInt($("#Red").val());
	green = parseInt($("#Green").val());
	blue = parseInt($("#Blue").val());
	createParticleFields(randParticles, particleMaterials, particleSystems);
});

//Mousewheel zoom in and out
$(window).bind('mousewheel DOMMouseScroll', function(event){
	if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		camera.position.z -= 10;
	}
	else {
		camera.position.z += 10;
	}
});

//Creating the Scene for Three Js
var scene = new THREE.Scene(); 
//Takes in FOV, aspect ratio, near, and far
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );

camera.position.set(0, 0, 300);

//creating renderer and setting its size
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

//adding the renderer to the body of the page
document.body.appendChild( renderer.domElement );

//creating a spotlight that is white
var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 0, 100, -200 );
scene.add(spotLight);

//number of systems running on the screen
var numSystems = 20;
var numParticles = 1000;
var red = 255;
var green = 0;
var blue = 0;

function createParticleFields(rParticles, pMaterials, pSystems)
{
	var x, y, z, d, particle, starDistance = 50;
	for(var i = 0; i < numSystems; i++)
	{
		rParticles[i] = new THREE.Geometry();
		//Equation for random spots on the surface of a sphere, adding them into geometry
		for (var p = 0; p < numParticles; p++) {
			x = -1 + Math.random() * 2;
			y = -1 + Math.random() * 2;
			z = -1 + Math.random() * 2;
			d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			x *= d;
			y *= d;
			z *= d;
			particle = new THREE.Vector3(x * starDistance, y * starDistance, z * starDistance);
			rParticles[i].vertices.push(particle);
		}

		//Creating a material for the mesh
		pMaterials[i] = new THREE.PointCloudMaterial({color: 0xFFFFFF, size: 2});
		pMaterials[i].color.setRGB(red/255, green/255, blue/255);

		//Creating a particle system from the material and mesh
		pSystems[i] = new THREE.PointCloud(rParticles[i], pMaterials[i]);
		scene.add(pSystems[i]);
		pSystems[i].position.set(0, 0, -200);
	}
}

var randParticles = [], particleMaterials = [], particleSystems = [];
createParticleFields(randParticles, particleMaterials, particleSystems);

function deleteArrays(rParticles, pMaterials, pSystems)
{
	for(var i = 0; i < numSystems; i++)
		scene.remove(pSystems[i]);

	rParticles.length = 0;
	pMaterials.length = 0;
	pSystems.length = 0;
}

//function to render the animation
function render()
{
	requestAnimationFrame(render);
	analyser.getByteFrequencyData(frequencyData);
	scaleFactor = .0075;
	for(var i = 0; i < numSystems; i++)
	{
		particleSystems[i].scale.x = frequencyData[i] * scaleFactor;
		particleSystems[i].scale.y = frequencyData[i] * scaleFactor;
		particleSystems[i].scale.z = frequencyData[i] * scaleFactor;
		particleSystems[i].rotation.y += .01;
		scaleFactor += .001;
	}
	renderer.render(scene, camera);

}

render();