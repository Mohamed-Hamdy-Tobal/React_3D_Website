import { ScrollTrigger } from 'gsap/all';
import React, { useRef, useCallback, useEffect } from 'react';
import {
    ViewerApp,
    AssetManagerPlugin,
    TonemapPlugin,
    BloomPlugin,
    SSAOPlugin,
    SSRPlugin,
    GammaCorrectionPlugin,
    ProgressivePlugin,
    GBufferPlugin
} from "webgi";
import { scrollAnimation } from '../lib/scroll-animation';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger)

const WebjiViewer = () => {

    const canvasRef = useRef();

    const memoizedScrollAnimation = useCallback(
        (position, target, onUpdate) => {
            if (position && target && onUpdate) {
                scrollAnimation(position, target, onUpdate)
            }
        }, []
    )

    const setupViewer = useCallback(async () => {

        // Initialize the viewer
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        });

        // Add the AssetManagerPlugin for handling GLB files
        const assetManager = await viewer.addPlugin(AssetManagerPlugin);

        const camera = viewer.scene.activeCamera
        const position = camera.position
        const target = camera.target

        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new ProgressivePlugin(32))
        await viewer.addPlugin(new TonemapPlugin(true))
        await viewer.addPlugin(GammaCorrectionPlugin)
        await viewer.addPlugin(SSRPlugin)
        await viewer.addPlugin(SSAOPlugin)
        await viewer.addPlugin(BloomPlugin)

        viewer.renderer.refreshPipeline();

        await assetManager.addFromPath("scene-black.glb").catch(err => console.error("Error loading GLB:", err));

        viewer.getPlugin(TonemapPlugin).config.clipBackground = true

        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

        window.scrollTo(0,0)

        let needUpdate = true

        const onUpdate = () => {
            needUpdate = true
            viewer.setDirty()
        }

        viewer.addEventListener("preFrame", () => {
            if (needUpdate) {
                camera.positionTargetUpdated(true)
                needUpdate = false
            }
        })

        memoizedScrollAnimation(position, target, onUpdate)

    }, []);

    useEffect(() => {
        setupViewer().catch((err) => console.error("Error setting up viewer:", err));
    }, []);

    return (
        <div id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef} />
        </div>
    );
}

export default WebjiViewer;
