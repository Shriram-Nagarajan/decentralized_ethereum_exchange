import React, { Component } from 'react';
import './App.css';
import Token from '../abis/Token.json'
import { loadAccount, loadExchange, loadToken, loadWeb3 } from '../store/interactions';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import Content from './Content';
import { contractsLoadedSelector } from '../store/selectors';

class App extends Component {

  constructor(props) {
    super(props);
    this.loadBlockChainData(this.props.dispatch);
  }

  async loadBlockChainData(dispatch){
    // const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
    // console.log("web3:", web3)
    // console.log("Web3 eth accounts:", await web3.eth.getAccounts())
    const web3 = loadWeb3(dispatch);
    console.log("web3", web3)
    const networkId = await web3.eth.net.getId()
    console.log("networkId", networkId)
    const accounts = await loadAccount(web3, dispatch)
    console.log("accounts:",accounts)
    const token = await loadToken(web3, networkId, dispatch)
    console.log("token", token)
    const totalSupply = await token.methods.totalSupply().call()
    console.log("totalSupply", totalSupply)
    const exchange = await loadExchange(web3, networkId, dispatch)
    console.log("exchange:", exchange)
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <Content />
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("contractsLoaded?", contractsLoadedSelector(state))
  return {

  }
}

export default connect(mapStateToProps)(App);
