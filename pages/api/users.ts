// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { users } from "./dummyusers"

const totalPages = 2

const getPage = (page: number, size: number) => {
    let start = (page - 1) * size;
    let end = start + size;
  
    return users.slice(start, end)
};

export default function usersHandler(req: any, res: any) {

    const {
        method,
    } = req

    switch (method) {
        case 'GET': {
            let page = 1;
            const pageParam = req.query.page;
            if(pageParam) {
                page = Number.parseInt(pageParam);
            }

            let perPage = 5;

                res.setHeader('x-pagination-page', page.toString())
                .setHeader('x-pagination-pages', totalPages.toString())
                
                res.status(200)
                .json(getPage(page, perPage))
            break
        }
        case 'POST': {
            res.status(200).json({ name: `User` })
            break
        }
    }
}
