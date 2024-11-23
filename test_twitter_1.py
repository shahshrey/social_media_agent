import os
from dotenv import load_dotenv
import tweepy

def test_twitter_credentials():
    load_dotenv()
    
    # Print redacted credentials for verification
    print("API Key:", os.getenv("API_KEY")[:5] + "..." if os.getenv("API_KEY") else "Not found")
    print("API Secret:", os.getenv("API_SECRET")[:5] + "..." if os.getenv("API_SECRET") else "Not found")
    print("Access Token:", os.getenv("ACCESS_TOKEN")[:5] + "..." if os.getenv("ACCESS_TOKEN") else "Not found")
    print("Access Token Secret:", os.getenv("ACCESS_TOKEN_SECRET")[:5] + "..." if os.getenv("ACCESS_TOKEN_SECRET") else "Not found")
    
    try:
        client = tweepy.Client(
            consumer_key=os.getenv("API_KEY"),
            consumer_secret=os.getenv("API_SECRET"),
            access_token=os.getenv("ACCESS_TOKEN"),
            access_token_secret=os.getenv("ACCESS_TOKEN_SECRET")
        )
        
        # Try to post a test tweet
        response = client.create_tweet(text="Test tweet from Python v3")
        print("Successfully posted test tweet!")
        print(f"Tweet ID: {response.data['id']}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_twitter_credentials()