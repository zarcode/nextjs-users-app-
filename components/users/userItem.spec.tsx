import { screen, waitForElementToBeRemoved } from "test-setup"
import { setup, users } from "@/test/utils"
import UserItem from "./userItem"
import { rest } from "msw"
import { setupServer } from 'msw/node'

let id: string | readonly string[] = "";
const server = setupServer(
    rest.delete(
        '*/user/:id',
        (req, res, ctx) => {
            id = req.params.id;
            return res(
                ctx.delay(900),
                ctx.status(200),
                ctx.json({})
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

describe("User item", () => {
    window.confirm = () => true;

    let userEvent: any;
    beforeEach(() => {
        const { user: setupUser } = setup(<UserItem user={users[0]} />)
        userEvent = setupUser;
    });

    it('user is removed on successfull deletion', async () => {
        expect(await screen.findByText(users[0].name)).toBeInTheDocument();
        
        await clickDeleteButton(userEvent)

        
        const spinner = screen.getByRole('spinner');
        expect(spinner).toBeInTheDocument();
        await waitForElementToBeRemoved(spinner);

        expect(id).toBe(users[0].id.toString())

    })

    it('shows error if request fails', async () => {
        server.use(rest.delete(
            '*/user/:id',
            (req, res, ctx) => {
                return res(
                    ctx.delay(900),
                    ctx.status(500),
                )
            }
        ))
        await clickDeleteButton(userEvent)
        
        const spinner = screen.getByRole('spinner');
        expect(spinner).toBeInTheDocument();
        await waitForElementToBeRemoved(spinner);

        expect(await screen.findByText((/Error:/i))).toBeInTheDocument();

    })
})


async function clickDeleteButton(userEvent) {
    return (await userEvent.click(
        screen.getByRole('button', {
            name: /delete/i
        })
    ));
}