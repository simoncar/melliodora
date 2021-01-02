jest.mock('expo', () => ({
	Permissions: {
		askAsync: jest.fn(),
	}
}));