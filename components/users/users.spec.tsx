import { renderWithClient, render, createWrapper, screen } from "test-setup"
import { setupServer } from 'msw/node'
import { renderHook, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest, RestContext } from "msw"
import Users, {FIRST_PAGE} from "./usersList"
import { useUsersData } from "./usersApi"
import React from "react"

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

const server = setupServer(
    rest.get(
        '*/users',
        (req, res, ctx) => {
            let page = FIRST_PAGE;
            const pageParam = req.url.searchParams.get('page')
            if(pageParam) {
                page = Number.parseInt(pageParam);
            }

            let perPage = 5;

            return res(
                    ctx.set('x-pagination-page', page.toString()),
                    ctx.set('x-pagination-pages', totalPages.toString()),
                    ctx.status(200),
                    ctx.json(getPage(page, perPage))
                )
            }
        )
  );

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

const setup = (jsx: React.ReactElement) => {
    return {
      user: userEvent.setup(),
      ...renderWithClient(jsx),
    }
  } 

describe("Users", () => {
    describe("successfull requests", () => {
        it('successful query hook', async () => {

            const { result } = renderHook(() => useUsersData(FIRST_PAGE), {
                wrapper: createWrapper()
            })

            await waitFor(() => expect(result.current.isSuccess).toBe(true))

            expect(result.current.data.users[0].name).toBe('Charuchandra Devar')
        })

        it('failure query hook', async () => {
            server.use(
                rest.get('*', (req, res, ctx) => {
                    return res(ctx.status(500))
                })
            )

            const { result } = renderHook(() => useUsersData(FIRST_PAGE), {
                wrapper: createWrapper()
            })

            await waitFor(() => expect(result.current.isError).toBe(true))

            expect(result.current.error).toBeDefined()
        })

        it('users should be prefetched on server', async () => {
            setup(<Users/>)
            expect(await screen.findByText('Loading...')).not.toBeInTheDocument();
        })
        it('shows users if they are fetched successfully', async () => {
            setup(<Users/>)
            expect(await screen.findByText('Sarada Kakkar')).toBeInTheDocument();
            expect(await screen.findByText('kakkar_sarada@gerlach.net')).toBeInTheDocument();
            const genderList = await screen.findAllByText('male');
            expect(genderList.length).toBeGreaterThan(0)
        })
        it('displays next page link', async () => {
            setup(<Users/>);
            await screen.findByText('Sarada Kakkar');
            expect(screen.queryByText('Next page')).toBeInTheDocument();
        })
        it('displays next page after clicking next', async () => {
            const { user } = setup(<Users/>);
            await screen.findByText('Sarada Kakkar');
            expect(await screen.findByText(`Current page: ${FIRST_PAGE}`)).toBeInTheDocument();
            await user.click(screen.queryByText('Next page'));
            expect(await screen.findByText(`Current page: ${FIRST_PAGE + 1}`)).toBeInTheDocument();
            const userFromPage2 = await screen.findByText('Akroor Kakkar');
            expect(userFromPage2).toBeInTheDocument(); 
        })
        it('the next page button is disabled at last page', async () => {
            const { user } = setup(<Users/>);
            await user.click(screen.queryByText('Next page'))
            expect(screen.queryByText('Next page')).toBeDisabled();
        })
        it('the previous page button is disabled at first page', async () => {
            const { user } = setup(<Users/>);
            expect(screen.queryByText('Previous page')).toBeDisabled();
        })
        it('displays the previous page on clicking previous', async () => {
            const { user } = setup(<Users/>);
            await screen.findByText('Sarada Kakkar');
            expect(await screen.findByText(`Current page: ${FIRST_PAGE}`)).toBeInTheDocument();
            await user.click(screen.queryByText('Next page'));
            expect(await screen.findByText(`Current page: ${FIRST_PAGE + 1}`)).toBeInTheDocument();
            const userFromPage2 = await screen.findByText('Akroor Kakkar');
            expect(userFromPage2).toBeInTheDocument(); 
            await user.click(screen.queryByText('Previous page'));
            expect(await screen.findByText(`Current page: ${FIRST_PAGE}`)).toBeInTheDocument();
            const userFromPage1 = await screen.findByText('Sarada Kakkar');
            expect(userFromPage1).toBeInTheDocument();
        })
    })

    describe("failed requests and wrong response", () => {
        it('shows error if they are failed to fetch', async () => {
            setup(<Users/>)

            server.use(rest.get(
                '*/users',
                (req, res, ctx: RestContext) => {
                    return res(
                        ctx.status(500)
                    )
                }
            ))
            
            expect(await screen.findByText((/Error/i))).toBeInTheDocument();
        })
        it('next link is disabled if pagination headers are missing', async () => {
            setup(<Users/>)

            server.use(rest.get(
                '*/users',
                (req, res, ctx) => {
                    let page = FIRST_PAGE;
                    const pageParam = req.url.searchParams.get('page')
                    if(pageParam) {
                        page = Number.parseInt(pageParam);
                    }
        
                    let perPage = 5;
        
                    return res(
                            ctx.status(200),
                            ctx.json(getPage(page, perPage))
                        )
                    }
                )
            )
           
            await screen.findByText('Sarada Kakkar');
            expect(screen.queryByText('Next page')).toBeDisabled();
  
        })
    })
})