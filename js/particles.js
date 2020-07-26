var loadSong = document.getElementById("songFile");
audioElement = document.getElementById("player");

var analyser, frequencyData, audioElement, context = new AudioContext(), loaded = false;

source = context.createMediaElementSource(audioElement);

analyser = context.createAnalyser();
analyser.fftSize = 2048;
frequencyData = new Uint8Array(1048);
analyser.getByteFrequencyData(frequencyData);

source.connect(analyser);
analyser.connect(context.destination);

var currentSong = 0;

var playing = false;

var songFile;

function loadSongs()
{
	$("#name").empty();
	$("#name").animate({bottom: '20px'});
	analyser.disconnect();
	source.disconnect();
	songFile = loadSong.files[currentSong];


	audioElement.src = URL.createObjectURL(songFile);
	audioElement.load();

	analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	frequencyData = new Uint8Array(1048);
	analyser.getByteFrequencyData(frequencyData);

	source.connect(analyser);
	analyser.connect(context.destination);
	$("#name").append(loadSong.files[currentSong].name);
}

function nextSong()
{
	if(currentSong+1 < loadSong.files.length)
	{
		currentSong++
		loadSongs();
		audioElement.play();
	}

	else
	{
		currentSong = 0;
		loadSongs();
		audioElement.play();
	}
}

function previousSong()
{
	if(currentSong > 0)
	{
		currentSong--;
		loadSongs();
		audioElement.play();
	}

	else
	{
		currentSong = loadSong.files.length-1;
		loadSongs();
		audioElement.play();
	}
}

//Load the song up
$("#load").click(function()
{
	loadSongs();
});

pressedPause = false;

//Play the audio
$("#play").click(function()
{
	playing = true;
	pressedPause = false;
	audioElement.play();
});

//Pause the audio
$("#pause").click(function()
{
	playing = false;
	pressedPause = true;
	audioElement.pause();
	//zeroOut();
});

$("#forward").click(function()
{
	nextSong();
});

$("#back").click(function()
{
	previousSong();
});

//Prep the audio player for a new song
$("#unload").click(function()
{
	loaded = false;
});

//Mousewheel Control
$(window).bind('mousewheel DOMMouseScroll', function(event){
	if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		camera.position.z -= 10;
	}
	else {
		camera.position.z += 10;
	}
});

var optionsOpen = false;

$("#showOptions").click(function()
{
	if(!optionsOpen)
	{
		$(this).animate({left: '250px'});
		$("#particleMenu").animate({left: '250px'});
		$("#cubeMenu").animate({left: '250px'});
		$("#radialCubeMenu").animate({left: '250px'});
		$("#modesMenu").animate({left: '250px'});
		$("#songLoader").animate({left: '250px'});
		$("#background").animate({left: '250px'});
		optionsOpen = true;
	}

	else
	{
		$(this).animate({left: '0px'});
		$("#particleMenu").animate({left: '0px'});
		$("#cubeMenu").animate({left: '0px'});
		$("#radialCubeMenu").animate({left: '0px'});
		$("#modesMenu").animate({left: '0px'});
		$("#songLoader").animate({left: '0px'});
		$("#background").animate({left: '0px'});
		optionsOpen = false;

	}
});

var modesOpen = false;

$("#cubes").click(function()
{
	if(!cube)
	{
		$("#particleMenu").hide();
		$("#radialCubeMenu").hide();
		$("#cubeMenu").show();
		if(particles)
			deleteAnimation(particleSystems, randParticles, particleMaterials);
		else if(radialCube)
			deleteAnimation(cubes, geometries, cubeMaterials);
		numSystems = 15;
		createCubes(cubes, cubeMaterials, geometries);
		cube = true;
		particles = false;
		radialCube = false;
	}
});

$("#particles").click(function()
{
	if(!particles)
	{
		$("#cubeMenu").hide();
		$("#radialCubeMenu").hide();
		$("#particleMenu").show();
		deleteAnimation(cubes, geometries, cubeMaterials);
		numSystems = 15;
		createParticleFields(randParticles, particleMaterials, particleSystems);
		particles = true;
		cube = false;
		radialCube = false;
	}
});

$("#radialCubes").click(function()
{
	$("#cubeMenu").hide();
	$("#radialCubeMenu").show();
	$("#particleMenu").hide();
	numSystems = 360;
	if(!radialCube)
	{
		if(particles)	
			deleteAnimation(particleSystems, randParticles, particleMaterials);
		else if(cubes)
			deleteAnimation(cubes, geometries, cubeMaterials);
		createRadialCubes(cubes, cubeMaterials, geometries);
		cube=false;
		particles=false;
		radialCube = true;
		//renderer.autoClear = false;
	}
});

