import sys
import traceback

def verify():
    print("--- DisasterScout Setup Verification ---")
    try:
        # 1. Python version
        print(f"1. Python version: {sys.version.split()[0]}")
        
        # 2. PyTorch version
        import torch
        print(f"2. PyTorch version: {torch.__version__}")
        
        # 3. CUDA available
        cuda_available = torch.cuda.is_available()
        print(f"3. CUDA available: {cuda_available}")
        
        # 4. GPU info
        if cuda_available:
            print(f"4. GPU Name: {torch.cuda.get_device_name(0)}")
            print(f"   GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
        else:
            print("4. GPU info: N/A (CPU only)")
        
        # 5. Import smp
        try:
            import segmentation_models_pytorch as smp
            print("5. segmentation_models_pytorch imported successfully")
        except ImportError as e:
            raise Exception("Failed to import segmentation_models_pytorch") from e
            
        # 6. Build U-Net model
        from model.architecture import build_model, get_model_info
        print("6. Building U-Net model...")
        model = build_model()
        model.eval()
        print("   Model built successfully")
        
        # 7. Create random tensor
        print("7. Creating random input tensor (1, 6, 512, 512)...")
        dummy_input = torch.randn(1, 6, 512, 512)
        
        # 8. Run forward pass
        print("8. Running forward pass...")
        with torch.no_grad():
            output = model(dummy_input)
            
        # 9. Output shape
        print(f"9. Output shape: {output.shape} (Expected: torch.Size([1, 4, 512, 512]))")
        if output.shape != (1, 4, 512, 512):
            raise Exception(f"Unexpected output shape: {output.shape}")
            
        # 10. Parameter count
        info = get_model_info(model)
        param_count_m = info['parameters'] / 1e6
        print(f"10. Total model parameters: {param_count_m:.2f}M (Expected: ~32.55M)")
        
        # 11. Success
        print("\nALL CHECKS PASSED ✓")
        
    except Exception as e:
        # 12. Failure
        print(f"\nFAILED: {e}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    verify()
