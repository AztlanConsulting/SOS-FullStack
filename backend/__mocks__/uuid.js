let counter = 0;
const v7 = () => `test-uuid-${Date.now()}-${++counter}`;
module.exports = { v7 };
