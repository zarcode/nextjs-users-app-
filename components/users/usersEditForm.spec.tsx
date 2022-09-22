import { renderWithClient, createWrapper, screen } from "test-setup"
import { act } from 'react-dom/test-utils';
import { setup, fireEvent } from "@/test/utils"
import UserEditForm from "./userEditForm"
import { waitFor, within } from "../../test/setup"
import { rest } from "msw"
import { setupServer } from 'msw/node'

const server = setupServer(
    rest.post(
        '*/users',
        (req, res, ctx) => {
           
            return res(
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

describe("User form", () => {
    let user: any;
    beforeEach(() => {
        const { user: setupUser} = setup(<UserEditForm/>)
        user = setupUser;
    });

    it('success message is shown when all fields pass validation', async () => {
   
        const nameInput = getNameInput()
        await user.type(nameInput, 'Bruno')

        const emailInput = getEmailInput()
        await user.type(emailInput, 'testing@gmail.com')

        const genderSelect = getGenderSelect()
        await user.selectOptions(genderSelect, within(genderSelect).getByRole('option', { name: 'Female' }))

        await clickSubmitButton(user)

        const message = await screen.findByText('User has been created successfully');
        expect(message).toBeInTheDocument(); 
        
    })

    it('has 3 required fields', async () => {
        await clickSubmitButton(user)
    
        expect(await screen.findByText('Name is Required')).toBeInTheDocument();
        expect(getNameInput()).toHaveErrorMessage('Name is Required');
        expect(getEmailInput()).toHaveErrorMessage('Email is Required');
        expect(getGenderSelect()).toHaveErrorMessage('You need to select gender');
        
    });

    it('email field has to be correct', async () => {
        await user.type(getEmailInput(), 'invalidemail')
        await clickSubmitButton(user)
        
        expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
        expect(getEmailInput()).toHaveErrorMessage('Invalid email address');


        await user.type(getEmailInput(), 'test@mail.com')
        await clickSubmitButton(user)

        expect(await screen.queryByText("Invalid email address")).not.toBeInTheDocument();
        expect(getEmailInput()).not.toHaveErrorMessage('Invalid email address');
        
    });
    it('shows error if request fails', async () => {
        server.use(rest.post(
            '*/users',
            (req, res, ctx) => {
                return res(
                    ctx.status(500)
                )
            }
        ))

        const nameInput = getNameInput()
        await user.type(nameInput, 'Bruno')

        const emailInput = getEmailInput()
        await user.type(emailInput, 'testing@gmail.com')

        const genderSelect = getGenderSelect()
        await user.selectOptions(genderSelect, within(genderSelect).getByRole('option', { name: 'Female' }))

        await clickSubmitButton(user)
        
        expect(await screen.findByText((/Error:/i))).toBeInTheDocument();
    })
})

function getNameInput() {
    return screen.getByRole('textbox', {
        name: /user name/i,
    })
}

function getEmailInput() {
    return screen.getByRole('textbox', {
        name: /user email/i,
    })
}

function getGenderSelect() {
    return screen.getByRole('combobox', {
        name: /user gender/i
      })
}

async function clickSubmitButton(user) {
    return (await user.click(
        screen.getByRole('button', {
            name: /submit/i
          })
    ));
}