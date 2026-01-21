import * as THREE from "three"

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
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 0, 5)
//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

/*************
 ** MESHES **
 *************/
// testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial( )
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial )

//testTorus
const torusGeometry = new THREE.TorusGeometry(1)
const torusMaterial = new THREE.MeshNormalMaterial( )
const testTorus = new THREE.Mesh(torusGeometry, torusMaterial)

scene.add(testSphere)
scene.add(testTorus)

/*********************
 ** ANIMATION LOOP **
 ********************/

 const clock = new THREE.Clock()

 const animation = () => 
 {
    // Return elapsed time
    const elaspedTime = clock.getElapsedTime()

    // Animate testSphere
    console.log(Math.sin(elaspedTime))
    testSphere.position.y = Math.sin(elaspedTime)

    //Animate testTorus
    testTorus.position.x = Math.sin(elaspedTime)
    
    //Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

animation()