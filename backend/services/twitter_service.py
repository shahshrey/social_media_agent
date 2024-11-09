import os
import tweepy
from typing import Optional
from dotenv import load_dotenv
load_dotenv()

class TwitterService:
    def __init__(self):
        self.api_key = os.environ.get('API_KEY')
        self.api_secret = os.environ.get('API_SECRET')
        self.access_token = os.environ.get('ACCESS_TOKEN')
        self.access_token_secret = os.environ.get('ACCESS_TOKEN_SECRET')
        self.bearer_token = os.environ.get('BEARER_TOKEN')
        
        self.client = tweepy.Client(
            bearer_token=self.bearer_token,
            consumer_key=self.api_key,
            consumer_secret=self.api_secret,
            access_token=self.access_token,
            access_token_secret=self.access_token_secret
        )
        
        # For V1 API access if needed
        auth = tweepy.OAuth1UserHandler(
            self.api_key, 
            self.api_secret, 
            self.access_token, 
            self.access_token_secret
        )
        self.api = tweepy.API(auth)

    async def post_tweet(self, content: str) -> Optional[str]:
        try:
            response = self.client.create_tweet(text=content)
            tweet_id = response.data['id']
            return f"https://twitter.com/user/status/{tweet_id}"
        except Exception as e:
            print(f"Error posting tweet: {str(e)}")
            return None