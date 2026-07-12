from PIL import Image

def remove_dark_bg(input_path, output_path, tolerance=40):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Check if the pixel is dark enough to be considered background
        if item[0] < tolerance and item[1] < tolerance and item[2] < tolerance:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    import os
    os.makedirs(r"c:\Users\home\Desktop\office-staff-App\src\assets", exist_ok=True)
    remove_dark_bg(r"C:\Users\home\.gemini\antigravity\brain\70547b0a-8511-4fba-a3d7-02010aa82859\digistaff_ds_logo_1783831781528.jpg", r"c:\Users\home\Desktop\office-staff-App\src\assets\logo.png")
