import pandas as pd
import os

# Configuration
file_path = "aggregated_data.csv"  # Update this to the correct path
output_folder = "split_datasets"  # Directory to save the split files
chunk_size = 500  # Number of rows per chunk

def validate_file_path(file_path):
    """Check if the input file exists."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found at path: {file_path}")
    print(f"File found at path: {file_path}")

def ensure_output_folder(output_folder):
    """Ensure the output folder exists."""
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    print(f"Output folder ensured at path: {output_folder}")

def split_dataset(file_path, output_folder, chunk_size):
    """Split a large dataset into smaller chunks and save them."""
    try:
        print("Loading dataset...")
        data = pd.read_csv(file_path)
        print(f"Dataset loaded successfully with {len(data)} rows.")

        # Splitting into chunks
        chunks = [data[i:i + chunk_size] for i in range(0, len(data), chunk_size)]
        print(f"Splitting dataset into {len(chunks)} chunks of {chunk_size} rows each.")

        # Save each chunk
        for idx, chunk in enumerate(chunks):
            output_file = os.path.join(output_folder, f"dataset_part_{idx + 1}.csv")
            chunk.to_csv(output_file, index=False)
            print(f"Saved chunk {idx + 1}: {output_file} ({len(chunk)} rows)")

        print("Dataset successfully split into smaller files.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    try:
        # Validate and ensure paths
        validate_file_path(file_path)
        ensure_output_folder(output_folder)
        
        # Split the dataset
        split_dataset(file_path, output_folder, chunk_size)
    except Exception as e:
        print(f"Fatal error: {e}")
