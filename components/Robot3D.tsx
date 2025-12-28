import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Robot3DProps {
  size?: number;
}

const Robot3D: React.FC<Robot3DProps> = ({ size = 80 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Robot group
    const robot = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.8,
      roughness: 0.2
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff3300,
      emissiveIntensity: 0.6
    });

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.4
    });

    // Body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1, 0.6),
      bodyMat
    );
    robot.add(body);

    // Screen
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.4),
      accentMat
    );
    screen.position.set(0, 0.1, 0.31);
    robot.add(screen);

    // Eyes
    const leftEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      whiteMat
    );
    leftEye.position.set(-0.12, 0.15, 0.32);
    robot.add(leftEye);

    const rightEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      whiteMat
    );
    rightEye.position.set(0.12, 0.15, 0.32);
    robot.add(rightEye);

    // Antenna
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8),
      whiteMat
    );
    antenna.position.set(0, 0.65, 0);
    robot.add(antenna);

    const antennaBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      accentMat
    );
    antennaBall.position.set(0, 0.8, 0);
    robot.add(antennaBall);

    // Propeller
    const propeller = new THREE.Group();
    const blade1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.04, 0.08),
      accentMat
    );
    propeller.add(blade1);
    
    const blade2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.04, 0.08),
      accentMat
    );
    blade2.rotation.y = Math.PI / 2;
    propeller.add(blade2);
    
    propeller.position.set(0, 0.55, 0);
    robot.add(propeller);

    // Arms
    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8),
      whiteMat
    );
    leftArm.position.set(-0.5, 0, 0);
    leftArm.rotation.z = Math.PI / 4;
    robot.add(leftArm);

    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8),
      whiteMat
    );
    rightArm.position.set(0.5, 0, 0);
    rightArm.rotation.z = -Math.PI / 6; // Less angle for waving
    robot.add(rightArm);

    // Hands
    const leftHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      accentMat
    );
    leftHand.position.set(-0.65, -0.25, 0);
    robot.add(leftHand);

    const rightHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      accentMat
    );
    rightHand.position.set(0.65, -0.15, 0);
    robot.add(rightHand);

    // Thrusters - better design
    const thrusterGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8);
    const leftThruster = new THREE.Mesh(thrusterGeometry, whiteMat);
    leftThruster.position.set(-0.2, -0.65, 0);
    robot.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeometry, whiteMat);
    rightThruster.position.set(0.2, -0.65, 0);
    robot.add(rightThruster);

    // Thruster nozzles
    const nozzleGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.1, 8);
    const leftNozzle = new THREE.Mesh(nozzleGeometry, accentMat);
    leftNozzle.position.set(-0.2, -0.8, 0);
    robot.add(leftNozzle);

    const rightNozzle = new THREE.Mesh(nozzleGeometry, accentMat);
    rightNozzle.position.set(0.2, -0.8, 0);
    robot.add(rightNozzle);

    // Flames - more realistic
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff6600,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.8
    });

    const leftFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.35, 8),
      flameMat
    );
    leftFlame.position.set(-0.2, -0.95, 0);
    leftFlame.rotation.x = Math.PI;
    robot.add(leftFlame);

    const rightFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.35, 8),
      flameMat
    );
    rightFlame.position.set(0.2, -0.95, 0);
    rightFlame.rotation.x = Math.PI;
    robot.add(rightFlame);

    scene.add(robot);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff3300, 1, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate propeller only
      propeller.rotation.y += 0.3;

      // Wave right hand
      const waveAngle = Math.sin(Date.now() * 0.003) * 0.3;
      rightArm.rotation.z = -Math.PI / 6 + waveAngle;
      rightHand.position.y = -0.15 + Math.sin(Date.now() * 0.003) * 0.1;

      // Flicker flames
      leftFlame.scale.y = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
      rightFlame.scale.y = 0.8 + Math.cos(Date.now() * 0.01) * 0.2;
      
      // Flame opacity flicker
      leftFlame.material.opacity = 0.7 + Math.sin(Date.now() * 0.015) * 0.2;
      rightFlame.material.opacity = 0.7 + Math.cos(Date.now() * 0.015) * 0.2;

      // Pulse antenna ball
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      antennaBall.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.clear();
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        filter: 'drop-shadow(0px 4px 20px rgba(255,51,0,0.4))'
      }}
    />
  );
};

export default Robot3D;
