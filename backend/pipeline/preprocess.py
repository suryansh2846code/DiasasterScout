import httpx
from PIL import Image
from io import BytesIO
import numpy as np
import torch
import logging

logger = logging.getLogger(__name__)

async def load_image_pair(pre_url: str, post_url: str):
    """
    Downloads both images from URLs, resizes to 512x512, converts to RGB,
    normalizes to [0, 1] range.
    Returns: pre_array (512, 512, 3), post_array (512, 512, 3) float32 arrays
    """
    async with httpx.AsyncClient() as client:
        # Fetch both images concurrently for speed if possible, or sequentially
        pre_resp = await client.get(pre_url)
        post_resp = await client.get(post_url)
        
        pre_resp.raise_for_status()
        post_resp.raise_for_status()
        
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
