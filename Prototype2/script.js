import * as THREE from "three"
import * as dat from "lil-gui"
import{ OrbitControls } from "OrbitControls"

/************
 ** SETUP **
 ***********/
//Sizes
const sizes={
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/**************
 ** SCENE **
**************/
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('teal')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(2, 2, -5)
//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*************
 ** MESHES **
 *************/
// testSphere
const capsuleGeometry = new THREE.CapsuleGeometry(1)
const capsuleMaterial = new THREE.MeshNormalMaterial( )
const testCapsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial )

scene.add(testCapsule)

//Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'), 
    side: THREE.DoubleSide,
    wireframe: true
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI * 0.5
scene.add(plane)


/*********
 ** UI **
 *********/
//UI
const ui = new dat.GUI()

//UI Object
const uiObject = {
    speed: 1,
    distance: 1,
    rotationSpeed: 1
}
    

//testCapsule UI
const capsulefolder = ui.addFolder('Capsule')
capsulefolder
    .add (uiObject, 'speed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Speed')

capsulefolder
    .add (uiObject, 'distance')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Distance')

capsulefolder
    .add (uiObject, 'rotationSpeed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Rotation Speed')

// plane UI
const planefolder = ui.addFolder('Plane')

planefolder
    .add(planeMaterial, 'wireframe')
    .name("Toggle Wireframe")

/*********************
 ** ANIMATION LOOP **
 ********************/

 const clock = new THREE.Clock()

 const animation = () => 
 {
    // Return elapsed time
    const elaspedTime = clock.getElapsedTime()

    //Animate Capsule
    testCapsule.position.y = Math.sin(elaspedTime * uiObject.speed) * uiObject.distance
    testCapsule.rotation.y = elaspedTime * uiObject.rotationSpeed

    //Update OrbitControls
    controls.update()
    
    //Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

animation()