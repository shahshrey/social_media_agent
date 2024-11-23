import asyncio
from backend.services.twitter_service import TwitterService
from datetime import datetime

async def diagnose_twitter():
    try:
        print("\n=== Twitter Diagnostic Test ===")
        
        # 1. Initialize service
        print("\nStep 1: Initializing Twitter service...")
        service = TwitterService()
        
        # 2. Verify credentials
        print("\nStep 2: Verifying credentials...")
        me = service.client.get_me()
        print(f"✓ Authenticated as: @{me.data.username}")
        
        # 3. Test tweet with timestamp
        print("\nStep 3: Posting test tweet...")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        test_content = f"Diagnostic test tweet ({timestamp})"
        
        tweet_url = await service.post_tweet(test_content)
        if tweet_url:
            print(f"✓ Test tweet posted: {tweet_url}")
        else:
            print("✗ Failed to post test tweet")
            
    except Exception as e:
        print(f"\n✗ Diagnostic failed: {str(e)}")
        print(f"Error type: {type(e)}")

if __name__ == "__main__":
    asyncio.run(diagnose_twitter())