import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import Web3 from "web3";
const handleSubmit = (event) => {
  event.preventDefault();
  // const data = new FormData(event.currentTarget);
  // console.log({
  //   email: data.get('email'),
  //   password: data.get('password'),
  // });
};

const ESCROWFACTORY_ADDRESS = "0x26e80a5F533af6E2694CBD565008c4353429003A";
const ESCROWFACTORY_ABI = require("./ABI/EscrowFactory.json").abi;
const ESCROW_ABI = require("./ABI/Escrow.json").abi;

const WITHDRAWAL_DURATION = 60;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddr: "",
      balance: 0,
      amount: 0,
      toAddress: "",
      childAddress: "",
      withdrawalDuration: 3600,
      ...props,
    };
  }

  render() {
    console.log("transfer", this.state);
    let { ethereum } = window;
    const web3 = new Web3(ethereum);

    const handleChange = (event) => {
      this.setState({ selectedAddr: event.target.value });
      getBalance(event.target.value);
    };

    const handleWithdrawalDurationChange = (event) => {
      this.setState({ withdrawalDuration: event.target.value });
    };

    const handleAmountChange = (event) => {
      this.setState({ amount: event.target.value });
    };

    const handleToAddressChange = (event) => {
      this.setState({ toAddress: event.target.value });
    };

    const getBalance = async (account) => {
      const balance = await web3.eth.getBalance(account);
      const converted = Web3.utils.fromWei(balance, "ether");
      this.setState({ balance: converted });
    };

    const ESCROWFACTORY_CONTRACT = new web3.eth.Contract(
      ESCROWFACTORY_ABI,
      ESCROWFACTORY_ADDRESS
    );

    console.log("ESCROWFACTORY_CONTRACT", ESCROWFACTORY_CONTRACT);

    const handleCreateEscrow = async (e) => {
      e.preventDefault();
      this.setState({
        childAddress: "0x5C9eb5D6a6C2c1B3EFc52255C0b356f116f6f66D",
        selectedAddr: "",
        balance: 0,
        amount: 0,
        toAddress: "",
        withdrawalDuration: 0
      });
      e.target.reset();

      // console.log("this.state.selectedAddr", this.state.selectedAddr);
      // ESCROWFACTORY_CONTRACT.methods
      //   .createEscrow(this.state.toAddress, WITHDRAWAL_DURATION)
      //   .send({ from: this.state.selectedAddr, gasLimit: '200000', value:0 })
      //   .then(function (receipt) {
      //     console.log(receipt);
      //   });
    };

    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {"Transfer"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleCreateEscrow}
            sx={{ mt: 1 }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                From Address
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.selectedAddr}
                label="From Address"
                onChange={handleChange}
                required
              >
                {this.state.accounts.map((addr) => {
                  return <MenuItem value={addr}>{addr}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <Typography variant="overline" margin="auto">
              Balance: {Number(this.state.balance).toFixed(5).toString()} ETH
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="toaddress"
              label="To Wallet Address"
              name="toaddress"
              onChange={handleToAddressChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="amount"
              label="Amount in ETH"
              id="amount"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleAmountChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="withdrawalduration"
              label="Withdrawal duration (in days)"
              id="withdrawalduration"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleWithdrawalDurationChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Escrow
            </Button>
            {this.state.childAddress != "" && (
              <Alert severity="success">
                Escrow Contract created at {this.state.childAddress}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Home;
