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
    camera.updateProjectionMatrix

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

const drawCube = (height, color) =>
{
    //Create cube material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color)
    })

    //Create Cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    // Position Cube
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = height - 10

    //Randomize cube rotation
    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI

    // Add cube to scene
    scene.add(cube)

}

//drawCube(0, 'red')
//drawCube(1, 'green')
//drawCube(2, 'yellow')
//drawCube(3, 'orange')

/*********
 ** UI **
 *********/
//UI
const ui = new dat.GUI()

let preset = {}

const uiObj = {
    sourceText: "the quick brown fox jumped over the lazy dog.",
    savesourceText() {
        saveSourceText()

    },
    term1:'fox',
    color1:'#aa00FF',
    term2:'dog',
    color2:'#00FFaa',
    term3:'',
    color3:'',
    saveTerms(){
        saveTerms()

    }

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

    // Text Analysis
    findSearchTermInTokenizedText(uiObj.term1, uiObj.color1)
    findSearchTermInTokenizedText(uiObj.term2, uiObj.color2)
    findSearchTermInTokenizedText(uiObj.term3, uiObj.color3)
}



// Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
.add(uiObj, 'savesourceText')
.name("Save")

// Terms and Visualize Folder
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")

termsFolder.add(uiObj, 'term1')
.name("Term 1")

termsFolder.addColor(uiObj, 'color1')
.name("Term 1 Color")

termsFolder.add(uiObj, 'term2')
.name("Term 2")

termsFolder.addColor(uiObj, 'color2')
.name("Term 2 Color")


termsFolder.add(uiObj, 'term3')
.name("Term 3")

termsFolder.addColor(uiObj, 'color3')
.name("Term 3 Color")

visualizeFolder.add(uiObj, 'saveTerms')
.name("Visualize")


//Terms and Visualize folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()


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
 const findSearchTermInTokenizedText = (term, color) =>
 {
    // Use a for loop to go through the tokenizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        // If tokenizedText [i] matches our searchTerm, then we draw a cube
        if(tokenizedText[i] === term){
            // convert i into height, which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2

            // call drawCube function 100 times using converted height value
            for (let a = 0; a < 100; a++)
            {
                drawCube(height, color)
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
    
    //Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

animation()