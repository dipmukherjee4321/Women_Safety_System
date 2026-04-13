from twilio.rest import Client
from app.core.config import settings

def send_sms_alert(to_number: str, message: str):
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        print("Twilio credentials not configured. Mocking SMS send.")
        print(f"To: {to_number}, Message: {message}")
        return {"status": "mocked", "message": "SMS mocked"}

    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        msg = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to_number
        )
        return {"status": "success", "sid": msg.sid}
    except Exception as e:
        print(f"Error sending SMS via Twilio: {e}")
        return {"status": "error", "message": str(e)}
