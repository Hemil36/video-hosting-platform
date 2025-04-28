import { trpc } from "@/trpc/server";
const page = async () => {
  const data= await trpc.hello({text: 'world'})
  return (
    <div>page : {data.greeting}</div>
  )
}

export default page