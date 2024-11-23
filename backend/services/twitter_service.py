import os
import tweepy
from typing import Optional
from dotenv import load_dotenv
import asyncio
load_dotenv()

class TwitterService:
    def __init__(self):
        self.api_key = os.getenv("API_KEY")
        self.api_secret = os.getenv("API_SECRET")
        self.access_token = os.getenv("ACCESS_TOKEN")
        self.access_token_secret = os.getenv("ACCESS_TOKEN_SECRET")
        
        print("\nInitializing Twitter client...")
        print(f"API Key (last 4): ...{self.api_key[-4:] if self.api_key else 'None'}")
        print(f"Access Token (last 4): ...{self.access_token[-4:] if self.access_token else 'None'}")
        
        self.client = tweepy.Client(
            consumer_key=self.api_key,
            consumer_secret=self.api_secret,
            access_token=self.access_token,
            access_token_secret=self.access_token_secret,
            wait_on_rate_limit=True
        )

    async def verify_credentials(self) -> bool:
        try:
            me = self.client.get_me()
            print(f"Successfully authenticated as: @{me.data.username}")
            return True
        except Exception as e:
            print(f"Failed to verify Twitter credentials: {str(e)}")
            return False

    async def post_tweet(self, content: str) -> Optional[str]:
        try:
            await asyncio.sleep(2)
            
            try:
                me = self.client.get_me()
                print(f"Authenticated as: @{me.data.username}")
            except tweepy.errors.TooManyRequests as e:
                print("Rate limit exceeded. Waiting 15 minutes...")
                await asyncio.sleep(900)
                me = self.client.get_me()
            
            print(f"Attempting to post tweet (length: {len(content)})")
            print(f"Content preview: {content[:50]}...")
            
            response = self.client.create_tweet(text=content)
            tweet_id = response.data['id']
            tweet_url = f"https://twitter.com/{me.data.username}/status/{tweet_id}"
            return tweet_url
            
        except tweepy.errors.Forbidden as e:
            print("\n=== Twitter API Error Details ===")
            print(f"Error Code: 403 Forbidden")
            print(f"Error Message: {str(e)}")
            print(f"Response Data: {getattr(e, 'response_data', 'No response data')}")
            print("\nPossible causes:")
            print("1. Duplicate tweet content")
            print("2. Tweet contains blocked content")
            print("3. App permissions issue")
            print("4. Rate limiting")
            return None
            
        except tweepy.errors.TooManyRequests as e:
            print(f"Rate limit exceeded: {str(e)}")
            return None
            
        except Exception as e:
            print(f"Unexpected error type: {type(e)}")
            print(f"Error details: {str(e)}")
            return None