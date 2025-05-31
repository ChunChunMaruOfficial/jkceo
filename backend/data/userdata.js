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
        const [title, price] = note; 
        console.log(title, price);
        
        this.notes = this.notes.filter(v => v.title != title || v.price != price)
        console.log(this.notes, note);

    },
    updateworkerstat(index, worker) { //потом можно оптимизировать на обновление определенной характеристики для экономии траффика
        this.workers[index] = worker
    },
    updateinventory(inventory) {
        this.inventory = inventory
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