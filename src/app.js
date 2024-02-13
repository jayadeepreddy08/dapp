//const { uploadFile, retrieveFile } = require('./ipfs.js');
App = {
  loading: false,
  loggedin: false,
  contracts: {},
    
    load: async () => {
        
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
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
      try{
      const capstone = await $.getJSON('Capstone.json')
      App.contracts.Capstone = TruffleContract(capstone)
      App.contracts.Capstone.setProvider(App.web3Provider)
      console.log(capstone)

      const simplewallet = await $.getJSON('SimpleWallet.json')
      App.contracts.SimpleWallet = TruffleContract(simplewallet)
      App.contracts.SimpleWallet.setProvider(App.web3Provider)
      console.log('App.contracts.SimpleWallet:', App.contracts.SimpleWallet);
      
      const userAuth = await $.getJSON('UserAuth.json')
      App.contracts.UserAuth = TruffleContract(userAuth)
      App.contracts.UserAuth.setProvider(App.web3Provider)
      console.log('App.contracts.UserAuth:',App.contracts.UserAuth)
      
  
      // Hydrate the smart contract with values from the blockchain
      App.capstone = await App.contracts.Capstone.deployed()
      App.simplewallet = await App.contracts.SimpleWallet.deployed()
      App.userAuth = await App.contracts.UserAuth.deployed()
      console.log('Capstone instance:', App.capstone);
      console.log('SimpleWallet instance:', App.simplewallet);
      console.log('UserAuth instamce:', App.userAuth)
    } catch (error){
      console.error('Error Loading contracts:',error);
    }
    },

    render: async () => {
        // Prevent double render
        /*if (App.loading) {
          return
        }*/
        if(App.loggedin){
          return
        }
    
        // Update app loading state
        //App.setLoading(true)
    
        // Render Account
        $('#account').html(App.account)
    
        // Render User
        //await App.renderUser()
    
        // Update loading state
        //App.setLoading(false)
      },
      /*
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
      },*/
      setLoggedin: (boolean) => {
        App.loggedin = boolean
        const login = $('#loggedin')
        const afterLogin = $('#afterLogin')
        //const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          login.hide()
          afterLogin.show()
          content.show()
         // loader.hide()
        } else {
          login.show()
          afterLogin.hide()
         // loader.show()
          content.hide()
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
          //const userContent = user[2]
          const userJoined = user[2]
    
          // Create the html for the task
          const $newUserTemplate = $userTemplate.clone()
          $newUserTemplate.find('.content').html(userName)
          $newUserTemplate.find('input')
                          .prop('Id', userId)                     
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
      //App.setLoading(true)
      const name = $('#newUser_name').val()
      //const content = $('#newUser_content').val()
      

      //Calling createUser function from smart contract Capstone.sol
      await App.capstone.createUser(name)

      //reloading the page automatically
     // window.location.reload()
  
    },   
    transfer: async () => {
      //App.setLoading(true);

      try {
        // Replace '0x...' with the recipient address
        const recipientAddress = '0xd85861A45cFAA47b94558DA609C27Cb621a14D38'; // Replace with the actual recipient address

        // Ensure recipientAddress is a valid Ethereum address
        if (!web3.isAddress(recipientAddress)) {
        console.error('Invalid Ethereum address:', recipientAddress);
        return;
      }

      // Log the version and provider to ensure web3 is properly initialized
      console.log('Web3 version:', web3.version.api);
      console.log('Web3 provider:', web3.currentProvider);

      // Log the result of 'web3.toWei' to see if it's available
      console.log('1 ether in wei:', web3.toWei('1', 'ether'));

      // The amount to transfer in wei
      const amountWei = web3.toWei('1', 'ether');

      // Use the 'eth.sendTransaction' function to execute the transaction
      web3.eth.sendTransaction({
        to: recipientAddress,
        from: '0x07bc787138c194049BBEa5Df7E666D72dC211F36', // Replace with the owner's address
        value: amountWei,
      }, function(error, transactionHash) {
      if (!error) {
        console.log('Transaction Hash:', transactionHash);
      } else {
        console.error('Error making payment:', error);
      }
      });
      } catch (error) {
      console.error('Error making payment:', error);
      } 
    },
    registerUser: async () => {
      //App.setLoading(true);
      App.setLoggedin(false);
      const username = $('#register_username').val();
      const password = $('#register_password').val();

      try {
        // Call the register function from the smart contract
        await App.userAuth.register(username, password, { from: App.account });

        // Set userExists to true as the user is now registered
        App.userExists = true;
        console.log('User registered!!')

        // Reload the page or update the UI as needed
        //window.location.reload();
      }catch (error) {
        console.error('Error registering user:', error);
      } finally {
        // Ensure loading state is reset
       // App.setLoading(false);
        App.setLoggedin(true);
      }
    },

    loginUser: async () => {
      //App.setLoading(true);
      App.setLoggedin(false);
      const username = $('#login_username').val();
      const password = $('#login_password').val();
  
      try {
          // Call the login function from the smart contract
          await App.userAuth.login(username, password, { from: App.account });
  
          // Set userExists to true as the user is logged in
          App.userExists = true;
          console.log('User loggedin!!!!')
          
  
          // Reload the page or update the UI as needed
          //window.location.reload();
      } catch (error) {
          console.error('Error logging in:', error);
      } finally {
          // Ensure loading state is reset
          //App.setLoading(false);
          App.setLoggedin(true);
      }
  },
  
  getUser: async () => {
      try {
          // Call the getUser function from the smart contract
          const result = await App.capstone.methods.getUser().call({ from: App.account });
  
          // Update the UI or perform actions based on the result
          console.log('User details:', result);
      } catch (error) {
          console.error('Error getting user details:', error);
      }
  },
  logout: async () =>{
    App.setLoggedin(false)
  }
  
}
$(() => {
    $(window).load(() =>{
        App.load()
    })

})
