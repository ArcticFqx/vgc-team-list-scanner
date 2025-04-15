import { Ref, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export default function usePokeCam({ ref, ...props }: { ref?: Ref<Webcam> }) {
  const [activeDeviceId, setActiveDeviceId] =
    useState<MediaDeviceInfo["deviceId"]>();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = mediaDevices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoInputs);

        // Lets try for two devices by default first
        // I'm just going to pick the stuff I have,
        // but most likely the OBS virtual camera will be available
        const found = videoInputs.find((dev) => dev.label.includes("Cam Link"));
        if (found) {
          setActiveDeviceId(found.deviceId);
        } else {
          const found2 = videoInputs.find((dev) => dev.label.includes("OBS"));
          if (found2) setActiveDeviceId(found2.deviceId);
        }
      } catch (error) {
        console.error("Error getting devices:", error);
      }
    };

    getDevices();
  }, []);

  return [
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
    </>,
    devices,
    setActiveDeviceId,
  ] as const;
}
