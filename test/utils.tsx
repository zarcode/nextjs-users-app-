import userEvent from '@testing-library/user-event'
import { renderWithClient } from "test-setup"

export const setup = (jsx: React.ReactElement) => {
    return {
      user: userEvent.setup(),
      ...renderWithClient(jsx),
    }
  } 