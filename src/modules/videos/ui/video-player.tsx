interface VideoPlayerProps {
    playbackId: string;
    thumbnailUrl?: string | null;
    autoPlay ?: boolean;
    onPlay ?: () => void;
}
import MuxPlayer  from "@mux/mux-player-react";
export const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay = false, onPlay }: VideoPlayerProps) => {
    if(!playbackId) return null;
    return(
        <MuxPlayer
            playbackId={playbackId}
            poster={thumbnailUrl ||  "/placeholder.svg"}
            playerInitTime={0}
            autoPlay={autoPlay}
            thumbnailTime={0}
            className="h-full w-full object-contain"
            accentColor="#FF2056"
            onPlay={onPlay}
        />

    )

}