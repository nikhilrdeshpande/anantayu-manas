import hashlib
import hmac
import uuid

import razorpay

from app.config import settings


class PaymentService:
    """Razorpay payment integration for deep assessment purchases."""

    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    def create_order(self, user_id: uuid.UUID, product: str = "deep_assessment") -> dict:
        """Create a Razorpay order for the deep assessment purchase.

        Returns dict with order_id, amount, currency, and razorpay key_id
        for the frontend to initiate checkout.
        """
        amount = settings.DEEP_ASSESSMENT_PRICE_PAISE
        currency = "INR"

        order_data = {
            "amount": amount,
            "currency": currency,
            "receipt": f"da_{str(user_id)[:8]}_{uuid.uuid4().hex[:8]}",
            "notes": {
                "user_id": str(user_id),
                "product": product,
            },
        }

        order = self.client.order.create(data=order_data)

        return {
            "order_id": order["id"],
            "amount": amount,
            "currency": currency,
            "key_id": settings.RAZORPAY_KEY_ID,
        }

    def verify_payment(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> bool:
        """Verify Razorpay payment signature.

        Returns True if signature is valid, False otherwise.
        """
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        expected_signature = hmac.HMAC(
            settings.RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected_signature, razorpay_signature)
