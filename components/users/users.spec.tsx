import { renderWithClient, render, createWrapper } from "test-utils"
import { renderHook, waitFor } from '@testing-library/react'
import { server } from "mocks-server"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { rest } from "msw"
import { setupServer } from "msw/node"
import Users from "./users"
import { useUsersData } from "./usersApi"


// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())


describe("Users", () => {
    it('successful query hook', async () => {
        server.use(rest.get(
            '*/users',
            (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        [
                            {
                                name: 'John Doe',
                                id: 1
                            }
                        ]
                    )
                    )
                }
            ))

        const { result } = renderHook(() => useUsersData(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.[0].name).toBe('John Doe')
    })

    it('failure query hook', async () => {
        server.use(
            rest.get('*', (req, res, ctx) => {
                return res(ctx.status(500))
            })
        )

        const { result } = renderHook(() => useUsersData(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error).toBeDefined()
    })

    it('Should show users if they are fetched successfully', async () => {
        server.use(rest.get(
            '*/users',
            (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        [
                            {
                                name: 'John Doe',
                                id: 1
                            }
                        ]
                    )
                    )
                }
            ))
            
        const result = renderWithClient(<Users/>)
        
        expect(await result.findByText(/John Doe/i)).toBeInTheDocument();
    })
    it('Should show users if they are fetched successfully', async () => {
        server.use(rest.get(
            '*/users',
            (req, res, ctx) => {
                return res(
                        ctx.status(500)
                    )
                }
            ))
        const result = renderWithClient(<Users/>)
        
        expect(await result.findByText(/Error/i)).toBeInTheDocument();
    })
})