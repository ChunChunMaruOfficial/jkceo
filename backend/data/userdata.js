const { log } = require("util")

const User = {
    name: 'КровьЖонглерШоу',
    professionformulation: 'Я продаю представления жонглеров старикам за анализ их крови.',
    notes: [],
    money: 2000,
    workers: [],
    inventory: [],
    productionArray: [],

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
    addtoinventory(item, day) {
        this.inventory.some(v => v.name == item) ? this.inventory.map(v => (v.name == item ? v.count += 1 : v.count)) : this.inventory.push({ name: item, count: 1 })
        this.productionArray[day] = this.productionArray[day] ? this.productionArray[day] + 1 : 1
        console.log(this.inventory);
        
    },
    removefrominventory(itemName) {
        const item = this.inventory.find(v => v.name === itemName);
        if (item) {
            if (item.count > 1) {
                item.count -= 1;
            } else {
                this.inventory = this.inventory.filter(v => v.name !== itemName);
            }
        }
    }
}

module.exports = User