import { useRef, useEffect, useState } from 'react'
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from 'ogl'
import { rawProducts } from '../../data/products';

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}

function createTextTexture(gl, text, font = "bold 30px 'Saira', sans-serif", color = "black") {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  const fontSize = 40
  const fontFamily = font.replace(/\d+px/, `${fontSize}px`)

  context.font = fontFamily
  const metrics = context.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const textHeight = Math.ceil(fontSize * 1.5)

  canvas.width = textWidth + 60
  canvas.height = textHeight + 60

  context.font = fontFamily
  context.fillStyle = color
  context.textBaseline = "middle"
  context.textAlign = "center"

  context.shadowColor = 'rgba(0, 0, 0, 0.7)'
  context.shadowBlur = 10
  context.shadowOffsetX = 0
  context.shadowOffsetY = 3

  context.fillText(text, canvas.width / 2, canvas.height / 2)

  context.shadowBlur = 0
  context.shadowOffsetY = 0
  context.globalCompositeOperation = 'source-atop';
  context.fillStyle = 'rgba(255, 255, 255, 0.2)';
  context.fillText(text, canvas.width / 2, canvas.height / 2 - 1);

  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width: canvas.width, height: canvas.height }
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = "#545050", font = "bold 30px 'Saira', sans-serif" }) {
    autoBind(this)
    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.text = text
    this.textColor = textColor
    this.font = font
    this.createMesh()
  }
  createMesh() {
    const formattedText = this.text.charAt(0).toUpperCase() + this.text.slice(1).toLowerCase()

    const { texture, width, height } = createTextTexture(
      this.gl,
      formattedText,
      this.font,
      this.textColor
    )
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width / height
    const textHeight = this.plane.scale.y * 0.25
    const textWidth = textHeight * aspect
    this.mesh.scale.set(textWidth, textHeight, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.6
    this.mesh.setParent(this.plane)
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    link
  }) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.viewport = viewport
    this.bend = bend
    this.textColor = textColor
    this.borderRadius = borderRadius
    this.font = font
    this.createShader()
    this.link = link;
    this.createMesh()
    this.createTitle()
    this.onResize()
    this.isScrolling = false;
    this.scrollStopTimeout = null;

  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          float wave = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5);
p.z = wave * clamp(uSpeed * 0.5, 0.0, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Colores para degradado rosa a blanco (solo para áreas transparentes)
          vec3 bgColor1 = vec3(0.95, 0.75, 0.85); // Rosa suave superior
          vec3 bgColor3 = vec3(1.0, 0.95, 0.98); // Blanco con toque rosa inferior
          vec3 bgGradient = mix(bgColor1, bgColor3, vUv.y);
          
          // Suavizar la transición en los bordes para evitar líneas negras
          float smoothEdge = smoothstep(0.0, 0.01, -d);
          
          if(d > 0.0) {
            // Fuera del área principal - completamente transparente
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          } else {
            // Dentro del área principal
            if(color.a < 0.1) {
              // Si la imagen es transparente, mostrar fondo rosa
              gl_FragColor = vec4(bgGradient, smoothEdge);
            } else {
              // Mostrar la imagen con transparencia suavizada en los bordes
              gl_FragColor = vec4(color.rgb, color.a * smoothEdge);
            }
          }
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    })
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = this.image
    img.onload = () => {
      texture.image = img
      texture.needsUpdate = true
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      fontFamily: this.font
    })
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      }
    }
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

class App {
  constructor(container, { items, bend, textColor = "#ffffff", borderRadius = 0, font = "bold 30px Figtree" } = {}) {
    document.documentElement.classList.remove('no-js')
    this.container = container
    this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck, 200)
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update()
    this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene() {
    this.scene = new Transform()
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    this.mediasImages = items.concat(items)
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        link: `/productos/${data.id}`,
      })
    })
  }
  onTouchDown(e) {
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
  }
  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const distance = (this.start - x) * 0.05
    this.scroll.target = this.scroll.position + distance
  }
  onTouchUp() {
    this.isDown = false
    this.onCheck()
  }
  onWheel() {
    this.scroll.target += 2
    this.onCheckDebounce()
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }

  getMeshUnderMouse(x, y) {
    const rect = this.gl.canvas.getBoundingClientRect();
    const px = ((x - rect.left) / rect.width) * 2 - 1;
    const py = -((y - rect.top) / rect.height) * 2 + 1;

    const worldX = px * this.viewport.width / 2;
    const worldY = py * this.viewport.height / 2;

    for (const media of this.medias) {
      const { position, scale } = media.plane;
      const bounds = {
        left: position.x - scale.x / 2,
        right: position.x + scale.x / 2,
        top: position.y + scale.y / 2,
        bottom: position.y - scale.y / 2
      };

      if (
        worldX >= bounds.left &&
        worldX <= bounds.right &&
        worldY >= bounds.bottom &&
        worldY <= bounds.top
      ) {
        return media;
      }
    }

    return null;
  }

  onMouseMove(e) {
    const media = this.getMeshUnderMouse(e.clientX, e.clientY);
    if (media && media.link) {
      this.gl.canvas.style.cursor = 'pointer';
    } else {
      this.gl.canvas.style.cursor = 'default';
    }
  }

  onClick(e) {
    if (this.isScrolling) return;

    const x = e.clientX;
    const y = e.clientY;
    const media = this.getMeshUnderMouse(x, y);

    if (media && media.link) {
      window.location.href = media.link;
    }
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      )
    }
  }
  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';

    const delta = Math.abs(this.scroll.current - this.scroll.last);
    if (delta > 0.02) {
      if (!this.isScrolling) this.isScrolling = true;
      clearTimeout(this.scrollStopTimeout);
      this.scrollStopTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 150);
    }

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });

    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this)
    this.boundOnWheel = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    window.addEventListener('mousemove', this.boundOnMouseMove);
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    window.addEventListener('resize', this.boundOnResize)
    window.addEventListener('mousewheel', this.boundOnWheel)
    window.addEventListener('wheel', this.boundOnWheel)
    window.addEventListener('mousedown', this.boundOnTouchDown)
    window.addEventListener('mousemove', this.boundOnTouchMove)
    window.addEventListener('mouseup', this.boundOnTouchUp)
    window.addEventListener('touchstart', this.boundOnTouchDown)
    window.addEventListener('touchmove', this.boundOnTouchMove)
    this.boundOnClick = this.onClick.bind(this);
    this.gl.canvas.addEventListener('click', this.boundOnClick);
    window.addEventListener('touchend', this.boundOnTouchUp)
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    window.removeEventListener('mousewheel', this.boundOnWheel)
    window.removeEventListener('wheel', this.boundOnWheel)
    this.gl.canvas.removeEventListener('click', this.boundOnClick);
    window.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove', this.boundOnTouchMove)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#212529",
  borderRadius = 0.08,
  font = "bold 32px 'Saira', sans-serif"
}) {
  const containerRef = useRef(null)
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    rawProducts().then((products) => {
      const mappedItems = products.map(product => ({
        image: product.image,
        text: product.name,
        link: `/productos/${product.id}`,
        ...product
      }));
      setGalleryItems(mappedItems);
    });
  }, []);

  useEffect(() => {
    if (galleryItems.length === 0) return;
    const app = new App(containerRef.current, { items: galleryItems, bend, textColor, borderRadius, font })
    return () => {
      app.destroy()
    }
  }, [galleryItems, bend, textColor, borderRadius, font])

  return (
    <div className='circular-gallery' ref={containerRef} />
  )
}