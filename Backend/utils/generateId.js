async function generateId(size) {
    const { nanoid } = await import("nanoid");
    const id = nanoid(size);
    return id;
}

module.exports = {
    generateId,
};
