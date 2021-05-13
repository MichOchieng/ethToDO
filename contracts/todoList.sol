pragma solidity >=0.5.0;

contract todoList {
    // Keep track of tasks in todo list
    uint public numTasks = 0;

    // Task model
    struct task{
        uint id;
        string content;
        bool completed;
    }
    // Blockchain storage
    mapping(uint => task) public tasks; // PK uint

    event TaskCreated(
        uint id,
        string content,
        bool completed
    ); 
    constructor() public{
        createTask("My first task");
    }

    function createTask(string memory _content) public {
        // Increase total task count
        numTasks++;
        // Creates task from current numTask and passed string
        tasks[numTasks] = task(numTasks,_content,false);
        emit TaskCreated(numTasks, _content, false);
    }

}
