from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid
from makeup_ai import apply_artist_style
from storage import save_local

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate-makeup-preview")
async def generate_makeup_preview(image: UploadFile = File(...)):
    try:
        file_bytes = await image.read()
        result_bytes = apply_artist_style(file_bytes)
        filename = f"{uuid.uuid4().hex}.jpg"
        save_local(result_bytes, filename)
        return {"imageUrl": f"/outputs/{filename}"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/outputs/{filename}")
def get_output(filename: str):
    return FileResponse(f"outputs/{filename}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
