

// Defined Some Globally used functions

const checkInputs = (value) => { return (Object.keys(value).length > 0); }


const isValidInput = (value) => { return ((typeof (value) === 'string' && value.length > 0)); }

module.exports = { checkInputs, isValidInput }