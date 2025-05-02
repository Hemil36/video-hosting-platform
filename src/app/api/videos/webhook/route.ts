const secret = process.env.MUX_WEBHOOK_SECRET;
import { db } from '@/db';
import { videos } from '@/db/schema';
import { mux } from '@/lib/mux';
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetDeletedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
    VideoAssetReadyWebhookEvent


} from  '@mux/mux-node/resources/webhooks';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetDeletedWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetTrackReadyWebhookEvent | VideoAssetReadyWebhookEvent;

export const POST = async (request : Request) => {

    if(!secret) {
        throw new Error('Missing MUX_WEBHOOK_SECRET environment variable');
    }

    const headersPayload = await headers();
    const signature = headersPayload.get('mux-signature') ;

    if(!signature) {
        return new Response('Missing MUX signature', { status: 401 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,
        {
           "mux-signature": signature,
        },
        secret
    );

    switch (payload.type as WebhookEvent['type']) {
        case 'video.asset.created':{
            const data = payload.data as VideoAssetCreatedWebhookEvent['data'];

            

            if(!data.upload_id) {
                console.log('No upload ID found in the event data');
                return new Response('No upload ID found', { status: 400 });
            }

            const uploadId = data.upload_id;
            await db.update(videos).set({
                muxStatus : data.status,
                muxAssetId : data.id,
            }).where(eq(videos.muxUploadId, uploadId));
            
            break;
        }
        case "video.asset.ready":{
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];
            const playback_id = data.playback_ids?.[0].id;
            
            console.log(data.upload_id)
            
            const uploadId = data.upload_id;
            if (!uploadId) {
                console.log('No upload ID found in the event data');
                return new Response('No upload ID found', { status: 400 });
            }
           
            if(!playback_id) {
                console.log('No playback ID found in the event data');
                return new Response('No playback ID found', { status: 400 });
            }
            
            const thumbnailUrl = `https://image.mux.com/${playback_id}/thumbnail.jpg`;
            const previewUrl = `https://image.mux.com/${playback_id}/animated.gif`;
            const duration = data.duration ? Math.round(data.duration) : 0;
            
            await db.update(videos).set({
                muxStatus : data.status,
                muxPlaybackId : playback_id,
                muxAssetId : data.id,
                thumbnailUrl,
                previewUrl,
                duration
            }).where(eq(videos.muxUploadId, uploadId));
            break;
        }
        case  'video.asset.errored': {
            const data = payload.data as VideoAssetErroredWebhookEvent['data'];
            const uploadId = data.upload_id;
            if (!uploadId) {
                console.log('No upload ID found in the event data');
                return new Response('No upload ID found', { status: 400 });
            }
            await db.update(videos).set({
                muxStatus : data.status,
            }).where(eq(videos.muxUploadId, uploadId));
            break;
        }
        case 'video.asset.deleted': {
            const data = payload.data as VideoAssetDeletedWebhookEvent['data'];
            const uploadId = data.upload_id;
            if (!uploadId) {
                console.log('No upload ID found in the event data');
                return new Response('No upload ID found', { status: 400 });
            }
            await db.delete(videos).where(eq(videos.muxUploadId, uploadId));
            break;
        }
        case "video.asset.track.ready": {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] &{
                asset_id : string
                // The asset ID is not part of the original type definition
                // but is included in the webhook payload
            };

            console.log("Track Ready")
            const assetId = data.asset_id;
            if (!assetId) {
                console.log('No upload ID found in the event data');
                return new Response('No upload ID found', { status: 400 });
            }
            await db.update(videos).set({
                muxTrackStatus : data.status,
                muxTrackId : data.id,
            }).where(eq(videos.muxAssetId, assetId));
            break;
        }
        default:
            console.log('Unknown event type:', payload.type);
    }
    return new Response('Webhook received', { status: 200 });

}
