/* CSCI 5619 Assignment 1, Fall 2020
 * Author: Evan Suma Rosenberg
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
// Required to populate the Create methods on the mesh class. 
// Without this, the bundle would be smaller,
// but the createXXX methods from mesh would not be accessible.
import {MeshBuilder} from  "@babylonjs/core/Meshes/meshBuilder";
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial";
import {Texture} from "@babylonjs/core/Materials/Textures/texture";

import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import "@babylonjs/loaders/OBJ/objFileLoader";
import "@babylonjs/loaders/glTF/2.0/glTFLoader";


import "@babylonjs/inspector";

/******* Add the Game class with a static CreateScene function ******/
class Game 
{ 
    public static CreateScene(engine: Engine, canvas: HTMLCanvasElement): Scene 
    {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new Scene(engine);

        // This creates and positions a first-person camera (non-mesh)
        var camera = new UniversalCamera("camera1", new Vector3(0, 5, -10), scene);

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.3;

        // Our built-in 'ground' shape.
        var ground = MeshBuilder.CreateGround("ground", {width: 60, height: 60}, scene);
        ground.position.x = 0;
        ground.position.z = -10;

        var grass = new Texture("assets/textures/grass.jpg", scene);

        var groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = grass;
        ground.material = groundMaterial;

        var stick = MeshBuilder.CreateCylinder("stick", {height: 1.5, diameter: .1}, scene);
       
        var wood = new Texture("assets/textures/wood.jpg", scene)
        var stickMaterial = new StandardMaterial("woodMaterial", scene);
        stickMaterial.diffuseTexture = wood;
        stick.material = stickMaterial;

        var bucket = MeshBuilder.CreateCylinder("bucket", {height: 0.4, diameter: .2}, scene);

        var metal = new Texture("assets/textures/metal.png", scene)
        var metalMaterial = new StandardMaterial("metalMaterial", scene);
        metalMaterial.diffuseTexture = metal;
        bucket.material = metalMaterial;


        var hay1 = MeshBuilder.CreateBox("hay 1", {height: 1, width: 1, depth: 1}, scene)
        hay1.position = new Vector3(-1.55, .5, .3);
        hay1.rotation = new Vector3(0,-7.2,0);

        var hay2 = MeshBuilder.CreateBox("hay 1", {height: 1, width: 1, depth: 1}, scene)
        hay2.position = new Vector3(1.55, .5, .3);
        hay2.rotation = new Vector3(0,7.2,0);
       
        var hayText = new Texture("assets/textures/hay.jpg", scene);

        var hayMaterial = new StandardMaterial("hayMaterial", scene);
        hayMaterial.diffuseTexture = hayText;
        hay1.material = hayMaterial;
        hay2.material = hayMaterial;

        var Farmer = SceneLoader.ImportMesh("","assets/models/", "workermanOBJ.glb", scene, (meshes) =>{
             meshes[0].position.y = 1.38;
             meshes[0].rotation = new Vector3(0, 0, 0);
        });

        var ufo = SceneLoader.ImportMesh("","assets/models/", "ufo.glb", scene, (meshes) =>{
             meshes[0].position.y = 5.97;
             meshes[0].position.z = 2.78;
             meshes[0].rotation = new Vector3(90, 0, 0);
        });

        var spotlight = new SpotLight("spotLight", new Vector3(0, 4.94, 2.84), new Vector3(0, -0.89, -0.46), Math.PI / 3, 2, scene);
        spotlight.intensity = 1.0;
        spotlight.diffuse = new Color3(0.8,1,0);

        var shadowGen = new ShadowGenerator(1024,spotlight);
        shadowGen.addShadowCaster(hay1);
        shadowGen.addShadowCaster(hay2);
        shadowGen.addShadowCaster(stick);
        shadowGen.addShadowCaster(bucket);
        ground.receiveShadows = true;


        var alpha = 0;
        var beta = 0;
	    scene.registerBeforeRender(function () {
		    stick.rotation.x += 0.01;
            stick.rotation.y += 0.02
		    stick.rotation.z += 0.02;

		    stick.position = new Vector3(Math.cos(alpha) * 2, 3, Math.sin(alpha) * 2);
		    alpha += 0.01;

            bucket.rotation.x += 0.01;
            bucket.rotation.y += 0.02
		    bucket.rotation.z += 0.02;

		    bucket.position = new Vector3(Math.cos(beta) * -2, 2, Math.sin(beta) * -2);
		    beta -= 0.01;

	    });

        scene.debugLayer.show();

        return scene;
    }
}
/******* End of the Game class ******/   
 

// Get the canvas element 
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Generate the BABYLON 3D engine
const engine = new Engine(canvas, true); 

// Call the createScene function
const scene = Game.CreateScene(engine, canvas);

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () 
{ 
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () 
{ 
    engine.resize();
});