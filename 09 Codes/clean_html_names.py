import os
import re
from pathlib import Path

base_dir = Path(r"C:\Users\VASCSC\Desktop\HTMLs")

def clean_filename(name: str) -> str:
    # Remove existing numbering like 1.1_02_
    name = re.sub(r"^\d+(\.\d+)?_\d+_", "", name)
    name = re.sub(r"^\d+(\.\d+)?_", "", name)
    name = re.sub(r"Unsorted_", "", name)
    name = name.strip()
    return name

def rename_files_in_folder(folder: Path):
    html_files = sorted(folder.glob("*.html"))
    for idx, file in enumerate(html_files, start=1):
        clean_name = clean_filename(file.name)
        new_name = f"{idx:02d}_{clean_name}"
        new_path = folder / new_name
        if new_path != file:
            file.rename(new_path)
            print(f"✅ {file.name} → {new_name}")

def move_unsorted_files(base_dir: Path):
    unsorted = list(base_dir.glob("Unsorted_*.html"))
    if unsorted:
        dest = base_dir / "08  Miscellaneous Topics"
        for file in unsorted:
            target = dest / file.name
            file.rename(target)
            print(f"📦 Moved unsorted file → {target.name}")

def main():
    move_unsorted_files(base_dir)

    for folder in base_dir.iterdir():
        if folder.is_dir():
            print(f"\n📁 Cleaning folder: {folder.name}")
            rename_files_in_folder(folder)

    print("\n🎯 All filenames cleaned and renumbered successfully!")

if __name__ == "__main__":
    main()
