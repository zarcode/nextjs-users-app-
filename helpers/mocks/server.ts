import { setupServer } from 'msw/node'
import { rest } from "msw"

// Setup requests interception using the given handlers.
export const server = setupServer()