motionBlur=false;

$("#motionBlur").click(function()
{
	if(!motionBlur)
	{
		motionBlur = true;
		renderer.autoClearColor = false;
		$("#motionBlur p").css('background-color', 'white')
	}
	else
	{
		motionBlur = false;
		renderer.autoClearColor = true;
		$("#motionBlur p").css('background-color', 'lightGray')
	}
});

$("#changeParticles").click(function()
{
	deleteAnimation(particleSystems, randParticles, particleMaterials);
	numSystems = parseInt($("#systems").val());
	numParticles = parseInt($("#nParticles").val());
	createParticleFields(randParticles, particleMaterials, particleSystems);
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

$("#swapColors").click(function()
{
	grad.setNumberRange(1, 15);
	grad.setSpectrum($("#c1").val(), $("#c2").val());
	for(var i = 0; i< numSystems; i++)
		cubeMaterials[i].color.setHex(parseInt("0x" + grad.colourAt(i)));
});

$("#swapRadColors").click(function()
{
	console.log("hello");
	grad2.setNumberRange(1, 6);
	grad2.setSpectrum($("#c3").val(), $("#c4").val());
	for(var i = 0; i< 6; i++)
	{
		radColors[i].setHex(parseInt("0x" + grad2.colourAt(i)));
	}
});

$("#randomColors").click(function()
{
	grad.setSpectrum($("#c1").val(), $("#c2").val());
	for(var i = 0; i< numSystems; i++)
		cubeMaterials[i].color.setRGB(Math.random(), Math.random(), Math.random());
});

//Creating the Scene for Three Js
var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 3000 );

var renderer = new THREE.WebGLRenderer({alpha: true, preserveDrawingBuffer: true, antialias: true, precision: "highp"});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.autoClearColor = true;

document.body.appendChild( renderer.domElement );

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 100, 100 );
scene.add(spotLight);

var plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), new THREE.MeshBasicMaterial( { transparent: true, opacity: 0.1, color: 0x000000 } ) );
plane.position.z = -1500;
scene.add( plane );

var numSystems = 10;
var group = new THREE.Group();
var vec = new THREE.Vector3(0, 1, 0);
var color1 = new THREE.Color(parseInt("0x"+$("#c1").val()));
var color2 = new THREE.Color("0x"+$("#c2").val());
var grad = new Rainbow();
grad.setNumberRange(1, 15);
grad.setSpectrum($("#c1").val(), $("#c2").val());


console.log($("#c1").val());

function createCubes(cubes, cMaterials, g)
{

	for(var i = 0; i < numSystems; i++)
	{
		g[i] = new THREE.BoxGeometry(70,70,70);
		cMaterials[i] = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: .5, wireframe: true});
		cMaterials[i].color.setHex(parseInt("0x" + grad.colourAt(i)));
	}
	for(var j = 0; j < numSystems; j++)
	{
		cubes[j] = new THREE.Mesh(g[j], cMaterials[j]);
		scene.add(cubes[j]);
		cubes[j].position.set(0, 0, -700);
	}
}

createdOnce = true;
var grad2 = new Rainbow();
grad2.setNumberRange(1,6);
var radColors = [];
grad2.setSpectrum($("#c3").val(), $("#c4").val());
for (var w = 0; w<6; w++)
	radColors[w] = new THREE.Color(parseInt("0x" + grad2.colourAt(w)));

function createRadialCubes(cubes, cMaterials, g)
{
	var factor = 360/numSystems;
	var r = numSystems/4;
	var deg = 0;
	var x, y;

	for (var i = 0; i<numSystems; i++)
	{
		g[i] = new THREE.BoxGeometry(1,1,1);
		cMaterials[i] = new THREE.MeshBasicMaterial({color: 0xffffff});
		cMaterials[i].color.setRGB(Math.random(), Math.random(), Math.random());
		cubes[i] = new THREE.Mesh(g[i], cMaterials[i]);

		x=r*Math.cos(deg*((Math.PI)/180));

		y=r*Math.sin(deg*((Math.PI)/180));

		scene.add(cubes[i]);

		cubes[i].position.set(x, y, 0);
		cubes[i].rotation.z = (deg*((Math.PI)/180));
		cubes[i].scale.x += 1;
		cubes[i].translateX(.5);
		deg = deg+factor;
		group.add(cubes[i]);
	}
	camera.position.set(0, 0, 400);
	scene.add(group);
	// if(createdOnce)
	// 	group.rotateOnAxis(vec, -30*Math.PI/180);
	first = true;
	createdOnce = false;
}

