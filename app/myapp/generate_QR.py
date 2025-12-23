import qrcode
from django.core.files import File
from io import BytesIO

def save(self, *args, **kwargs):
    super().save(*args, **kwargs)

    if not self.qr_code:
        qr = qrcode.make(f"https://archaeovault.com/artifact/{self.id}")
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        self.qr_code.save(f"artifact_{self.id}.png", File(buffer), save=False)
        super().save(update_fields=["qr_code"])