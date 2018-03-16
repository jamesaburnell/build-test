class App {
    constructor(options) {
        this.options = options
        this.node = document.getElementById('app')
        this.p = this.p.bind(this)
        this.arr = ['carne', 'asuh', 'dude']
        this.init()
    }

    async init() {
        let {node, arr, p} = this
        let a = await p()
        if(arr.includes('asuh')){
            node.innerHTML = a
        } 
        else { //hey
            node.innerHTML = "not found in array"
        }
    }

    p() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(`data: '${this.options.data}''`)
            }, 5000)
        })
    }
    
}

export default App