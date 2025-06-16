const User = {
    name: 'КровьЖонглерШоу',
    professionformulation: 'Я продаю представления жонглеров старикам за анализ их крови.',
    notes: [],
    day: 0,
    rumors: 2.5,
    time: 360,
    skills: {
        productcreationspeed: { value: 42, level: 0, price: 50 },
        priceagreementwinnings: { value: 1, level: 0, price: 60 },
        bulletspeed: { value: 300, level: 0, price: 40 },
        inventorymax: { value: 50, level: 0, price: 40 },
        workersmax: { value: 7, level: 0, price: 30 },
        invadersscale: { value: 1, level: 0, price: 40 }
    },
    money: 2000,
    workers: [],
    invadersattemps: 0,
    inventory: [],
    productionArray: [],

    setmoney(money) {
        this.money = money
    },
    setrumors(rumors) {
        this.rumors = rumors
    },
    settime(time){
        this.time = time
    },
    setday(day){
        this.day = day
    },
    updateskill(skill, value){
        this.skills[skill] = value
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
    deletemyworker(worker) {
        this.workers = this.workers.filter(v => worker.name != v.name)
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