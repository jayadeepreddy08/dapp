//const { uploadFile, retrieveFile } = require('./ipfs.js');
App = {
  loading: false,
  contracts: {},
    
    load: async () => {
        
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        //await handleFileUpload(file)
        //await handleFileRetrieval(cid)
        web3.eth.defaultAccount = App.account;
    },
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

    loadAccount: async () =>{
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
        console.log(App.account)

    },

    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const capstone = await $.getJSON('Capstone.json')
      App.contracts.Capstone = TruffleContract(capstone)
      App.contracts.Capstone.setProvider(App.web3Provider)
      console.log(capstone)
      
  
      // Hydrate the smart contract with values from the blockchain
      App.capstone = await App.contracts.Capstone.deployed()
    },

    render: async () => {
        // Prevent double render
        if (App.loading) {
          return
        }
    
        // Update app loading state
        App.setLoading(true)
    
        // Render Account
        $('#account').html(App.account)
    
        // Render User
        await App.renderUser()
    
        // Update loading state
        App.setLoading(false)
      },
      setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
      },

      renderUser: async () => {
        // Load the total user count from the blockchain
        const userCount = await App.capstone.userCount()
        const $userTemplate = $('.userTemplate')
    
        // Render out each task with a new task template
        for (var i = 1; i <= userCount; i++) {
          // Fetch the user data from the blockchain
          const user = await App.capstone.user(i)
          const userId = user[0].toNumber()
          const userName = user[1]
          const userContent = user[2]
          const userJoined = user[3]
    
          // Create the html for the task
          const $newUserTemplate = $userTemplate.clone()
          $newUserTemplate.find('.content').html(userName)
          $newUserTemplate.find('input')
                          .prop('Id', userId)
                          .prop('content', userContent)                     
                          .prop('checked', userJoined)
                          //.on('click', App.toggleCompleted)
    
          // Put the task in the correct list
          if (userJoined) {
            $('#joinedUserList').append($newUserTemplate)
          } else {
            $('#userList').append($newUserTemplate)
          }
    
          // Show the user
          $newUserTemplate.show()
        }
      },

    createUser: async () => {
      App.setLoading(true)
      const name = $('#newUser_name').val()
      const content = $('#newUser_content').val()
      

      //Calling createUser function from smart contract Capstone.sol
      await App.capstone.createUser(name, content)

      //reloading the page automatically
      window.location.reload()
  
    },   
    /*
    handleFileUpload: async (file) => {
      const cid = await uploadFile(file);
      console.log('File uploaded to IPFS with CID:', cid);
    },
    
    // Arrow function for handling file retrieval
    handleFileRetrieval: async (cid) => {
      const data = await retrieveFile(cid);
      console.log('File retrieved from IPFS:', data);
    },
    */
    
}
$(() => {
    $(window).load(() =>{
        App.load()
    })

})
