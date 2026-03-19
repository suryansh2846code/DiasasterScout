"""
MODULE_NOTES: 
Images are resized to 512x512, normalized with ImageNet mean/std, 
and concatenated as a 6-channel tensor before being fed to the model.
"""

def load_image_pair(pre_path: str, post_path: str):
    """
    TODO Phase 1: Load pre and post disaster images from disk/URL and resize to 512x512.
    """
    raise NotImplementedError("TODO Phase 1: load images from paths")

def normalize_pair(pre_img, post_img):
    """
    TODO Phase 1: Normalize images using ImageNet mean/std.
    """
    raise NotImplementedError("TODO Phase 1: normalize images")

def concatenate_channels(pre_img, post_img):
    """
    TODO Phase 1: Concatenate pre and post image arrays along the channel dimension.
    Returns: (1, 6, H, W) tensor
    """
    raise NotImplementedError("TODO Phase 1: concatenate channels to 6-channel tensor")
