import json

def compute_iou_code():
    return [
        "def compute_iou(pred_mask, true_mask, num_classes=4):\n",
        "  ious = []\n",
        "  pred = torch.argmax(pred_mask, dim=1)\n",
        "  for cls in range(1, num_classes):  # skip class 0 (no change)\n",
        "    pred_cls = (pred == cls)\n",
        "    true_cls = (true_mask == cls)\n",
        "    intersection = (pred_cls & true_cls).sum().float()\n",
        "    union = (pred_cls | true_cls).sum().float()\n",
        "    if union == 0:\n",
        "      continue\n",
        "    ious.append((intersection / union).item())\n",
        "  return sum(ious) / len(ious) if ious else 0.0\n"
    ]

def dataloader_code():
    return [
        "from torch.utils.data import DataLoader\n",
        "\n",
        "train_dataset = xBDDataset(XBD_PATH, split='train', \n",
        "  disaster_types=['turkey_earthquake'])\n",
        "val_dataset = xBDDataset(XBD_PATH, split='tier3',\n",
        "  disaster_types=['turkey_earthquake'])\n",
        "\n",
        "train_loader = DataLoader(train_dataset, batch_size=4, \n",
        "  shuffle=True, num_workers=2, pin_memory=True)\n",
        "val_loader = DataLoader(val_dataset, batch_size=4, \n",
        "  shuffle=False, num_workers=2)\n"
    ]

def loop_code():
    return [
        "NUM_EPOCHS = 25\n",
        "\n",
        "class_weights = torch.tensor([0.1, 1.0, 1.5, 1.5]).to(device)\n",
        "criterion = nn.CrossEntropyLoss(weight=class_weights)\n",
        "optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)\n",
        "scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(\n",
        "  optimizer, mode='min', patience=3, factor=0.5)\n",
        "\n",
        "best_val_loss = float('inf')\n",
        "\n",
        "for epoch in range(NUM_EPOCHS):\n",
        "  # --- Training phase ---\n",
        "  model.train()\n",
        "  train_loss = 0.0\n",
        "  for batch in train_loader:\n",
        "    images = batch['image'].to(device)   # (B, 6, 512, 512)\n",
        "    masks = batch['mask'].to(device)     # (B, 512, 512) long tensor\n",
        "    \n",
        "    optimizer.zero_grad()\n",
        "    outputs = model(images)              # (B, 4, 512, 512)\n",
        "    loss = criterion(outputs, masks)\n",
        "    loss.backward()\n",
        "    optimizer.step()\n",
        "    train_loss += loss.item()\n",
        "  \n",
        "  avg_train_loss = train_loss / len(train_loader)\n",
        "  \n",
        "  # --- Validation phase ---\n",
        "  model.eval()\n",
        "  val_loss = 0.0\n",
        "  val_iou = 0.0\n",
        "  with torch.no_grad():\n",
        "    for batch in val_loader:\n",
        "      images = batch['image'].to(device)\n",
        "      masks = batch['mask'].to(device)\n",
        "      outputs = model(images)\n",
        "      loss = criterion(outputs, masks)\n",
        "      val_loss += loss.item()\n",
        "      val_iou += compute_iou(outputs, masks)\n",
        "  \n",
        "  avg_val_loss = val_loss / len(val_loader)\n",
        "  avg_val_iou = val_iou / len(val_loader)\n",
        "  scheduler.step(avg_val_loss)\n",
        "  \n",
        "  # Save best model\n",
        "  if avg_val_loss < best_val_loss:\n",
        "    best_val_loss = avg_val_loss\n",
        "    torch.save(model.state_dict(), \n",
        "      '/content/drive/MyDrive/disasterscout_best.pth')\n",
        "    print(f\"  ✓ Best model saved (val_loss: {avg_val_loss:.4f})\")\n",
        "  \n",
        "  print(f\"Epoch [{epoch+1}/{NUM_EPOCHS}] \"\n",
        "        f\"Train Loss: {avg_train_loss:.4f} | \"\n",
        "        f\"Val Loss: {avg_val_loss:.4f} | \"\n",
        "        f\"Val IoU: {avg_val_iou:.4f}\")\n",
        "\n",
        "print(\"Training complete. Best checkpoint saved to Google Drive.\")\n"
    ]

def early_stopping_code():
    return [
        "print(\"WARNING: IoU below 0.35. Try: reduce lr to 1e-5, add more augmentation, check dataset path is correct.\")\n"
    ]

with open('/Users/suryanshsingh/workspace/diasater_scout/disasterscout/notebooks/01_train.ipynb', 'r') as f:
    nb = json.load(f)

# The skeleton cell was the 9th cell (index 8). Let's find it by looking for `# Training loop skeleton`
skeleton_idx = -1
for i, cell in enumerate(nb['cells']):
    if cell['cell_type'] == 'code' and any('# Training loop skeleton' in line for line in cell['source']):
        skeleton_idx = i
        break

if skeleton_idx != -1:
    # Update this cell to be the dataloader + iou + training loop
    nb['cells'][skeleton_idx]['source'] = dataloader_code() + ["\n"] + compute_iou_code() + ["\n"] + loop_code()
    
    # Add the early stopping check cell right after it
    early_stop_cell = {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": early_stopping_code()
    }
    nb['cells'].insert(skeleton_idx + 1, early_stop_cell)

with open('/Users/suryanshsingh/workspace/diasater_scout/disasterscout/notebooks/01_train.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)
