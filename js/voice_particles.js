var loadSong = document.getElementById("songFile");

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
  console.log("got media");// Good to go!
} else {
  alert('getUserMedia() is not supported in your browser');
}

var errorCallback = function(e) {
	console.log('Reeeejected!', e);
};

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

var analyser, frequencyData, liveAudio, context = new AudioContext(), loaded = false;

navigator.getUserMedia({audio: true}, function(stream) {
	console.log("wtf");
	liveAudio = context.createMediaStreamSource(stream);
	analyser = context.createAnalyser();
	liveAudio.connect(analyser);
	analyser.connect(context.destination);
	analyser.fftSize = 2048;
	frequencyData = new Uint8Array(1048);
	analyser.getByteFrequencyData(frequencyData);
}, errorCallback);

var loaded = true;

//Mousewheel Control
$(window).bind('mousewheel DOMMouseScroll', function(event){
	if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		camera.position.z -= 10;
	}
	else {
		camera.position.z += 10;
	}
});

var oneColor = true, redFactor = .004, blueFactor = 0, greenFactor = 0;

$("#red").click(function()
{
	oneColor = true;
	redFactor = .004;
	blueFactor = 0;
	greenFactor = 0;
	$(this).css("border-style", "solid");
	$(this).css("border-color", "white");
	$("#green").css("border-style", "none");
	$("#blue").css("border-style", "none");
	$("#gradient").css("border-style", "none");
});

$("#green").click(function()
{
	oneColor = true;
	redFactor = 0;
	blueFactor = 0;
	greenFactor = 0.004;
	$(this).css("border-style", "solid");
	$(this).css("border-color", "white");
	$("#red").css("border-style", "none");
	$("#blue").css("border-style", "none");
	$("#gradient").css("border-style", "none");
});

$("#blue").click(function()
{
	oneColor = true;
	redFactor = 0;
	blueFactor = 0.004;
	greenFactor = 0;
	$(this).css("border-style", "solid");
	$(this).css("border-color", "white");
	$("#red").css("border-style", "none");
	$("#green").css("border-style", "none");
	$("#gradient").css("border-style", "none");
});

$("#gradient").click(function()
{
	oneColor = false;
	$(this).css("border-style", "solid");
	$(this).css("border-color", "white");
	$("#red").css("border-style", "none");
	$("#green").css("border-style", "none");
	$("#blue").css("border-style", "none");
});

//Creating the Scene for Three Js
var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 100, 100 );
scene.add(spotLight);

var numSystems = 20;

function createParticleFields(rParticles, pMaterials, pSystems)
{
	var x, y, z, d, particle, starDistance = 50;
	for(var h = 0; h < numSystems; h++)
	{
		rParticles[h] = new THREE.Geometry();
		for (var p = 0; p < 5000; p++) {
			x = -1 + Math.random() * 2;
			y = -1 + Math.random() * 2;
			z = -1 + Math.random() * 2;
			d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			x *= d;
			y *= d;
			z *= d;
			particle = new THREE.Vector3(x * starDistance, y * starDistance, z * starDistance);
			rParticles[h].vertices.push(particle);
		}
	}
	for (var i = 0; i < numSystems; i++)
	{
		pMaterials[i] = new THREE.PointCloudMaterial({color: 0xFFFFFF, size: 2});
		pMaterials[i].color.setRGB(255, 0, 0);
	}

	for (var j = 0; j < numSystems; j++)
	{
		pSystems[j] = new THREE.PointCloud(rParticles[j], pMaterials[j]);
		scene.add(pSystems[j]);
		pSystems[j].position.set(0, 0, -200);
	}
}

var randParticles = [], particleMaterials = [], particleSystems = [];
createParticleFields(randParticles, particleMaterials, particleSystems);

var zeroOut = new function() {
	for (var i = 0; i < numSystems; i++)
			{
				particleSystems[i].scale.x = 0;
				particleSystems[i].scale.y = 0;
				particleSystems[i].scale.z = 0;
			}	
}

var RGB = [1000, 0, 0];
var toRed = false, toGreen = true, toBlue = false;

//Render the scene out and make changes
function render()
{
	requestAnimationFrame(render);
	var constantScaleFactor = .00005;
	var scaleFactor = .00075;
	if (loaded)
	{
		analyser.getByteFrequencyData(frequencyData);
		for (var k = 0; k < numSystems; k++)
		{
			particleSystems[k].scale.x = frequencyData[k] * scaleFactor;
			particleSystems[k].scale.y = frequencyData[k] * scaleFactor;
			particleSystems[k].scale.z = frequencyData[k] * scaleFactor;
			particleSystems[k].rotation.y += frequencyData[k] * constantScaleFactor;
			if(oneColor){
				particleMaterials[k].color.setRGB(frequencyData[k] * redFactor,
												 frequencyData[k] * greenFactor, 
												 frequencyData[k] * blueFactor);
			}
			scaleFactor += .001;
		}
	}
	if (!loaded)
	{
		for (var l = 0; l < numSystems; l++)
		{
			particleSystems[l].rotation.y += .01;
		}
	}
	if(!oneColor)
	{
		if (toGreen){
			RGB[0] -= 1;
			RGB[1] += 1;
		}
		else if (toBlue){
			RGB[1] -= 1;
			RGB[2] += 1;
		}
		else{
			RGB[2] -= 1;
			RGB[0] += 1;
		}

		if (RGB[1] == 1000)
		{
			toGreen = false;
			toBlue = true;
		}
		else if (RGB[2] == 1000)
		{
			toBlue = false;
		}
		else if (RGB[0] == 1000)
		{
			toGreen = true;
		}

		for (var i =0; i < numSystems; i++)
		{
			particleMaterials[i].color.setRGB(RGB[0]/1000, RGB[1]/1000, RGB[2]/1000);
		}
	}
    renderer.render(scene, camera);
}

render();


