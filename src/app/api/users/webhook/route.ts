import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { users } from '@/db/schema' // Import your users schema
import { eq } from 'drizzle-orm' // For query conditions
import { db } from '@/db/index'

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    })
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)

  // Handle user.created event
  if (eventType === 'user.created') {
    const { id, first_name, last_name, image_url } = evt.data;
    
    console.log(id, first_name, last_name, image_url)
    
    try {
      // Insert the new user into the database
      await db.insert(users).values({
        clerkId : id,
        name :  `${first_name || ''} ${last_name || ''}`.trim(),
        imageUrl : image_url,
      });
      
      console.log(`User created in database: ${id}`);
    } catch (error) {
      console.error('Error creating user in database:', error);
      return new Response('Error saving user to database', { status: 500 });
    }
  }

  // Handle user.updated event
  if (eventType === 'user.updated') {
    const { id,  first_name, last_name, image_url } = evt.data;
    

    try {
      await db
        .update(users)
        .set({
            name: `${first_name} ${last_name}`,
            image_url: image_url,
        })
        .where(eq(users.clerkId, id));  // Use clerkId to match with Clerk's id
      
      console.log(`User updated in database: ${id}`);
    } catch (error) {
      console.error('Error updating user in database:', error);
      return new Response('Error updating user in database', { status: 500 });
    }
  }

  return new Response('', { status: 200 })
}