var geometries = [];
var cubes = [];
var cubeMaterials = [];

//createCubes(cubes, cubeMaterials, geometries);

function createParticleFields(rParticles, pMaterials, pSystems)
{
	var x, y, z, d, particle, starDistance = 50;
	for(var h = 0; h < numSystems; h++)
	{
		rParticles[h] = new THREE.Geometry();
		for (var p = 0; p < numParticles; p++) {
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
		pMaterials[i].color.setRGB(1, 1, 1);
	}

	for (var j = 0; j < numSystems; j++)
	{
		pSystems[j] = new THREE.PointCloud(rParticles[j], pMaterials[j]);
		scene.add(pSystems[j]);
		pSystems[j].position.set(0, 0, -300);
	}
}

var numParticles = 2000;
var randParticles = [], particleMaterials = [], particleSystems = [];
createParticleFields(randParticles, particleMaterials, particleSystems);

var scaleFactor = .00075;
var constantScaleFactor = .00005;

function animateParticles()
{
	scaleFactor = .000075;
	for (var i = 0; i < numSystems; i++)
		{
			if(frequencyData[i]<=0)
			{
				particleSystems[i].scale.x = 1
				particleSystems[i].scale.y = 1
				particleSystems[i].scale.z = 1
				particleSystems[i].rotation.y += frequencyData[i] * constantScaleFactor;
			}
			else
			{
				particleSystems[i].scale.x = frequencyData[i] * scaleFactor;
				particleSystems[i].scale.y = frequencyData[i] * scaleFactor;
				particleSystems[i].scale.z = frequencyData[i] * scaleFactor;
				particleSystems[i].rotation.y += frequencyData[i] * constantScaleFactor;
				if(oneColor){
					particleMaterials[i].color.setRGB(frequencyData[i] * redFactor,
													 frequencyData[i] * greenFactor, 
													 frequencyData[i] * blueFactor);
				}
			}
			scaleFactor += .001;
		}
}

function animateCubes()
{
	scaleFactor = .00075;
	for (var i = 0; i < numSystems; i++)
	{
		if(frequencyData[i]<=0)
		{
			cubes[i].scale.x = 1;
			cubes[i].scale.y = 1;
			cubes[i].scale.z = 1;
			cubes[i].rotation.y += .01;
		}
		else
		{
			if(frequencyData[i] > 0 && frequencyData[i] < 50)
			{
				cubes[i].rotation.x += 1*Math.PI/180
			}
			else if(frequencyData[i] > 50 && frequencyData[i] < 100)
			{
				cubes[i].rotation.z += 1*Math.PI/180
			}
			else if(frequencyData[i] > 100 && frequencyData[i] < 150)
			{
				cubes[i].rotation.y += 1*Math.PI/180
			}
			else if(frequencyData[i] > 150 && frequencyData[i] < 200)
			{
				cubes[i].rotation.y += 1.3*Math.PI/180
				cubes[i].rotation.z += 1.3*Math.PI/180
			}
			else
			{
				cubes[i].rotation.y += 1.5*Math.PI/180
				cubes[i].rotation.z += 1.5*Math.PI/180
				cubes[i].rotation.x += 1.5*Math.PI/180
			}
			cubes[i].scale.x = frequencyData[i] * scaleFactor;
			cubes[i].scale.y = frequencyData[i] * scaleFactor;
			cubes[i].scale.z = frequencyData[i] * scaleFactor;
			scaleFactor += .002;
		}
	}
}

var first = true;
var pastFrequency = [];
var left = false;
var right = true;
var rotateTimer = .2;
var clearCount = 1;

function blur()
{
	if (clearCount<100)
	{
		renderer.setClearColor( 0x000000, (clearCount/100));
		renderer.clear();
		clearCount++;
	}
	else
	{
		clearCount = 0;
	}
}

// function radialColorChange(i, frequencyData, cubeMaterials)
// {
// 		if(frequencyData[i] > 0 && frequencyData[i] < 70)
// 			cubeMaterials[i].color = radColors[0];
// 		else if(frequencyData[i] > 70 && frequencyData[i] < 140)
// 			cubeMaterials[i].color = radColors[1];
// 		else if(frequencyData[i] > 140 && frequencyData[i] < 180)
// 			cubeMaterials[i].color = radColors[2];
// 		else if(frequencyData[i] > 180 && frequencyData[i] < 200)
// 			cubeMaterials[i].color = radColors[3];
// 		else if(frequencyData[i] > 200 && frequencyData[i] < 220)
// 			cubeMaterials[i].color = radColors[4];
// 		else
// 		  	cubeMaterials[i].color = radColors[5];
// }

function animateRadialCubes()
{
	factor = 2
	if(playing)
	{
		if(first)
		{
			for(var i = 0; i < numSystems; i++)
			{
				cubes[i].scale.x = frequencyData[i]/factor;
				cubes[i].translateX((frequencyData[i]/factor)/2);
				pastFrequency[i] = frequencyData[i];
				if(frequencyData[i] > 0 && frequencyData[i] < 70)
					cubeMaterials[i].color.setHex(radColors[0].getHex());
				else if(frequencyData[i] > 70 && frequencyData[i] < 140)
					cubeMaterials[i].color.setHex(radColors[1].getHex());
				else if(frequencyData[i] > 140 && frequencyData[i] < 180)
					cubeMaterials[i].color.setHex(radColors[2].getHex());
				else if(frequencyData[i] > 180 && frequencyData[i] < 200)
					cubeMaterials[i].color.setHex(radColors[3].getHex());
				else if(frequencyData[i] > 200 && frequencyData[i] < 220)
					cubeMaterials[i].color.setHex(radColors[4].getHex());
				else
				  	cubeMaterials[i].color.setHex(radColors[5].getHex());
			}
			first = false;
		}
		else
		{
			for(var j = 0; j < numSystems; j++)
			{
				cubes[j].translateX(-((pastFrequency[j]/factor)/2));
				cubes[j].scale.x = frequencyData[j]/factor;
				cubes[j].translateX((frequencyData[j]/factor)/2);
				pastFrequency[j] = frequencyData[j];
				if(frequencyData[j] > 0 && frequencyData[j] < 40)
					cubeMaterials[j].color.setHex(radColors[0].getHex());
				else if(frequencyData[j] > 40 && frequencyData[j] < 80)
					cubeMaterials[j].color.setHex(radColors[1].getHex());
				else if(frequencyData[j] > 80 && frequencyData[j] < 120)
					cubeMaterials[j].color.setHex(radColors[2].getHex());
				else if(frequencyData[j] > 120 && frequencyData[j] < 170)
					cubeMaterials[j].color.setHex(radColors[3].getHex());
				else if(frequencyData[j] > 170 && frequencyData[j] < 220)
					cubeMaterials[j].color.setHex(radColors[4].getHex());
				else
				  	cubeMaterials[j].color.setHex(radColors[5].getHex());
			}
		}
	}
	// if(right)
	// {
	// 	group.rotateOnAxis(vec, .2*Math.PI/180);
	// 	rotateTimer+=.2;
	// 	if(rotateTimer>60)
	// 	{
	// 		rotateTimer = .2;
	// 		right = false
	// 		left = true;
	// 	}
	// }
	// else if(left)
	// {
	// 	group.rotateOnAxis(vec, -.2*Math.PI/180);
	// 	rotateTimer+=.2;
	// 	if(rotateTimer>60)
	// 	{
	// 		rotateTimer=.2;
	// 		right = true;
	// 		left = false;
	// 	}
	// }
}

var RGB = [1000, 0, 0];
var toRed = false, toGreen = true, toBlue = false;

function changeColors()
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

var cube = false;
var radialCube = false;
var particles = true;

function deleteAnimation(objects, geometry, material)
{

	for(var i = 0; i<numSystems; i++)
	{
		scene.remove(objects[i]);
		if(radialCube)
			group.remove(cubes[i]);
	}

	if(radialCube)
		scene.remove(group);

	objects.length = 0;
	geometry.length = 0;
	material.length = 0;
}

//Render the scene out and make changes
function render()
{
	requestAnimationFrame(render);
	if (playing)
	{
		analyser.getByteFrequencyData(frequencyData);
		if(particles)
		{
			animateParticles();
			if(!oneColor)
				changeColors();
		}
		else if (cube)
		{
			animateCubes();
		}
		else if(radialCube)
		{
			animateRadialCubes();
		}
		if(audioElement.paused && !pressedPause)
		{
			nextSong();
		}
		//blur();
	}
	if (!loaded)
	{
		if(particles)
		{
			for (var l = 0; l < numSystems; l++)
			{
				particleSystems[l].rotation.y += .01;
			}
		}
	}
    renderer.render(scene, camera);
}

render();