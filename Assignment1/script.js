import * as THREE from "three"
import * as dat from "lil-gui"
import{ OrbitControls } from "OrbitControls"



/************
 ** SETUP **
 ***********/
//Sizes
const sizes={
    width: window.innerWidth * 0.4,
    height: window.innerHeight,
    aspectRatio: window.innerWidth * 0.4 / window.innerHeight
}

/**************
 ** SCENE **
**************/
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color('black')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(10, 2, 7.5)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*************
 ** MESHES **
 *************/
//Cave
const caveGeometry = new THREE.PlaneGeometry(15.5, 7.5)
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})
const cave = new THREE.Mesh(caveGeometry, caveMaterial)
cave.rotation.y = Math.PI * 0.5
cave.receiveShadow = true
scene.add(cave)

//Objects

const boxGeometry = new THREE.BoxGeometry(2,2,2)
const boxMaterial = new THREE.MeshNormalMaterial()
const box = new THREE.Mesh(boxGeometry,boxMaterial)
box.position.set(10,1,0)
box.castShadow = true
scene.add(box)



/***********
 **LIGHTS**
 ***********/
//Point Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 2, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024


//Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper)

/********************
 **DOM INTERACTIONS**
 *******************/
const domObject={
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
}

//part-one
document.querySelector('#part-one').onclick = function() {
    domObject.part = 1
}
//part-two
document.querySelector('#part-two').onclick = function() {
    domObject.part = 2
}

//first-change
document.querySelector('#first-change').onclick = function() {
    domObject.firstChange = true
}

//second-change
document.querySelector('#second-change').onclick = function() {
    domObject.secondChange = true
}

//third-change
document.querySelector('#third-change').onclick = function() {
    domObject.thirdChange = true
}

//fourth-change
document.querySelector('#fourth-change').onclick =function() {
    domObject.fourthChange = true
}

/*********
 ** UI **
 *********/
//UI
/*
const ui = new dat.GUI()

const lightPositionFolder = ui.addFolder('Light Position')

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Y')

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Z')
*/

/*********************
 ** ANIMATION LOOP **
 ********************/

 const clock = new THREE.Clock()

 const animation = () => 
 {
    // Return elapsed time
    const elaspedTime = clock.getElapsedTime()

    //console.log(camera.position) //best to use when trying to figure out a specific camera position for assignment

    // part-one
    if(domObject.part === 1)
    {
        camera.position.set(6, 0, 0)
        camera.lookAt(0, 0, 0)
    }

    // part-two
     if(domObject.part === 2)
    {
        camera.position.set(25, 6, 8)
        camera.lookAt(0, 0, 0)
    }

    //first-change
    if(domObject.firstChange)
    {
       box.scale.y = 3
    }

    //second-change
    if(domObject.secondChange)
    {
        box.rotation.y = Math.PI / 2
        box.scale.x = 0.2
    }

    //third-change
    if(domObject.thirdChange)
    {
       box.position.x = 7
       box.scale.set(0.5, 0.5, 0.5)
    }

    //fourth-change 
    if(domObject.fourthChange)
    {
       box.position.x = 13
       box.scale.set(3, 3, 3)
    }

    //Update directional light helper
    directionalLightHelper.update()

    //Update OrbitControls
    controls.update()
    
    //Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

animation()