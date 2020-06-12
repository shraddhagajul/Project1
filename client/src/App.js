import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  //Constructor
  constructor(props){
    super(props);
    this.state = {
      isConnected : false,
      account : '',
      contract : null,
      storageValue : "",
      newValue: ""
    };

  }

  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  async componentWillMount(){
    //find meaning of await


    await this.loadweb3();
    await this.loadBlockchainData()
  }

  async loadweb3(){



     // Get network provider and web3 instance.
      this.web3 = await getWeb3();
      let connected = await this.web3.eth.net.isListening();
      if (connected) {
          this.setState({isConnected: true})
      }
  }

  async loadBlockchainData(){
    try {

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      // Get network provider and web3 instance.
      const web3 = this.web3;

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: accounts[0], contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  }

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set("").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
     const response = await contract.methods.get().call();

    // // Update state with the result.
     this.setState({ storageValue: response });
  };

  async handleSubmit(event){

    event.preventDefault();

    const{accounts , contract } = this.state;
    await contract.methods.set(this.state.newValue).send({ from: this.state.account })
     .on('transactionHash', (receipt) => {
        console.log('Created');
        this.setState({
            newValue: this.state.newValue
        })
    })
    const response  = await contract.methods.get().call();
    this.setState({
      storageValue: response
    });

  }
  handleChange(event){
    this.setState({
      newValue: event.target.value
    });
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <h1>Welcome To DAPP! </h1>
        
        <div>
         Shraddha likes: {this.state.storageValue}
        </div>
        <form onSubmit ={this.handleSubmit}>
        <input type = "text" value={this.state.newValue} onChange={this.handleChange.bind(this)}/>
        <input type="submit" value="Submit"/>
        </form>
        
      </div>
    );
  }
}

export default App;
