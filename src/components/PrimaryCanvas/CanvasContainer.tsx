import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PrimaryCanvasHeader from "./PrimaryCanvasHeader";
import Modal from "../modal/Modal";
import {
  AnimationClassRef,
  AnimationInstance,
  CollisionDetectionObject,
} from "../../types/types";

const EMPTY_ANIMATION_OBJECT: CollisionDetectionObject = {
  keyFunction: () => {},
  dependencies: [],
  functionString: "",
};

function CanvasContainer({
  instance,
  isLoading = false,
}: {
  instance: AnimationClassRef | undefined;
  isLoading?: boolean;
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [animationObject, setAnimationObject] =
    useState<CollisionDetectionObject>(EMPTY_ANIMATION_OBJECT);
  const [instanceOfClass, setInstanceOfClass] = useState<AnimationInstance>();
  // Mirrors the instance's motion gate so the pause/play button re-renders.
  const [motionPlaying, setMotionPlaying] = useState(true);
  const location = useLocation();
  const lastAutoOpenedLocationKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!instance) {
      setInstanceOfClass(undefined);
      return;
    }
    let i = instance.initiate("primary-canvas--content--canvas-container");
    i?.init();
    setInstanceOfClass(i);
    setAnimationObject(i?.animationObject ?? EMPTY_ANIMATION_OBJECT);
    setMotionPlaying(!i?.motionPaused);
    return () => i?.stop();
  }, [instance]);

  useEffect(() => {
    const wantsCodeOpen = Boolean(
      (location.state as { openCode?: boolean } | null)?.openCode
    );
    if (!wantsCodeOpen || !animationObject.functionString) return;
    if (lastAutoOpenedLocationKeyRef.current === location.key) return;
    lastAutoOpenedLocationKeyRef.current = location.key;
    setShowModal(true);
  }, [animationObject.functionString, location.key, location.state]);

  function showEquationHandler() {
    setShowModal(true);
  }

  function toggleMotionHandler() {
    if (!instanceOfClass) return;
    if (instanceOfClass.motionPaused) {
      instanceOfClass.resumeMotion();
      setMotionPlaying(true);
    } else {
      instanceOfClass.pauseMotion();
      setMotionPlaying(false);
    }
  }

  return (
    <section id="primary-canvas">
      <PrimaryCanvasHeader
        instanceOfClass={instanceOfClass}
        showEquationHandler={showEquationHandler}
        motionPlaying={motionPlaying}
        toggleMotionHandler={toggleMotionHandler}
      />
      <div id="primary-canvas--content">
        <div id="primary-canvas--content--text"></div>
        {/* React must render this empty: the animation class owns its children
            (innerHTML = "" + appendChild). Any React child here collides with
            that imperative DOM and crashes on transition. */}
        <div id="primary-canvas--content--canvas-container"></div>
        {isLoading && <div className="primary-canvas-loading">Loading...</div>}
      </div>
      {showModal && (
        <Modal
          animationObject={animationObject}
          closeModal={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

export default CanvasContainer;
