import { Ref, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export default function PokeCam({ ref, ...props }: { ref?: Ref<Webcam> }) {
  const [activeDeviceId, setActiveDeviceId] =
    useState<MediaDeviceInfo["deviceId"]>();

  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = mediaDevices.filter(
          (device) => device.kind === "videoinput"
        );
        const found = videoInputs.find((dev) => dev.label.includes("Cam Link"));
        if (found) {
          setActiveDeviceId(found.deviceId);
        }
      } catch (error) {
        console.error("Error getting devices:", error);
      }
    };

    getDevices();
  }, []);

  return (
    <>
      <Webcam
        videoConstraints={{
          deviceId: activeDeviceId,
        }}
        audio={false}
        screenshotFormat="image/png"
        ref={ref}
        width={1280}
        height={720}
        {...props}
      />
    </>
  );
}
