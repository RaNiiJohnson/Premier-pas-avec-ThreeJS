import * as THREE from 'three'
import "./style.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap';
//scene
const scene = new THREE.Scene();

//create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.5
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//sizes
const sizes = {
  width: window.innerWidth,
  heigth: window.innerHeight
}

//ligth
const ligth = new THREE.PointLight(0xffffff, 1, 100)
ligth.position.set(0, 10, 10)
ligth.intensity = 1.25
scene.add(ligth)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.heigth, 0.1, 100)
camera.position.z = 10
scene.add(camera)

//renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.heigth)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//control
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 4

//resize
window.addEventListener('resize', () => {
  //update sizes
  sizes.width = window.innerWidth
  sizes.heigth = window.innerHeight
  //update camera
  camera.aspect = sizes.width / sizes.heigth
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.heigth)
})

const loop = () => {
  // mesh.position.x += 0.01
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//tomeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0.2, x: 0.3, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo('nav', { y: '-100%' }, { y: '0%' })
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 })


//Mouse animation color
let mouseDown = false
let rgb = [12, 23, 55]
window.addEventListener('mousedown', () => { mouseDown = true })
window.addEventListener('mouseUp', () => { mouseDown = false })

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.heigth) * 255),
      150
    ]
    //let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    // new THREE.Color('rgb(0,100,150)')
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b })
  }
})