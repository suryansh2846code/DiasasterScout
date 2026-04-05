import re
import httpx
from PIL import Image
from io import BytesIO
import numpy as np
import torch
import logging

logger = logging.getLogger(__name__)

def convert_gdrive_url(url: str) -> str:
    """
    Converts a Google Drive shareable link to a direct download URL.
    Handles formats:
      - https://drive.google.com/file/d/FILE_ID/view?...
      - https://drive.google.com/open?id=FILE_ID
    Returns the original URL unchanged if it's not a Google Drive link.
    """
    # Already a direct download link
    if "drive.google.com/uc" in url:
        return url

    # Match /file/d/FILE_ID/...
    match = re.search(r"drive\.google\.com/file/d/([a-zA-Z0-9_-]+)", url)
    if match:
        file_id = match.group(1)
        return f"https://drive.google.com/uc?export=download&id={file_id}&confirm=t"

    # Match open?id=FILE_ID
    match = re.search(r"drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)", url)
    if match:
        file_id = match.group(1)
        return f"https://drive.google.com/uc?export=download&id={file_id}&confirm=t"

    return url

async def load_image_pair(pre_url: str, post_url: str):
    """
    Downloads both images from URLs, resizes to 512x512, converts to RGB,
    normalizes to [0, 1] range.
    Returns: pre_array (512, 512, 3), post_array (512, 512, 3) float32 arrays
    """
    # Convert any Google Drive share links to direct download URLs
    pre_url = convert_gdrive_url(pre_url)
    post_url = convert_gdrive_url(post_url)
    logger.info(f"Fetching pre-image from: {pre_url}")
    logger.info(f"Fetching post-image from: {post_url}")

    async with httpx.AsyncClient(follow_redirects=True, timeout=60.0) as client:
        # Fetch both images concurrently for speed if possible, or sequentially
        pre_resp = await client.get(pre_url)
        post_resp = await client.get(post_url)
        
        pre_resp.raise_for_status()
        post_resp.raise_for_status()

        # Check if content is actually an image
        if "text/html" in pre_resp.headers.get("Content-Type", ""):
            logger.error(f"Pre-image URL returned HTML instead of an image. Snippet: {pre_resp.text[:200]}")
            raise ValueError("Pre-image URL returned a webpage (likely Google Drive login/warning) instead of a direct image file.")
        if "text/html" in post_resp.headers.get("Content-Type", ""):
            logger.error(f"Post-image URL returned HTML instead of an image. Snippet: {post_resp.text[:200]}")
            raise ValueError("Post-image URL returned a webpage (likely Google Drive login/warning) instead of a direct image file.")
        
    def process_image(img_bytes):
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        img = img.resize((512, 512), Image.LANCZOS)
        arr = np.array(img, dtype=np.float32) / 255.0
        return arr

    pre_array = process_image(pre_resp.content)
    post_array = process_image(post_resp.content)
    
    return pre_array, post_array

def normalize_pair(pre_img: np.ndarray, post_img: np.ndarray):
    """
    Applies ImageNet normalization.
    """
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    
    pre_norm = (pre_img - mean) / std
    post_norm = (post_img - mean) / std
    
    return pre_norm, post_norm

def concatenate_channels(pre_img: np.ndarray, post_img: np.ndarray):
    """
    Transposes from (H, W, C) to (C, H, W), concatenates to (6, H, W)
    and adds batch dimension (1, 6, H, W).
    """
    # Transpose to (C, H, W)
    pre_t = pre_img.transpose(2, 0, 1)
    post_t = post_img.transpose(2, 0, 1)
    
    # Concatenate along channel axis
    cat_img = np.concatenate([pre_t, post_t], axis=0)
    
    # Convert to tensor and add batch dimension
    tensor = torch.from_numpy(cat_img).unsqueeze(0)
    return tensor

async def preprocess_image_pair(pre_url: str, post_url: str):
    """
    Orchestrator function that calls the pipeline steps.
    """
    try:
        pre_arr, post_arr = await load_image_pair(pre_url, post_url)
    except Exception as e:
        logger.error(f"Failed to load images from URLs: {str(e)}")
        raise ValueError(f"Network error or invalid image: {str(e)}") from e
        
    try:
        if pre_arr.shape != (512, 512, 3) or post_arr.shape != (512, 512, 3):
            raise ValueError(f"Shape mismatch: {pre_arr.shape} vs {(512, 512, 3)}")
            
        pre_norm, post_norm = normalize_pair(pre_arr, post_arr)
        tensor = concatenate_channels(pre_norm, post_norm)
        return tensor
        
    except Exception as e:
        logger.error(f"Preprocessing failed: {str(e)}")
        raise ValueError(f"Image processing error: {str(e)}") from e
