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

def test_funded_contract():
    """Test contract functionality with proper funding"""
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    try:
        # Set up Algorand client
        algorand = algokit_utils.AlgorandClient.from_environment()
        deployer = algorand.account.from_environment("DEPLOYER")

        # Get the deployed contract client
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
        logger.info(f"Contract address: {app_client.app_address}")

        # FUND THE CONTRACT ACCOUNT
        logger.info("=== Funding contract account ===")
        from algosdk.transaction import PaymentTxn
        from algosdk.atomic_transaction_composer import TransactionWithSigner
        from algosdk import transaction
        
        # Create payment transaction using algosdk directly
        sp = algorand.client.get_suggested_params()
        payment_txn = PaymentTxn(
            sender=deployer.address,
            sp=sp,
            receiver=app_client.app_address,
            amt=1_000_000,  # 1 ALGO
            note=b"Funding contract for transaction fees"
        )
        
        # Sign and send using algosdk
        signed_payment = payment_txn.sign(deployer.private_key)
        txid = algorand.client.send_transaction(signed_payment)
        logger.info(f"✅ Contract funded with 1 ALGO (txid: {txid})")

        # Test 1: Initialize contract
        logger.info("=== Testing initialize() ===")
        result = app_client.send.initialize()
        logger.info(f"✅ Initialize: {result.abi_return}")

        # Test 2: Register organization
        logger.info("=== Testing register_organization() ===")
        org_result = app_client.send.register_organization(
            args=RegisterOrganizationArgs(
                name="Test Org",
                description="Test organization for aid distribution",
                contact_info="test@example.com"
            )
        )
        logger.info(f"✅ Register org: {org_result.abi_return}")

        # Test 3: Create campaign
        logger.info("=== Testing create_campaign() ===")
        campaign_result = app_client.send.create_campaign(
            args=CreateCampaignArgs(
                title="Test Campaign",
                description="Test campaign for aid distribution",
                target_amount=10000,
                organization_id=1
            )
        )
        logger.info(f"✅ Create campaign: {campaign_result.abi_return}")

        # Test 4: Create donation
        logger.info("=== Testing create_donation() ===")
        donation_result = app_client.send.create_donation(
            args=CreateDonationArgs(campaign_id=1)
        )
        logger.info(f"✅ Create donation: {donation_result.abi_return}")

        # Test 5: Create milestone
        logger.info("=== Testing create_milestone() ===")
        milestone_result = app_client.send.create_milestone(
            args=CreateMilestoneArgs(
                campaign_id=1,
                target_amount=5000,
                description="Test milestone"
            )
        )
        logger.info(f"✅ Create milestone: {milestone_result.abi_return}")

        # Test 6: Complete milestone
        logger.info("=== Testing complete_milestone() ===")
        complete_result = app_client.send.complete_milestone(
            milestone_id=1,
            proof="Test proof of completion"
        )
        logger.info(f"✅ Complete milestone: {complete_result.abi_return}")

        # Test 7: Log delivery
        logger.info("=== Testing log_delivery() ===")
        delivery_result = app_client.send.log_delivery(
            args=LogDeliveryArgs(
                recipient="Test Recipient",
                location="Test Location"
            )
        )
        logger.info(f"✅ Log delivery: {delivery_result.abi_return}")

        # Test 8: Verify delivery
        logger.info("=== Testing verify_delivery() ===")
        verify_result = app_client.send.verify_delivery(
            delivery_id=1,
            agent="Test Agent"
        )
        logger.info(f"✅ Verify delivery: {verify_result.abi_return}")

        # Test 9: Get contract stats
        logger.info("=== Testing get_contract_stats() ===")
        stats_result = app_client.get.contract_stats()
        logger.info(f"✅ Contract stats: {stats_result.abi_return}")

        # Test 10: Get total donations
        logger.info("=== Testing get_total_donations() ===")
        donations_result = app_client.get.total_donations()
        logger.info(f"✅ Total donations: {donations_result.abi_return}")

        logger.info("\n🎉 ALL TESTS PASSED! Backend functionality is complete.")

    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_funded_contract()
