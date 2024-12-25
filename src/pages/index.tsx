import {InferGetServerSidePropsType} from "next";
import {useEffect, useState} from "react";
import {motion} from 'framer-motion';
import Image from "next/image";

export type Article = {
    title: string;
    content: string;
    banner: string;
    id: number;
}

export default function Home({html}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [articles, setArticles] = useState<Article[]>([])

    useEffect(() => {

        const domParser = new DOMParser()

        const doc = domParser.parseFromString(html, "text/html")

        const articles = doc.querySelectorAll('.article-news')

        if (!articles) return

        const result:Article[] = []

        for (const article of articles) {
            if (!article) continue

            const title = article?.querySelector('.article-news__title a')?.getAttribute('title')
            const banner = (article?.querySelector('.article-news__img') as HTMLImageElement).getAttribute('data-src')
            const id = Number.parseInt(article?.id) || Math.random()
            //@ts-ignore
            const content = article?.querySelector('.article-news__subtitle a').innerHTML as string

            if (!title || !banner || !content) continue
            result.push({
                title,
                banner,
                content,
                id
            })
        }

        setArticles(result)
    }, [html]);

    return (
        <main className='max-w-cnt mx-auto px-4'>
            <div className='py-4 flex justify-between items-center'>
                <div className='size-14 rounded-full relative overflow-hidden'>
                    <Image src={'/logo.png'} alt='logo' fill objectFit='cover'/>
                </div>

                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22"
                         height="22" className="hover:opacity-70 transition-all duration-300 cursor-pointer"
                         fill="currentColor" stroke="none" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M10 4.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m1.5 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-9 8c0-.204.22-.809 1.32-1.459C4.838 10.44 6.32 10 8 10s3.162.44 4.18 1.041c1.1.65 1.32 1.255 1.32 1.459a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1m5.5-4c-3.85 0-7 2-7 4A2.5 2.5 0 0 0 3.5 15h9a2.5 2.5 0 0 0 2.5-2.5c0-2-3.15-4-7-4"
                                  clipRule="evenodd"></path>
                        </svg>
                    </svg>
                </div>
            </div>

            <div className='flex flex-col gap-6 mb-8'>
                {articles.map((article) => (
                    <motion.article
                        viewport={{once: true}}
                        initial={{
                            opacity: 0,
                            translateY: '30%',
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {duration: 0.35},
                            translateY: 0,
                        }}
                        className='rounded-2xl overflow-hidden shadow-2xl bg-[#27272a]' key={article.id}>
                        <Image
                            blurDataURL={'/logo.png'}
                            width={640}
                            height={300}
                            src={article.banner}
                            alt={article.title}
                        />

                        <div className="p-4 flex flex-col gap-2">
                            <span className='font-bold'> {article.title}</span>
                            <p className='text-sm' dangerouslySetInnerHTML={{__html: article.content}}/>

                            <div className='flex items-center gap-2 justify-between border-t border-white/50 pt-4'>
                                <span
                                    className='font-medium text-sm'> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>

                               <div className="inline-flex gap-1.5 items-center hover:text-primary cursor-pointer">
                                   <svg viewBox="0 0 16 16" className="transition-all" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        fill="currentColor"
                                        stroke="none" aria-hidden="true">
                                       <path fill="currentColor" fillRule="evenodd"
                                             d="m8 9.524.976.837 2.988 2.56a.325.325 0 0 0 .536-.246V4.5A1.5 1.5 0 0 0 11 3H5a1.5 1.5 0 0 0-1.5 1.5v8.175a.325.325 0 0 0 .536.247l2.988-2.56zM14 4.5a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8.175a1.825 1.825 0 0 0 3.013 1.386L8 11.5l2.987 2.56A1.825 1.825 0 0 0 14 12.676z"
                                             clipRule="evenodd"></path>
                                   </svg>

                                   <span className='font-semibold text-xs transition-all'>
                                       В закладки
                                   </span>
                               </div>
                            </div>
                        </div>


                    </motion.article>
                ))}
            </div>
        </main>
    );
}

export async function getServerSideProps() {

    const res = await fetch('https://m.business-gazeta.ru');

    const html = await res.text();

    return {
        props: {
            html
        }
    }
}
