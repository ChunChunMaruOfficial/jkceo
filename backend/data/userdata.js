const User = {
    name: 'КровьЖонглерШоу',
    professionformulation: 'Я продаю представления жонглеров старикам за анализ их крови.',
    notes: [],

    setname(name) {
        this.name = name
    },

    setprofessionformulation(professionformulation) {
        this.professionformulation = professionformulation
    },

    addnewnote(note){
        this.notes.push(note)
    },
    deletecurrentnote(note){
        this.notes = this.notes.filter(v => v != note)
        console.log(this.notes, note);
        
    },
}

module.exports = User