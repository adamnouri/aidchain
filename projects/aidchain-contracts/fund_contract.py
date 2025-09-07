#!/usr/bin/env python3

import algokit_utils
import logging

def fund_contract():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # Connect to LocalNet
    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")
    
    contract_address = "H3V4Y43YUBL6LJPSHXBNQJAJANK7ZT4ZUGLGH3YDFZ2T7KCFIEYS6M72QI"
    
    logger.info(f"Deployer: {deployer.address}")
    logger.info(f"Contract: {contract_address}")
    
    # Check deployer balance
    deployer_info = algorand.account.get_information(deployer.address)
    logger.info(f"Deployer balance: {deployer_info.amount.micro_algo / 1_000_000:.2f} ALGO")
    
    # Check contract balance before
    contract_info = algorand.account.get_information(contract_address)
    logger.info(f"Contract balance before: {contract_info.amount.micro_algo / 1_000_000:.6f} ALGO")
    
    # Fund the contract with 1 ALGO
    result = algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=deployer.address,
            receiver=contract_address,
            amount=algokit_utils.AlgoAmount.from_micro_algo(1_000_000)  # 1 ALGO in microALGOs
        )
    )
    
    logger.info(f"✅ Payment sent successfully!")
    
    # Check contract balance after
    contract_info_after = algorand.account.get_information(contract_address)
    logger.info(f"Contract balance after: {contract_info_after.amount.micro_algo / 1_000_000:.6f} ALGO")
    
    return True

if __name__ == "__main__":
    fund_contract()