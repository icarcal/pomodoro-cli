const pad = (value, fillWith, fillValue) => {
    value = String(value);
    fillWith = String(fillWith).repeat(String(fillValue));
    value = fillWith.substring(0, fillWith.length - value.length)+value;
    return value;
};

module.exports = pad;
