import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.exceptions import BadRequestError, NotFoundError, UnauthorizedError
from app.models.purchase import Purchase
from app.services.payment_service import PaymentService

router = APIRouter()


class CreateOrderRequest(BaseModel):
    user_id: str
    product: str = "deep_assessment"


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str


class VerifyPaymentRequest(BaseModel):
    user_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(
    body: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a Razorpay order for deep assessment purchase."""
    user_uuid = uuid.UUID(body.user_id)

    # Check if user already has an unused purchase (paid but not yet taken)
    existing = await db.execute(
        select(Purchase).where(
            Purchase.user_id == user_uuid,
            Purchase.product == body.product,
            Purchase.status == "completed",
            Purchase.assessment_id.is_(None),  # not yet used
        )
    )
    if existing.scalar_one_or_none():
        raise BadRequestError("You already have an unused deep assessment. Go to Deep Assessment to use it.")

    service = PaymentService()
    order = service.create_order(user_uuid, body.product)

    # Save pending purchase record
    purchase = Purchase(
        user_id=user_uuid,
        product=body.product,
        amount=order["amount"],
        currency=order["currency"],
        razorpay_order_id=order["order_id"],
        status="pending",
    )
    db.add(purchase)
    await db.flush()

    return CreateOrderResponse(**order)


@router.post("/verify")
async def verify_payment(
    body: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
):
    """Verify Razorpay payment and activate purchase."""
    # Find the pending purchase by order_id
    result = await db.execute(
        select(Purchase).where(
            Purchase.razorpay_order_id == body.razorpay_order_id,
            Purchase.status == "pending",
        )
    )
    purchase = result.scalar_one_or_none()
    if not purchase:
        raise NotFoundError("Order not found or already processed")

    # Verify signature
    service = PaymentService()
    is_valid = service.verify_payment(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
    )

    if not is_valid:
        purchase.status = "failed"
        await db.flush()
        raise UnauthorizedError("Payment verification failed")

    # Mark as completed
    purchase.razorpay_payment_id = body.razorpay_payment_id
    purchase.razorpay_signature = body.razorpay_signature
    purchase.status = "completed"
    await db.flush()

    return {
        "status": "completed",
        "purchase_id": str(purchase.id),
        "product": purchase.product,
    }


@router.get("/purchases/{user_id}")
async def get_purchases(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get all purchases for a user."""
    user_uuid = uuid.UUID(user_id)
    result = await db.execute(
        select(Purchase).where(
            Purchase.user_id == user_uuid,
        ).order_by(Purchase.created_at.desc())
    )
    purchases = result.scalars().all()

    return {
        "purchases": [
            {
                "id": str(p.id),
                "product": p.product,
                "amount": p.amount,
                "currency": p.currency,
                "status": p.status,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in purchases
        ]
    }


@router.get("/has-access/{user_id}/{product}")
async def check_access(
    user_id: str,
    product: str,
    db: AsyncSession = Depends(get_db),
):
    """Check if user has an unused purchase for a product."""
    user_uuid = uuid.UUID(user_id)
    result = await db.execute(
        select(Purchase).where(
            Purchase.user_id == user_uuid,
            Purchase.product == product,
            Purchase.status == "completed",
            Purchase.assessment_id.is_(None),  # unused
        )
    )
    purchase = result.scalar_one_or_none()
    return {"has_access": purchase is not None}
