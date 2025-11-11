from pathlib import Path

OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(exist_ok=True)

def save_local(bytes_data: bytes, filename: str) -> str:
    path = OUTPUT_DIR / filename
    with open(path, "wb") as f:
        f.write(bytes_data)
    return str(path)
