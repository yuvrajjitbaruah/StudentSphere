import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.getElementById("hero3d");
const fallback = document.getElementById("hero3dFallback");

const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
const shouldDisableHero3d = prefersReducedMotion || isCoarsePointer;

// On phones/tablets we skip the heavy WebGL animation to keep scrolling smooth.
if (canvas && shouldDisableHero3d) {
    canvas.style.display = "none";
    if (fallback) fallback.style.display = "grid";
}

if (canvas && !shouldDisableHero3d) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0x6d7dff, 1.2);
    scene.add(ambient);

    const point = new THREE.PointLight(0x8fdbff, 2.4, 20);
    point.position.set(3, 4, 5);
    scene.add(point);

    const accent = new THREE.PointLight(0x7c3aed, 1.2, 16);
    accent.position.set(-3, -1, 4);
    scene.add(accent);

    const geometry = new THREE.TorusKnotGeometry(0.9, 0.28, 220, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x90a7ff,
        metalness: 0.35,
        roughness: 0.15,
        transmission: 0.2,
        clearcoat: 1.0,
    });
    const fallbackMesh = new THREE.Mesh(geometry, material);
    scene.add(fallbackMesh);

    const loader = new GLTFLoader();
    let activeModel = fallbackMesh;
    let modelLoaded = false;
    loader.load(
        "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
        (gltf) => {
            scene.remove(fallbackMesh);
            activeModel = gltf.scene;
            activeModel.scale.set(1.6, 1.6, 1.6);
            activeModel.position.y = -0.25;
            scene.add(activeModel);
            modelLoaded = true;
        },
        undefined,
        () => {
            activeModel = fallbackMesh;
        }
    );

    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 250;
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 1) {
        positions[i] = (Math.random() - 0.5) * 12;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
        starsGeo,
        new THREE.PointsMaterial({ color: 0xb5c7ff, size: 0.03 })
    );
    scene.add(stars);

    const cometCount = 7;
    const comets = [];
    for (let i = 0; i < cometCount; i += 1) {
        const comet = new THREE.Mesh(
            new THREE.SphereGeometry(0.025, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.85 })
        );
        comet.visible = false;
        scene.add(comet);
        comets.push({
            mesh: comet,
            t: Math.random(),
            speed: 0.16 + Math.random() * 0.15,
            radius: 2.2 + Math.random() * 3.1,
            y: (Math.random() - 0.5) * 3.4,
            phase: Math.random() * Math.PI * 2,
            delay: Math.random() * 2.5,
        });
    }

    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let autopilot = true;
    let hoverPauseUntil = 0;
    const clock = new THREE.Clock();
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startRotX = 0;
    let startRotY = 0;
    let startRotZ = 0;
    let dragRotX = 0;
    let dragRotY = 0;

    function onPointerMove(event) {
        const rect = canvas.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        targetPointerX = (nx - 0.5) * 2;
        targetPointerY = (ny - 0.5) * 2;
        autopilot = false;
        hoverPauseUntil = performance.now() + 3500;
    }

    function onPointerLeave() {
        targetPointerX = 0;
        targetPointerY = 0;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    canvas.addEventListener("pointerdown", (e) => {
        isDragging = true;
        autopilot = false;
        hoverPauseUntil = Infinity;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startRotX = activeModel.rotation.x;
        startRotY = activeModel.rotation.y;
        startRotZ = activeModel.rotation.z;
        dragRotX = 0;
        dragRotY = 0;
    });

    window.addEventListener("pointerup", () => {
        isDragging = false;
        hoverPauseUntil = performance.now() + 1200;
    });

    window.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        // Drag sensitivity: tweak to taste
        dragRotY = startRotY + dx * 0.01;
        dragRotX = startRotX + dy * 0.008;
        activeModel.rotation.x = dragRotX;
        activeModel.rotation.y = dragRotY;
        activeModel.rotation.z = startRotZ;
    });

    function resize() {
        const width = canvas.clientWidth || 420;
        const height = canvas.clientHeight || 360;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function animate() {
        const elapsed = clock.getElapsedTime();
        const delta = Math.min(clock.getDelta(), 0.033);

        if (!autopilot && performance.now() > hoverPauseUntil) {
            autopilot = true;
        }

        if (autopilot) {
            targetPointerX = Math.sin(elapsed * 0.4) * 0.35;
            targetPointerY = Math.cos(elapsed * 0.3) * 0.22;
        }

        pointerX += (targetPointerX - pointerX) * Math.min(delta * 6, 1);
        pointerY += (targetPointerY - pointerY) * Math.min(delta * 6, 1);

        const bob = Math.sin(elapsed * 1.1) * 0.08;
        const orbitX = Math.sin(elapsed * 0.45) * 0.34 + pointerX * 0.24;
        const orbitY = Math.cos(elapsed * 0.6) * 0.18 - 0.25 - pointerY * 0.18;
        if (!isDragging) {
            activeModel.position.x += (orbitX - activeModel.position.x) * Math.min(delta * 3.2, 1);
            activeModel.position.y += (orbitY + bob - activeModel.position.y) * Math.min(delta * 3.2, 1);

            activeModel.rotation.x += 0.002 + pointerY * 0.0012;
            activeModel.rotation.y += 0.005 + pointerX * 0.002;
            activeModel.rotation.z = Math.sin(elapsed * 0.7) * 0.06;
        }

        camera.position.x += ((pointerX * 0.22) - camera.position.x) * Math.min(delta * 2.5, 1);
        camera.position.y += ((-pointerY * 0.16) - camera.position.y) * Math.min(delta * 2.5, 1);
        camera.lookAt(0, -0.1, 0);

        stars.rotation.y += 0.0008;
        stars.rotation.x = Math.sin(elapsed * 0.18) * 0.06;

        point.intensity = 1.9 + Math.sin(elapsed * 1.7) * 0.45;
        accent.intensity = 0.9 + Math.cos(elapsed * 1.4) * 0.35;

        for (const cometState of comets) {
            cometState.delay -= delta;
            if (cometState.delay > 0) {
                cometState.mesh.visible = false;
                continue;
            }

            cometState.mesh.visible = true;
            cometState.t += delta * cometState.speed;
            if (cometState.t > 1) {
                cometState.t = 0;
                cometState.y = (Math.random() - 0.5) * 3.4;
                cometState.phase = Math.random() * Math.PI * 2;
                cometState.radius = 2.2 + Math.random() * 3.1;
                cometState.delay = 0.25 + Math.random() * 2;
                cometState.speed = 0.16 + Math.random() * 0.15;
            }

            const track = cometState.t * Math.PI * 2 + cometState.phase;
            cometState.mesh.position.x = Math.cos(track) * cometState.radius;
            cometState.mesh.position.y = cometState.y + Math.sin(track * 0.6) * 0.4;
            cometState.mesh.position.z = Math.sin(track) * cometState.radius * 0.35 - 2.5;
            cometState.mesh.material.opacity = 0.25 + Math.sin(cometState.t * Math.PI) * 0.7;
        }

        if (!modelLoaded) {
            fallbackMesh.rotation.z += 0.0014;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    if (fallback) {
        fallback.style.display = "none";
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
}
