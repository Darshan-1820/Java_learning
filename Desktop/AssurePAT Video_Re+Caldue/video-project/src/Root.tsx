import { Composition } from "remotion";
import { AssurePATWalkthrough } from "./Composition";
import { VIDEO_CONFIG } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AssurePATWalkthrough"
        component={AssurePATWalkthrough}
        durationInFrames={VIDEO_CONFIG.totalDurationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
