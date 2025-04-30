import { studiorouter } from '@/modules/studio/server/procedure';
import {  createTRPCRouter} from '../init';
import { categoriesRouter } from '@/modules/categories/server';
import { videosRouter } from '@/modules/videos/server/procedure';
export const appRouter = createTRPCRouter({
  categories : categoriesRouter,
  studio :studiorouter,
  videos : videosRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;