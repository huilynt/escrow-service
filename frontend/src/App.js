import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Home from "./Transfer";
import Approve from "./Approve";
import Web3 from "web3";
import { useState, useEffect } from "react";
import { Alert, Container } from "@mui/material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function App() {
  const [value, setValue] = React.useState(0);
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const { ethereum } = window;

    if (!ethereum) {
      sethaveMetamask(false);
    }
    getAccounts();
    setIsConnected(true);
  }, []);

  const getAccounts = async () => {
    const { ethereum } = window;
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      console.log("app.js", accounts)
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!haveMetamask || !isConnected  || accounts.length == 0) {
    return (
      <Container component="main" maxWidth="xs">
        <Alert severity="error">
          Please install MetaMask extension first.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Transfer" {...a11yProps(0)} />
          <Tab label="Approve" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Home accounts={accounts} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Approve accounts={accounts} />
      </CustomTabPanel>
    </Box>
  );
}
