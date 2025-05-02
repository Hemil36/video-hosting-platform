import { FormSection } from "../section/form-section"

interface VideoViewProps {
    videoId : string
}


export const VideoView = ({videoId}:VideoViewProps) => {
    return (
        <div>
           
            <FormSection videoId={videoId} />
            </div>

    )
}