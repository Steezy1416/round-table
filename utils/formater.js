module.exports = {
    formatChatName: name => {
        const word = name.split(" ")
        const formatedName = []
        word.forEach(letter => {
            formatedName.push(letter[0])
        });
        return formatedName.filter((letter, index) => index < 2).join('')
    }
}