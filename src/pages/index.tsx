import {InferGetServerSidePropsType} from "next";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from 'framer-motion';
import Image from "next/image";
import {Head} from "next/document";
import Script from "next/script";

export type Article = {
    title: string;
    content: string;
    banner: string;
    id: number;
}

type ApiProps = {
    page?: number;
}
let tm: NodeJS.Timeout
const api = async ({page}: ApiProps) => {
    let url = `https://m.business-gazeta.ru/category/472`
    if (page) {
        url += `/${page}`
    }

    const res = await fetch(url)

    return await res.text()
}

export default function Home({html}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [articles, setArticles] = useState<Article[]>([])

    const [page, setPage] = useState(1)
    const [visible, setVisible] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    async function nextPage() {
        const newPage = page + 1
        if (newPage > 5) {
            return
        }

        setPage(newPage)
        setIsLoading(true)

        const html = await api({page: newPage})


        tm = setTimeout(() => {
            buildArticles(html)

            setIsLoading(false)
        }, 1500)
    }


    function buildArticles(html: string) {
        const domParser = new DOMParser()

        const doc = domParser.parseFromString(html, "text/html")

        const articles = doc.querySelectorAll('.article-news')

        if (!articles) return

        const result: Article[] = []

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

        if (articles.length) {
            setArticles(p => [...p, ...result])
        } else {
            setArticles(result)
        }
    }


    useEffect(() => {
        buildArticles(html)

        return () => {
            clearTimeout(tm)
        }
    }, [html]);

    return (
        <main className='max-w-cnt mx-auto px-4'>

            <div
                className={`fixed z-50 transition-all bg-background inset-y-0 right-0 w-[90dvw] ${visible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className='p-4 font-medium text-lg flex items-center justify-between'>
                    А тут ни ху я

                    <button
                        onClick={() => setVisible(false)}
                        className='active:scale-95 justify-center flex items-center gap-2 hover:opacity-90 bg-[#27272a] text-white rounded-xl shadow transition-all size-8'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg"  width="20"
                             height="20" className="g-icon" fill="currentColor" stroke="none" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                                <path fill="currentColor" fill-rule="evenodd"
                                      d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </svg>
                    </button>
                </div>
            </div>

            <div className='py-4 flex justify-between items-center'>
                <div className='size-14 rounded-full relative overflow-hidden'>
                    <Image src={'/logo.png'} alt='logo' fill objectFit='cover'/>
                </div>

                <button onClick={() => setVisible(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22"
                         height="22" className="hover:opacity-70 transition-all duration-300 cursor-pointer"
                         fill="currentColor" stroke="none" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                            <path fill="currentColor" fill-rule="evenodd"
                                  d="M1.25 3.25A.75.75 0 0 1 2 2.5h12A.75.75 0 0 1 14 4H2a.75.75 0 0 1-.75-.75m0 4.75A.75.75 0 0 1 2 7.25h12a.75.75 0 0 1 0 1.5H2A.75.75 0 0 1 1.25 8M2 12a.75.75 0 0 0 0 1.5h12a.75.75 0 0 0 0-1.5z"
                                  clip-rule="evenodd"></path>
                        </svg>
                    </svg>
                </button>
            </div>

            <div className='flex flex-col gap-6 mb-16'>
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
                        className='rounded-2xl overflow-hidden shadow-2xl bg-[#27272a]'
                        key={article.id}
                    >
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
                                    <svg viewBox="0 0 16 16" className="transition-all"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24"
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

            {page < 5 && (
                <div className='fixed bottom-3.5 inset-x-0 flex justify-center'>
                    <button
                        onClick={nextPage}
                        className='active:scale-95 justify-center flex items-center gap-2 hover:opacity-90 bg-[#27272a] text-white font-semibold text-sm px-4 py-2 rounded-xl shadow transition-all max-w-float-button max-md:max-w-[85vw] h-11 w-full'
                    >
                        {isLoading ? (
                            <>
                                Загрузка... <svg className='animate-spin' xmlns="http://www.w3.org/2000/svg" width="20"
                                                 height="20"
                                                 fill="currentColor" stroke="none" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                                    <path fill="currentColor" fill-rule="evenodd"
                                          d="M8 1.5a6.5 6.5 0 0 1 6.445 5.649.75.75 0 1 1-1.488.194A5.001 5.001 0 0 0 4.43 4.5h1.32a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 2 5.25v-3a.75.75 0 1 1 1.5 0v1.06A6.48 6.48 0 0 1 8 1.5m5.25 13a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-.75-.75h-3a.75.75 0 1 0 0 1.5h1.32a5.001 5.001 0 0 1-8.528-2.843.75.75 0 1 0-1.487.194 6.501 6.501 0 0 0 10.945 3.84v1.059c0 .414.336.75.75.75"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </svg>
                            </>

                        ) : 'Показать еще'}
                    </button>
                </div>
            )}
        </main>
    );
}

export async function getServerSideProps() {
    const html = await api({page: undefined})

    return {
        props: {
            html
        }
    }
}
