import webview
import os
import sys

def get_resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.dirname(os.path.abspath(__file__))
    
    return os.path.join(base_path, relative_path)

def main():
    html_path = get_resource_path("index.html")
    
    if not os.path.exists(html_path):
        input("Нажмите Enter для выхода...")
        return
    
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    
    window = webview.create_window(
        title="FakeFace v.0.9b",
        url=file_url,
        width=820,
        height=700,
        resizable=True,
        min_size=(700, 550)
    )
    
    webview.start(debug=False, gui=None)

if __name__ == "__main__":
    main()