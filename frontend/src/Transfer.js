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

const ESCROWFACTORY_ADDRESS = "0x713b06C827FFc95084583b02c7380ae8Ae9d1a03";
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
      ...props,
    };
  }

  componentDidMount() {}

  render() {
    console.log("transfer", this.state);
    let { ethereum } = window;
    const web3 = new Web3(ethereum);

    const handleChange = (event) => {
      this.setState({ selectedAddr: event.target.value });
      getBalance(event.target.value);
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

    console.log(ESCROWFACTORY_CONTRACT);

    const handleCreateEscrow = async (e) => {
      e.preventDefault();
      console.log(this.state.selectedAddr)
      const escrow_contract = await ESCROWFACTORY_CONTRACT.methods
        .create(this.state.toAddress, WITHDRAWAL_DURATION)
        .send({ from: this.state.selectedAddr, value: 1000000000000000000 });
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
            noValidate
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
              type="amount"
              id="amount"
              onChange={handleAmountChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={async () => {}}
            >
              Create Escrow
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Home;
