import { UserEvent } from "@testing-library/user-event"
import { renderWithClient, createWrapper, screen } from "test-setup"
import { setup, users, getPage, totalPages } from "@/test/utils"
import { setupServer } from 'msw/node'
import { renderHook, waitFor } from '@testing-library/react'
import { rest, RestContext } from "msw"
import Users, {FIRST_PAGE} from "./usersList"
import { useUsersData } from "./usersApi"
import React from "react"

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
                    ctx.json(getPage(users, page, perPage))
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

describe("Users list", () => {
    describe("tests users fetch hook", () => {
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
    })
    describe("successfull requests", () => {
        let user: any;
        beforeEach(() => {
            const { user: setupUser} = setup(<Users/>)
            user = setupUser;
        });

        it('shows users if they are fetched successfully', async () => {
            expect(await screen.findByText('Sarada Kakkar')).toBeInTheDocument();
            expect(await screen.findByText('kakkar_sarada@gerlach.net')).toBeInTheDocument();
            const genderList = await screen.findAllByText('male');
            expect(genderList.length).toBeGreaterThan(0)
        })
        it('displays next page link', async () => {
            await screen.findByText('Sarada Kakkar');
            expect(screen.queryByText('Next page')).toBeInTheDocument();
        })
        it('displays next page after clicking next', async () => {
            await screen.findByText('Sarada Kakkar');
            expect(await screen.findByText(`Current page: ${FIRST_PAGE}`)).toBeInTheDocument();
            await user.click(screen.queryByText('Next page'));
            expect(await screen.findByText(`Current page: ${FIRST_PAGE + 1}`)).toBeInTheDocument();
            const userFromPage2 = await screen.findByText('Akroor Kakkar');
            expect(userFromPage2).toBeInTheDocument(); 
        })
        it('the next page button is disabled at last page', async () => {
            await user.click(screen.queryByText('Next page'))
            expect(screen.queryByText('Next page')).toBeDisabled();
        })
        it('the previous page button is disabled at first page', async () => {
            expect(screen.queryByText('Previous page')).toBeDisabled();
        })
        it('displays the previous page on clicking previous', async () => {
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
                            ctx.json(getPage(users, page, perPage))
                        )
                    }
                )
            )
           
            await screen.findByText('Sarada Kakkar');
            expect(screen.queryByText('Next page')).toBeDisabled();
  
        })
    })
})