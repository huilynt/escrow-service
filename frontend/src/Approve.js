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

class Approve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddr: "",
      balance: 0,
      selectedChild: null,
      childContracts: [
        { address: "0x5C9eb5D6a6C2c1B3EFc52255C0b356f116f6f66D", balance: 1 },
      ],
      withdrawnSuccess: false,
      ...props,
    };
  }

  render() {
    let { ethereum } = window;
    const web3 = new Web3(ethereum);

    const handleSubmit = (event) => {
      event.preventDefault();
      this.setState({
        selectedAddr: "",
        balance: 0,
        selectedChild: null,
        withdrawnSuccess: true,
      });
      event.target.reset()
    };

    const handleChange = (event) => {
      this.setState({ selectedAddr: event.target.value });
      getBalance(event.target.value);
    };

    const handleChildContract = (event) => {
      this.setState({ selectedChild: event.target.value });
    };

    const getBalance = async (account) => {
      const balance = await web3.eth.getBalance(account);
      const converted = Web3.utils.fromWei(balance, "ether");
      this.setState({ balance: converted });
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
            {"Approve"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Escrow Contracts
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.selectedChild}
                label="Escrow Contracts"
                onChange={handleChildContract}
                required
              >
                {this.state.childContracts.map((contract) => {
                  console.log(contract);
                  return (
                    <MenuItem value={contract.address}>
                      {contract.address}
                      <br />
                      {contract.balance} ETH
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                this.setState({ metamaskConnected: true });
              }}
            >
              Withdraw
            </Button>
            {this.state.withdrawnSuccess && (
              <Alert severity="success">
                Withdrawn successfully
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Approve;
