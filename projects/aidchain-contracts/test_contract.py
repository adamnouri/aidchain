#!/usr/bin/env python3

import logging
import sys
from smart_contracts.artifacts.aidchain_contracts.aidchain_contracts_client import (
    AidchainContractsClient, 
    RegisterOrganizationArgs,
    CreateCampaignArgs, 
    CreateDonationArgs,
    CreateVoucherAssetArgs,
    DistributeVouchersArgs,
    CreateMilestoneArgs,
    LogDeliveryArgs
)
import algokit_utils

def test_contract_methods():
    """Test core contract functionality"""
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    try:
        # Set up Algorand client
        algorand = algokit_utils.AlgorandClient.from_environment()
        deployer = algorand.account.from_environment("DEPLOYER")

        # Get the deployed contract client using factory pattern from deploy_config.py
        from smart_contracts.artifacts.aidchain_contracts.aidchain_contracts_client import AidchainContractsFactory
        
        factory = algorand.client.get_typed_app_factory(
            AidchainContractsFactory, default_sender=deployer.address
        )

        # Deploy or get existing app
        app_client, result = factory.deploy(
            on_update=algokit_utils.OnUpdate.AppendApp,
            on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
        )

        logger.info(f"Testing contract at app ID: {app_client.app_id}")

        # Test 1: Initialize contract
        logger.info("=== Testing initialize() ===")
        result = app_client.send.initialize()
        logger.info(f"Initialize result: {result.abi_return}")

        # Test 2: Register organization
        logger.info("=== Testing register_organization() ===")
        org_result = app_client.send.register_organization(
            args=RegisterOrganizationArgs(
                org_name="Red Cross",
                wallet_address="TESTADDRESS123"
            )
        )
        logger.info(f"Organization ID: {org_result.abi_return}")

        # Test 3: Create campaign
        logger.info("=== Testing create_campaign() ===")
        campaign_result = app_client.send.create_campaign(
            args=CreateCampaignArgs(
                title="Emergency Relief",
                target=10000,
                creator="Red Cross"
            )
        )
        logger.info(f"Campaign ID: {campaign_result.abi_return}")

        # Test 4: Create donation
        logger.info("=== Testing create_donation() ===")
        donation_result = app_client.send.create_donation(
            args=CreateDonationArgs(
                campaign_id=1
            )
        )
        logger.info(f"Donation result: {donation_result.abi_return}")

        # Test 5: Get totals
        logger.info("=== Testing get_total_donations() ===")
        total_result = app_client.send.get_total_donations()
        logger.info(f"Total donations: {total_result.abi_return}")

        # Test 6: Create voucher
        logger.info("=== Testing create_voucher_asset() ===")
        voucher_result = app_client.send.create_voucher_asset(
            args=CreateVoucherAssetArgs(
                asset_name="Food Voucher",
                total_supply=1000
            )
        )
        logger.info(f"Voucher ID: {voucher_result.abi_return}")

        # Test 7: Distribute vouchers
        logger.info("=== Testing distribute_vouchers() ===")
        distribute_result = app_client.send.distribute_vouchers(
            args=DistributeVouchersArgs(
                asset_id=1,
                recipient=deployer.address,  # Use deployer address for testing
                amount=50
            )
        )
        logger.info(f"Distribution result: {distribute_result.abi_return}")

        # Test 8: Create milestone
        logger.info("=== Testing create_milestone() ===")
        milestone_result = app_client.send.create_milestone(
            args=CreateMilestoneArgs(
                campaign_id=1,
                target_amount=5000,
                description="First phase completed"
            )
        )
        logger.info(f"Milestone ID: {milestone_result.abi_return}")

        # Test 9: Log delivery
        logger.info("=== Testing log_delivery() ===")
        delivery_result = app_client.send.log_delivery(
            args=LogDeliveryArgs(
                recipient="Beneficiary1",
                location="Location1"
            )
        )
        logger.info(f"Delivery ID: {delivery_result.abi_return}")

        # Test 10: Get statistics
        logger.info("=== Testing get_contract_stats() ===")
        stats_result = app_client.send.get_contract_stats()
        logger.info(f"Contract stats: {stats_result.abi_return}")

        logger.info("✅ All contract methods tested successfully!")

    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        return False

    return True

if __name__ == "__main__":
    success = test_contract_methods()
    sys.exit(0 if success else 1)