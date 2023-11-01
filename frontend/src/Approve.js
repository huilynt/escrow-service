import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { Component } from "react";
  
  const checkMetamask = () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    } else {
      console.log("n");
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });
  };
  
  class Approve extends Component {
    constructor(props) {
      super(props);
      this.state = {
        metamaskConnected: false,
      };
    }
    render() {
      checkMetamask();
  
      let btnText = this.state.metamaskConnected
        ? "Transfer"
        : "Connect MetaMask";
      
        
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
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="address"
                label="Wallet Address"
                name="address"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="amount"
                label="Amount"
                type="amount"
                id="password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  this.setState({ metamaskConnected: true });
                }}
              >
                {btnText}
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }
  }
  
  export default Approve;
  