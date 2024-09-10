import { ScrollTrigger } from 'gsap/all';
import React, { useRef, useCallback, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import {
    ViewerApp,
    AssetManagerPlugin,
    TonemapPlugin,
    BloomPlugin,
    SSAOPlugin,
    SSRPlugin,
    GammaCorrectionPlugin,
    ProgressivePlugin,
    GBufferPlugin,
} from "webgi";
import { scrollAnimation } from '../lib/scroll-animation';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger)

const WebjiViewer = forwardRef((props, ref) => {

    const canvasRef = useRef();
    const [viewerRef, setViewerRef] = useState(null)
    const [targetRef, setTargetRef] = useState(null)
    const [cameraRef, setCameraRef] = useState(null)
    const [positionRef, setPositionRef] = useState(null)
    const [previewMode, setPreviewMode] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    const canvasContainerRef = useRef(null)

    useImperativeHandle(ref, () => ({
        triggerPreview() {
            setPreviewMode(true)
            canvasContainerRef.current.style.pointerEvents = "all"

            props.contentRef.current.style.opacity = "0"
            props.contentRef.current.style.visibility = "hidden"

            gsap.to(positionRef, {
                x: 13.04,
                y: -2.01,
                z: 2.29,
                duration: 2,
                onUpdate: () => {
                    viewerRef.setDirty()
                    cameraRef.positionTargetUpdated(true)
                }
            });

            gsap.to(targetRef, { x: 0.11, y: 0.0, z: 0.0, duration: 2 })

            viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true })
        }
    }))

    const handleResize = useCallback(() => {
        const isMobileScreen = window.innerWidth < 992;
        setIsMobile(isMobileScreen);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    const memoizedScrollAnimation = useCallback(
        (position, target, isMobile, onUpdate) => {
            if (position && target && onUpdate) {
                scrollAnimation(position, target, isMobile, onUpdate)
            }
        }, []
    )

    const setupViewer = useCallback(async () => {

        // Initialize the viewer
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        });

        setViewerRef(viewer)
        const isMobileOrTablet = window.innerWidth < 992;
        console.log("isMobileOrTablet:", isMobileOrTablet);
        setIsMobile(isMobileOrTablet);

        // Add the AssetManagerPlugin for handling GLB files
        const assetManager = await viewer.addPlugin(AssetManagerPlugin);

        const camera = viewer.scene.activeCamera
        const position = camera.position
        const target = camera.target

        setCameraRef(camera)
        setPositionRef(position)
        setTargetRef(target)

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

        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })

        if (isMobileOrTablet) {
            position.set(-16.7, 1.17, 11.7)
            target.set(0, 1.37, 0)
            props.contentRef.current.className = 'mobile-or-tablet'
        }

        window.scrollTo(0, 0)

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

        memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate)

    }, []);

    useEffect(() => {
        setupViewer().catch((err) => console.error("Error setting up viewer:", err));
    }, []);

    const handleExit = useCallback(() => {
        canvasContainerRef.current.style.pointerEvents = "none"

        props.contentRef.current.style.opacity = "1"

        props.contentRef.current.style.visibility = "visible"

        viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false })

        setPreviewMode(false)

        gsap.to(positionRef, {
            x: !isMobile ? 1.56 : 9.36,
            y: !isMobile ? 5.0 : 10.95,
            z: !isMobile ? 0.01 : 0.09,
            scrollTrigger: {
                trigger: ".display-section",
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: false,
            },
            onUpdate: () => {
                viewerRef.setDirty()
                cameraRef.positionTargetUpdated(true)
            }
        })
        gsap.to(targetRef, {
            x: !isMobile ? -0.55 : -1.62,
            y: !isMobile ? 0.32 : 0.02,
            z: !isMobile ? 0.0 : 0.06,
            scrollTrigger: {
                trigger: ".display-section",
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: false,
            },
        })
    }, [canvasContainerRef, viewerRef, positionRef, cameraRef, targetRef])

    return (
        <div ref={canvasContainerRef} id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef} />
            {
                previewMode && <button className='button' onClick={handleExit}>Exit</button>
            }
        </div>
    );
})

export default WebjiViewer;
