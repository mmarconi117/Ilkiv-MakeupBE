from io import BytesIO
from PIL import Image, ImageEnhance
import numpy as np
import cv2

def _soften_skin(img: np.ndarray) -> np.ndarray:
    return cv2.bilateralFilter(img, d=7, sigmaColor=75, sigmaSpace=75)

def _boost_color(pil_img: Image.Image) -> Image.Image:
    pil_img = ImageEnhance.Color(pil_img).enhance(1.15)
    pil_img = ImageEnhance.Brightness(pil_img).enhance(1.05)
    pil_img = ImageEnhance.Contrast(pil_img).enhance(1.05)
    return pil_img

def apply_artist_style(file_bytes: bytes) -> bytes:
    pil = Image.open(BytesIO(file_bytes)).convert("RGB")
    pil = _boost_color(pil)
    img_bgr = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    img_bgr = _soften_skin(img_bgr)
    out_pil = Image.fromarray(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
    buf = BytesIO()
    out_pil.save(buf, format="JPEG", quality=90)
    return buf.getvalue()
