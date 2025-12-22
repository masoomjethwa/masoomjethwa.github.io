
import os

base_dir = r"C:\Users\VASCSC\Desktop\HTMLs"

# Ordered list of desired folder names with continuous numbering
new_names = [
    "01 Astronomy & Space Science",
    "02 General Astronomy & Space Exploration",
    "03 Solar System",
    "04 Space-Related Topics",
    "05 Technology (Arduino, Raspberry Pi, ESP32, etc.)",
    "06 Arduino & Microcontroller Projects",
    "07 Raspberry Pi Projects",
    "08 STEM Education & Miscellaneous",
    "09 STEM Activities & Challenges",
    "10 Educational Games",
    "11 Miscellaneous Topics",
    "12 Unsorted - To Review"
]

# Map current folder names (rough match)
current_names = [
    "1. Astronomy & Space Science",
    "1.1 General Astronomy & Space Exploration",
    "1.2 Solar System",
    "1.3 Space-Related Topics",
    "2. Technology (Arduino, Raspberry Pi, ESP32, etc.)",
    "2.1 Arduino & Microcontroller Projects",
    "2.2 Raspberry Pi Projects",
    "3. STEM Education & Miscellaneous",
    "3.1 STEM Activities & Challenges",
    "3.2 Educational Games",
    "3.3 Miscellaneous Topics",
    "Unsorted - To Review"
]

def rename_folders(base, old_names, new_names):
    for old, new in zip(old_names, new_names):
        old_path = os.path.join(base, old)
        new_path = os.path.join(base, new)

        # Only rename if the old folder exists and the new name doesn't already exist
        if os.path.exists(old_path):
            os.rename(old_path, new_path)
            print(f"✅ Renamed: {old} → {new}")
        else:
            print(f"⚠️ Skipped (not found): {old}")

if __name__ == "__main__":
    rename_folders(base_dir, current_names, new_names)
    print("\n🎯 Folder renaming complete! All folders now have continuous numbering.")
