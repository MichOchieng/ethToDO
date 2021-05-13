const { assert } = require("chai");

const todoList = artifacts.require("./todoList.sol");

contract('todoList', (accounts) => {
    // Before a test runs get a copy of the todolist on the blockchain
    before(async () => {
        this.todoList = await todoList.deployed()
    })

    it('Deploys successfully', async () => {
        // Makes sure there is an actual address being used
        const address = await this.todoList.address
        assert.notEqual(address,0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,null)
        assert.notEqual(address,undefined)
    })

    it('Lists tasks', async () => {
        // Makes sure task count is correct and tasks can be found by count
        const numTasks = await this.todoList.numTasks()
        const task = await this.todoList.tasks(numTasks)
        assert.equal(task.id.toNumber(), numTasks.toNumber())
        assert.equal(numTasks.toNumber(), 1)
        assert.equal(task.completed, false)
    })

    it('Creates tasks', async () => {
        const result = await this.todoList.createTask('new task')
        const numTasks = await this.todoList.numTasks()
        assert.equal(numTasks,2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(),2)
        assert.equal(event.content,'new task')
        assert.equal(event.completed,false)
    })
})