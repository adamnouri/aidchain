from algopy import ARC4Contract, String, UInt64
from algopy.arc4 import abimethod


class AidchainContracts(ARC4Contract):
    @abimethod()
    def hello(self, name: String) -> String:
        return "Hello, " + name

    @abimethod()
    def create_donation(self, amount: UInt64) -> String:
        """Create a new donation and return confirmation"""
        return String("Donation created successfully")
    
    @abimethod()
    def get_donation_info(self, amount: UInt64, donor: String) -> String:
        """Get donation information"""
        return String("Donation info retrieved for donor: ") + donor
    
    @abimethod()
    def calculate_total(self, amount1: UInt64, amount2: UInt64) -> UInt64:
        """Calculate total of two amounts"""
        return amount1 + amount2
