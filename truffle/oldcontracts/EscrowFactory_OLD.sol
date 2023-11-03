//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Escrow.sol";

contract EscrowFactory {
    struct ChildInfo {
        address childAddr;
    }
    mapping(address => address[]) public userToEscrow;
    event Create(address addr, uint256 timestamp);
    event AddLog(address childAddr);
    ChildInfo[] public childInfo;

    event AddToChildInfo(address _childAddr);

    function childLength() external view returns (uint256) {
        return childInfo.length;
    }

    function create(
        address toAddr,
        uint256 withdrawalDuration
    ) public
    {
        Escrow escrow = new Escrow(
            msg.sender,
            toAddr,
            withdrawalDuration,
            false
        );
        add(address(escrow));
        userToEscrow[msg.sender].push(address(escrow));
        userToEscrow[toAddr].push(address(escrow));
        emit Create(address(escrow), block.timestamp);
    }

    function getUserToEscrow() public view returns (address[] memory) {
        return userToEscrow[msg.sender];
    }

    function add(address _childAddr) public {
        childInfo.push(ChildInfo({childAddr: _childAddr}));

        emit AddToChildInfo(_childAddr);
    }
}
