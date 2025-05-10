const User = {
    name: 'КровьЖонглерШоу',
    professionformulation: 'Я продаю представления жонглеров старикам за анализ их крови.',
    notes: [],
    money: 0,

    setmoney(money) {
        this.money = money
    },

    setname(name) {
        this.name = name
    },

    setprofessionformulation(professionformulation) {
        this.professionformulation = professionformulation
    },

    addnewnote(note) {
        this.notes.push(note)
    },
    deletecurrentnote(note) {
        this.notes = this.notes.filter(v => v.text != note.text)
        console.log(this.notes, note);

    },
}

module.exports = User