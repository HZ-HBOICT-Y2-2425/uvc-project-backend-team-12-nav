global.console = {
    ...console,
    log: jest.fn((...args) => {
      console.info('\n✅ LOG:', ...args); // Custom log format
    }),
    error: jest.fn((...args) => {
      console.error('\n❌ ERROR:', ...args); // Custom error format
    }),
    warn: jest.fn((...args) => {
      console.warn('\n⚠️ WARN:', ...args); // Custom warning format
    }),
  };
  