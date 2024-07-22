import Head from "next/head";
import { useRouter } from "next/router";
function Home() {
  const router = useRouter()
  router.push('/lists')
  return <></>
  // return (
  //   <>
  //     <Head>
  //       <title>MediaList - HomePage</title>
  //     </Head>

  //     <main className="">

  //       <h1>HOME</h1>
  //     </main>
  //   </>
  // )
}

export default Home;

