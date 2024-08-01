import os
import pandas as pd
from openpyxl import Workbook
from openpyxl.drawing.image import Image

# Function to read SVG files
def read_svg_file(filepath):
    with open(filepath, 'rb') as f:
        svg_data = f.read()
    return svg_data

# Function to process a folder
def process_folder(folder_path, wb):
    csv_file = os.path.join(folder_path, 'list.csv')
    if os.path.exists(csv_file):
        df = pd.read_csv(csv_file)
        ws = wb.create_sheet(title=os.path.basename(folder_path))
        ws.append(['Name', 'SVG'])

        for _, row in df.iterrows():
            # name = row['name']
            name = str(row['name']) + '.svg'
            svg_path = os.path.join(folder_path, name)
            if os.path.exists(svg_path):
                svg_data = read_svg_file(svg_path)
                ws.append([name, svg_data])
    else:
        print(f"Warning: {csv_file} does not exist.")

# Main function
def main():
    asset_folder = 'assets/Bros'
    output_filename = 'output.xlsx'

    wb = Workbook()
    for folder_name in os.listdir(asset_folder):
        folder_path = os.path.join(asset_folder, folder_name)
        if os.path.isdir(folder_path):
            process_folder(folder_path, wb)

    wb.remove(wb['Sheet'])  # Remove default sheet
    wb.save(output_filename)
    print(f"Excel file '{output_filename}' created successfully.")

if __name__ == "__main__":
    main()
