import torch
import time
import numpy as np
import logging
from model.architecture import build_model
from pipeline.preprocess import preprocess_image_pair

logger = logging.getLogger(__name__)

def load_model(checkpoint_path: str, device: torch.device):
    model = build_model()
    try:
        state_dict = torch.load(checkpoint_path, map_location=device)
        model.load_state_dict(state_dict)
    except Exception as e:
        logger.warning(f"Failed to load checkpoint from {checkpoint_path}: {e}")
        
    model.eval()
    model.to(device)
    print(f"Model loaded from {checkpoint_path}")
    return model

def run_inference(tensor: torch.Tensor, model: torch.nn.Module, device: torch.device):
    tensor = tensor.to(device)
    with torch.no_grad():
        output = model(tensor)  # (1, 4, 512, 512)
        probabilities = torch.softmax(output, dim=1)  # (1, 4, 512, 512)
        
        # Argmax to get mask
        mask = torch.argmax(probabilities, dim=1)  # (1, 512, 512)
        mask = mask.squeeze().cpu().numpy().astype(np.uint8)  # (512, 512)
        
        # Extract confidence map
        max_probs = probabilities.max(dim=1).values.squeeze().cpu().numpy()
        
    return mask, max_probs

async def run_full_pipeline(pre_url: str, post_url: str, checkpoint_path: str):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # 1. Preprocess
    t0 = time.time()
    tensor = await preprocess_image_pair(pre_url, post_url)
    t1 = time.time()
    print(f"Preprocessing completed in {t1 - t0:.3f} seconds")
    
    # 2. Load model
    model = load_model(checkpoint_path, device)
    t2 = time.time()
    print(f"Model loading completed in {t2 - t1:.3f} seconds")
    
    # 3. Inference
    mask, confidence_map = run_inference(tensor, model, device)
    t3 = time.time()
    print(f"Inference completed in {t3 - t2:.3f} seconds")
    
    print(f"Total pipeline run_full_pipeline completed in {t3 - t0:.3f} seconds")
    return mask, confidence_map, device
