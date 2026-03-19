def run_inference(pre_image_path: str, post_image_path: str, model, device):
    """
    Runs model inference on a pre/post satellite image pair.
    
    Returns:
        numpy array: A numpy array of shape (H, W) with values 0-3 corresponding 
        to the DAMAGE_CLASSES.
    """
    # TODO Phase 1: load images, preprocess, run model, return mask
    raise NotImplementedError("TODO Phase 1: load images, preprocess, run model, return mask")
