App = {
    loading: false,
    contracts: {},
    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
    
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    // Loads blockchain connection
    loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
   },

   loadAccount: async () => {
       App.account = web3.eth.accounts[0]
   },

// Creates a JS version of the smart contract
   loadContract: async () => {
       const todoList = await $.getJSON('todoList.json')
       App.contracts.todoList = TruffleContract(todoList)
       App.contracts.todoList.setProvider(App.web3Provider)

    //    Gives a deployed copy of the smart contract
       App.todoList = await App.contracts.todoList.deployed()
   },

   render: async () => {
    // Prevents double rendering 
    if (App.loading) {
        return
    }
    App.setLoading(true) // Changes loading state

    //  Shows account inside the navbar of html
    $('#account').html(App.account)
    
    // Renders tasks
    await App.renderTask()

    App.setLoading(false) // Changes loading state
   },

   renderTask: async () => {
       // Load total num of task from the blockchain
       const numTasks = await App.todoList.numTasks()
       const $taskTemplate = $('.taskTemplate')
       // Render each task with a new template
       for (let index = 0; index <= numTasks; index++) {
          const task = await App.todoList.tasks(index)
          const taskId = task[0].toNumber
          const taskContent = task[1]
          const taskCompleted = task[2]

        //   Task HTML
          const $newTaskTemplate = $taskTemplate.clone()
          $newTaskTemplate.find('.content').html(taskContent)
          $newTaskTemplate.find('input')
                          .prop('name', taskId)
                          .prop('checked', taskCompleted)
                          //.on('click', App.toggleCompleted)
        // Adds task to correct list
          if (taskCompleted) {
              $('#completedTaskList').append($newTaskTemplate)
          } else {
              $('#taskList').append($newTaskTemplate)
          }    
          
          // Show the task
          $newTaskTemplate.show()
       }
   },

   // Used for loading content
   setLoading: (boolean) => {
       App.loading = boolean
       const loader = $('#loader')
       const content = $('#content')
       if(boolean){
           loader.show()
           content.hide()
       } else{
           loader.hide()
           content.show()
       }
   }
   
}

// Loads app when project loads
$(() => {
    $(window).load(() => {
        App.load()
    })
})
