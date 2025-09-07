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
    LogDeliveryArgs,
    CompleteMilestoneArgs,
    VerifyDeliveryArgs
)
import algokit_utils

def test_localnet_funded_contract():
    """Test contract functionality with LocalNet funding"""
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

        # FUND THE CONTRACT ACCOUNT using LocalNet dispenser
        logger.info("=== Funding contract account on LocalNet ===")
        try:
            # Use the recommended ensure_funded method
            algorand.account.ensure_funded(
                account_to_fund=app_client.app_address,
                min_spending_balance_micro_algos=1_000_000,  # 1 ALGO
            )
            logger.info("✅ Contract funded successfully using LocalNet dispenser")
        except Exception as e:
            logger.warning(f"⚠️ Dispenser funding failed: {e}")
            logger.info("Trying direct transfer from deployer...")
            
            # Fallback: direct transfer from deployer using recommended method
            try:
                # Use the recommended send.payment method
                algorand.send.payment(
                    from_account=deployer,
                    to_address=app_client.app_address,
                    micro_algos=1_000_000,  # 1 ALGO
                    note="Funding contract for testing"
                )
                logger.info("✅ Contract funded with direct payment")
            except Exception as e2:
                logger.warning(f"⚠️ Direct payment failed: {e2}")
                logger.info("Skipping funding - testing with existing balance...")

        # Test 1: Initialize contract
        logger.info("=== Testing initialize() ===")
        result = app_client.send.initialize()
        logger.info(f"✅ Initialize: {result.abi_return}")

        # Test 2: Register organization
        logger.info("=== Testing register_organization() ===")
        org_result = app_client.send.register_organization(
            args=RegisterOrganizationArgs(
                org_name="Test Aid Organization",
                wallet_address="TESTWALLET123456789"
            )
        )
        logger.info(f"✅ Register org: {org_result.abi_return}")

        # Test 3: Create campaign
        logger.info("=== Testing create_campaign() ===")
        campaign_result = app_client.send.create_campaign(
            args=CreateCampaignArgs(
                title="Emergency Relief Campaign",
                target=50000,
                creator="Test Creator"
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
                target_amount=25000,
                description="First milestone: Food distribution"
            )
        )
        logger.info(f"✅ Create milestone: {milestone_result.abi_return}")

        # Test 6: Complete milestone
        logger.info("=== Testing complete_milestone() ===")
        complete_result = app_client.send.complete_milestone(
            args=CompleteMilestoneArgs(
                milestone_id=1,
                proof="Food distribution completed successfully"
            )
        )
        logger.info(f"✅ Complete milestone: {complete_result.abi_return}")

        # Test 7: Log delivery
        logger.info("=== Testing log_delivery() ===")
        delivery_result = app_client.send.log_delivery(
            args=LogDeliveryArgs(
                recipient="Refugee Camp Alpha",
                location="Coordinates: 40.7128, -74.0060"
            )
        )
        logger.info(f"✅ Log delivery: {delivery_result.abi_return}")

        # Test 8: Verify delivery
        logger.info("=== Testing verify_delivery() ===")
        verify_result = app_client.send.verify_delivery(
            args=VerifyDeliveryArgs(
                delivery_id=1,
                agent="Field Agent Smith"
            )
        )
        logger.info(f"✅ Verify delivery: {verify_result.abi_return}")

        # Test 9: Get contract stats
        logger.info("=== Testing get_contract_stats() ===")
        stats_result = app_client.send.get_contract_stats()
        logger.info(f"✅ Contract stats: {stats_result.abi_return}")

        # Test 10: Get total donations
        logger.info("=== Testing get_total_donations() ===")
        donations_result = app_client.send.get_total_donations()
        logger.info(f"✅ Total donations: {donations_result.abi_return}")

        logger.info("\n🎉 ALL TESTS PASSED! Backend functionality is complete and working!")
        logger.info("📊 Success Rate: 100% - All write operations working with LocalNet funding")

    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    test_localnet_funded_contract()
