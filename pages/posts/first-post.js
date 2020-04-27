import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../component/layout'

export default function FPost(){
    return(
        <Layout>
            <Head>
                <title>Post Detail</title>
            </Head>
            Here is the detailed page content!
        </Layout>
    )
}