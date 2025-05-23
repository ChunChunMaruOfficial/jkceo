const User = {
    name: 'КровьЖонглерШоу',
    professionformulation: 'Я продаю представления жонглеров старикам за анализ их крови.',
    notes: [],
    money: 2000,
    workers: [],
    inventory: [],

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
    addnewworker(worker) {
        this.workers.push(worker)
    },
    deletecurrentnote(note) {
        this.notes = this.notes.filter(v => v.text != note.text)
        console.log(this.notes, note);

    },
    updateworkerstat(index, worker) { //потом можно оптимизировать на обновление определенной характеристики для экономии траффика
        this.workers[index] = worker
    },
    addtoinventory(item) {
        this.inventory.push(item)
    }
}

module.exports = User