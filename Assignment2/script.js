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

// Resizing
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight

    //Update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**************
 ** SCENE **
**************/
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 12, -20)
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
 ** LIGHTS **
 ************/
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)



/*************
 ** MESHES **
 *************/
// Cube Geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const drawCube = (height, params) =>
{
    //Create cube material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    })

    //Create Cube
    const cube = new THREE.Mesh(cubeGeometry, material)
 // HARRY → structured path
    if (params.term === 'harry') {
        cube.position.x = height * 0.8
        cube.position.z = height * 0.3
    } 
    // VOLDEMORT -> chaotic scatter
    else if (params.term === 'voldemort') {
        cube.position.x = (Math.random() - 0.5) * params.diameter * 2
        cube.position.z = (Math.random() - 0.5) * params.diameter * 2

        cube.position.y = height - 10 + (Math.random() - 0.5) * 5

        cube.rotation.x = Math.random() * Math.PI * 2
        cube.rotation.y = Math.random() * Math.PI * 2
        cube.rotation.z = Math.random() * Math.PI * 2
    } 
    // MAGICAL -> slightly elevated (base)
    else {
        cube.position.x = (Math.random() - 0.5) * params.diameter
        cube.position.z = (Math.random() - 0.5) * params.diameter
        cube.position.y = height - 10 + 2

        // mark for animation later
        cube.userData.magical = true
    }

    // Default Y for non-voldemort
    if (params.term !== 'voldemort') {
        cube.position.y = height - 10
    }

    // Scale
    cube.scale.x = params.scale
    cube.scale.y = params.scale
    cube.scale.z = params.scale

   // Only randomize rotation if NOT harry
    if (params.term !== 'harry') {
        if (params.randomized) {
            cube.rotation.x = Math.random() * 2 * Math.PI
            cube.rotation.y = Math.random() * 2 * Math.PI
            cube.rotation.z = Math.random() * 2 * Math.PI
        }
    }

    params.group.add(cube)
}


/*********
 ** UI **
 *********/
//UI
const ui = new dat.GUI()

let preset = {}

// Groups
const group1 = new THREE.Group()
scene.add(group1)
const group2 = new THREE.Group()
scene.add(group2)
const group3 = new THREE.Group()
scene.add(group3)


const uiObj = {
    sourceText: "",
    savesourceText() {
        saveSourceText()

    },
    term1: {
        term: 'harry',
        color: '#721319',
        diameter: 10,
        group: group1,
        nCubes: 100,
        randomized: false,
        scale: 5

    },
    term2: {
        term:'voldemort',
        color: '#0d3b02',
        diameter: 10,
        group: group2,
        nCubes: 100,
        randomized: true,
        scale: 1
    },
    term3: {
        term:'magical',
        color: '#e2f81e',
        diameter: 10,
        group: group3,
        nCubes: 100,
        randomized: true,
        scale: 1
    },

    saveTerms(){
        saveTerms()
    },
    rotateCamera: false

}

// UI Functions
const saveSourceText = () =>
{
    //UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    // Text Analysis
    tokenizedSourceText(uiObj.sourceText)

}

const saveTerms = () =>
{
    //UI
    preset = ui.save
    visualizeFolder.hide()
    cameraFolder.show()

    // Text Analysis
    findSearchTermInTokenizedText(uiObj.term1)
    findSearchTermInTokenizedText(uiObj.term2)
    findSearchTermInTokenizedText(uiObj.term3)
}



// Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
.add(uiObj, 'savesourceText')
.name("Save")

// Terms, Visualize and Camera Folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")
const cameraFolder = ui.addFolder("Camera")


termsFolder.add(uiObj.term1, 'term')
.name("Term 1")

termsFolder.add(group1, 'visible')
.name("Term 1 Visibility")

termsFolder.addColor(uiObj.term1, 'color')
.name("Term 1 Color")

termsFolder.add(uiObj.term2, 'term')
.name("Term 2")

termsFolder.add(group2, 'visible')
.name("Term 2 Visibility")

termsFolder.addColor(uiObj.term2, 'color')
.name("Term 2 Color")

termsFolder.add(uiObj.term3, 'term')
.name("Term 3")

termsFolder.add(group3, 'visible')
.name("Term 3 Visibility")

termsFolder.addColor(uiObj.term3, 'color')
.name("Term 3 Color")

visualizeFolder.add(uiObj, 'saveTerms')
.name("Visualize")

cameraFolder.add(uiObj, 'rotateCamera')
.name("Turntable")


//Terms and Visualize folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()


/********************
 ** TEXT ANALYSIS **
 *******************/

 // Varibles
 let parsedText, tokenizedText

 // Parse and Tokenize sourceText
 const tokenizedSourceText = (sourceText) =>
 {
    //Strip periods and downcase sourceText
    parsedText = sourceText.replaceAll(".", "").toLowerCase()
    
    // Tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)
 }

 // Find searchTerm in tokenizedText
 const findSearchTermInTokenizedText = (params) =>
 {
    // Use a for loop to go through the tokenizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        // If tokenizedText [i] matches our searchTerm, then we draw a cube
        if(tokenizedText[i] === params.term){
            // convert i into height, which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2

            // call drawCube function 100 times using converted height value
            for (let a = 0; a < params.nCubes; a++)
            {
                drawCube(height, params)
            }
          
        }
    }

 }
 //findSearchTermInTokenizedText("she", "pink")
 //findSearchTermInTokenizedText("rabbit", "white")
 //findSearchTermInTokenizedText("bird", "blue")

/*********************
 ** ANIMATION LOOP **
 ********************/

 const clock = new THREE.Clock()

 const animation = () => 
 {
    // Return elapsed time
    const elaspedTime = clock.getElapsedTime()

    //Update OrbitControls
    controls.update()

    // Rotate Camera
    if(uiObj.rotateCamera)
    {
        camera.position.x = Math.sin(elaspedTime * 0.1) * 25
        camera.position.z = Math.cos(elaspedTime * 0.1) * 25
        camera.position.y = 5
        camera.lookAt(0, 0, 0)
    }
    scene.traverse((obj) => {
    if (obj.isMesh) {
        if (obj.userData.magical) {
            obj.position.y += Math.sin(elaspedTime + obj.position.x) * 0.01
        }
    }
})
    
    //Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

animation()