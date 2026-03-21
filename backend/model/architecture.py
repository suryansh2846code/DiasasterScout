import segmentation_models_pytorch as smp

DAMAGE_CLASSES = {
    0: "no_change",
    1: "flood",
    2: "structural_damage",
    3: "road_blockage"
}

DAMAGE_COLORS = {
    0: "transparent",
    1: "#3B8BD4",
    2: "#E24B4A",
    3: "#EF9F27"
}

def build_model():
    """
    Build and return the U-Net model using segmentation_models_pytorch.
    Uses resnet50 encoder with ImageNet weights.
    Accepts 6-channel input (concatenated pre and post images).
    Outputs 4 classes without activation (we apply softmax manually during inference).
    """
    model = smp.Unet(
        encoder_name='resnet50',
        encoder_weights='imagenet',
        in_channels=6,
        classes=4,
        activation=None
    )
    return model

def get_model_info(model):
    """
    Returns parameter count and expected input shape.
    """
    param_count = sum(p.numel() for p in model.parameters())
    input_shape = (1, 6, 512, 512)
    return {
        "parameters": param_count,
        "input_shape": input_shape
    }
