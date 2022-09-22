// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


const users = [
  {
      "id": 3185,
      "name": "Charuchandra Devar",
      "email": "charuchandra_devar@macejkovic.com",
      "gender": "male",
      "status": "inactive"
  },
  {
      "id": 3184,
      "name": "Dhara Varma",
      "email": "varma_dhara@macejkovic-koss.info",
      "gender": "female",
      "status": "active"
  },
  {
      "id": 3183,
      "name": "Sarada Kakkar",
      "email": "kakkar_sarada@gerlach.net",
      "gender": "male",
      "status": "active"
  },
  {
      "id": 3182,
      "name": "Oormila Butt V",
      "email": "oormila_v_butt@purdy-braun.com",
      "gender": "female",
      "status": "inactive"
  },
  {
      "id": 3181,
      "name": "Gatik Desai Ret.",
      "email": "desai_gatik_ret@langworth.net",
      "gender": "male",
      "status": "active"
  },
  {
      "id": 3180,
      "name": "Dr. Deependra Bandopadhyay",
      "email": "bandopadhyay_dr_deependra@marquardt-koelpin.org",
      "gender": "male",
      "status": "active"
  },
  {
      "id": 3179,
      "name": "Akroor Kakkar",
      "email": "kakkar_akroor@rice-reichel.name",
      "gender": "male",
      "status": "inactive"
  },
  {
      "id": 3178,
      "name": "Kalyani Chaturvedi I",
      "email": "chaturvedi_kalyani_i@goyette-lockman.info",
      "gender": "female",
      "status": "active"
  },
  {
      "id": 3177,
      "name": "Chidaatma Nair",
      "email": "chidaatma_nair@douglas.io",
      "gender": "male",
      "status": "inactive"
  },
  {
      "id": 3176,
      "name": "Anilaabh Bhattathiri",
      "email": "bhattathiri_anilaabh@kihn-rowe.biz",
      "gender": "female",
      "status": "active"
  }
]

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
